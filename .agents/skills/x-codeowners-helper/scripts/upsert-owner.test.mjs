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
