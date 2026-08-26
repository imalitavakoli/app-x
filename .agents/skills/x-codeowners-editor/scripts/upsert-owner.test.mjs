import { test } from 'node:test';
import assert from 'node:assert/strict';
import { upsertOwner, comparePaths } from './upsert-owner.mjs';

const SAMPLE = `# CODEOWNERS
# header

# //////////////////////////////////////////////////////////////////////////// #
# Global fallback & this file                                                  #
# //////////////////////////////////////////////////////////////////////////// #

* @Ali
CODEOWNERS @Ali

# //////////////////////////////////////////////////////////////////////////// #
# libs/shared/ui/                                                              #
# //////////////////////////////////////////////////////////////////////////// #

/libs/shared/ui/ng-alpha/ @Ali

/libs/shared/ui/ng-gamma/ @Bob

# //////////////////////////////////////////////////////////////////////////// #
# _OBS/ (personal / legacy — not product code)                                 #
# //////////////////////////////////////////////////////////////////////////// #

/_OBS/ali/ @Ali
`;

test('comparePaths: directory before longer sibling (slash ranks below other chars)', () => {
  assert.equal(comparePaths('/libs/shared/util/ng-bases/', '/libs/shared/util/ng-bases-model/'), -1);
});

test('create adds a line in the matching section, grouped by owner', () => {
  const { text, action } = upsertOwner(SAMPLE, {
    path: '/libs/shared/ui/ng-beta/',
    owner: '@Ali',
    mode: 'create',
  });
  assert.equal(action, 'added');
  const ui = text.split('libs/shared/ui/').slice(1).join('libs/shared/ui/');
  assert.match(ui, /\/libs\/shared\/ui\/ng-alpha\/ @Ali\n\/libs\/shared\/ui\/ng-beta\/ @Ali/);
  assert.ok(ui.indexOf('/libs/shared/ui/ng-beta/') < ui.indexOf('/libs/shared/ui/ng-gamma/'));
});

test('create on an existing path throws (that is a handoff)', () => {
  assert.throws(
    () => upsertOwner(SAMPLE, { path: '/libs/shared/ui/ng-alpha/', owner: '@Bob', mode: 'create' }),
    /handoff/,
  );
});

test('handoff rewrites the owner and does not duplicate the path', () => {
  const { text, action } = upsertOwner(SAMPLE, {
    path: '/libs/shared/ui/ng-alpha/',
    owner: '@Bob',
    mode: 'handoff',
  });
  assert.equal(action, 'rewritten');
  assert.equal([...text.matchAll(/\/libs\/shared\/ui\/ng-alpha\//g)].length, 1);
  assert.match(text, /\/libs\/shared\/ui\/ng-alpha\/ @Bob/);
});

test('handoff on a missing path throws', () => {
  assert.throws(
    () => upsertOwner(SAMPLE, { path: '/libs/shared/ui/ng-missing/', owner: '@Bob', mode: 'handoff' }),
    /not found/,
  );
});

test('create with no matching section lands after the global fallback, never before', () => {
  // ".github/workflows/" sorts, in plain string comparison, before "Global
  // fallback & this file" (the meta-section title, not a path — '.' is
  // below 'G'), so a naive title-order insert places it ahead of the
  // fallback section. Because CODEOWNERS is last-matching-rule-wins, that
  // would let the fallback's "* @Ali" silently override the specific line
  // we just added. It must land after it, always.
  const { text } = upsertOwner(SAMPLE, {
    path: '/.github/workflows/',
    owner: '@Ali',
    mode: 'create',
  });
  assert.ok(text.indexOf('Global fallback') < text.indexOf('.github'));
});

test('sibling creates under the same new top-level directory join one section', () => {
  const { text: afterFirst } = upsertOwner(SAMPLE, {
    path: '/build-tools/ci/',
    owner: '@Ali',
    mode: 'create',
  });
  const { text } = upsertOwner(afterFirst, {
    path: '/build-tools/lint/',
    owner: '@Bob',
    mode: 'create',
  });
  const bannerCount = [...text.matchAll(/# build-tools\/\s*#/g)].length;
  assert.equal(bannerCount, 1);
  assert.match(text, /\/build-tools\/ci\/ @Ali/);
  assert.match(text, /\/build-tools\/lint\/ @Bob/);
});

test('tab-separated entry survives a create into the same section', () => {
  const withTab = SAMPLE.replace('/libs/shared/ui/ng-alpha/ @Ali', '/libs/shared/ui/ng-alpha/\t@Ali');
  const { text } = upsertOwner(withTab, {
    path: '/libs/shared/ui/ng-beta/',
    owner: '@Ali',
    mode: 'create',
  });
  assert.match(text, /\/libs\/shared\/ui\/ng-alpha\/ @Ali/);
  assert.match(text, /\/libs\/shared\/ui\/ng-beta\/ @Ali/);
});

test('parent path stays above a nested override even when owners would invert', () => {
  // Owners are @Zed (grandparent) / @Mid (parent) / @Ann (child) — alphabetical
  // owner order (@Ann < @Mid < @Zed) is the exact REVERSE of path-nesting order,
  // so sorting by owner alone would put the child first and the grandparent
  // last. Parent-before-child enforcement must still win.
  const start = SAMPLE.replace(
    '/libs/shared/ui/ng-alpha/ @Ali\n',
    '/libs/shared/ui/ng-alpha/ @Zed\n/libs/shared/ui/ng-alpha/android/ @Mid\n',
  );
  const { text } = upsertOwner(start, {
    path: '/libs/shared/ui/ng-alpha/android/extra/',
    owner: '@Ann',
    mode: 'create',
  });
  const grandparent = text.indexOf('/libs/shared/ui/ng-alpha/ @Zed');
  const parent = text.indexOf('/libs/shared/ui/ng-alpha/android/ @Mid');
  const child = text.indexOf('/libs/shared/ui/ng-alpha/android/extra/ @Ann');
  assert.ok(grandparent >= 0 && parent > grandparent && child > parent);
});
