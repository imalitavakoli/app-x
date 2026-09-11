import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MARKER_START,
  MARKER_END,
  upsertMarkedBlock,
  detectHost,
  skipResult,
  parseBitbucketRemote,
  parseBitbucketPrUrl,
  classifySkip,
  githubHasAuth,
  isOpenPullState,
  resolveBitbucketRepo,
  bitbucketListSkipReason,
  bitbucketGetByIdFailure,
  githubRestFindSkipReason,
} from './publish-pr-description.mjs';

const REPORT = '# Code review — `feat/x`\n\nPass.\n';

test('upsert: empty body becomes the marked block only', () => {
  const out = upsertMarkedBlock('', REPORT);
  assert.equal(out.startsWith(MARKER_START), true);
  assert.equal(out.includes(MARKER_END), true);
  assert.equal(out.includes('# Code review'), true);
});

test('upsert: prepends block and keeps existing body below', () => {
  const out = upsertMarkedBlock('Existing summary\n\n![shot](x.png)', REPORT);
  const start = out.indexOf(MARKER_START);
  const end = out.indexOf(MARKER_END);
  const existing = out.indexOf('Existing summary');
  assert.ok(start < end && end < existing);
});

test('upsert: second run replaces the block, does not stack', () => {
  const first = upsertMarkedBlock('keep me', REPORT);
  const second = upsertMarkedBlock(first, '# Code review — v2\n');
  assert.equal([...second.matchAll(/x-code-diff-reviewer:start/g)].length, 1);
  assert.equal(second.includes('v2'), true);
  assert.equal(second.includes('Pass.'), false);
  assert.equal(second.includes('keep me'), true);
});

test('detectHost: github.com → github, bitbucket.org → bitbucket, else unknown', () => {
  assert.equal(detectHost('https://github.com/o/r.git'), 'github');
  assert.equal(detectHost('https://ali@bitbucket.org/eliq/webx.git'), 'bitbucket');
  assert.equal(detectHost('https://gitlab.com/o/r.git'), 'unknown');
  assert.equal(detectHost(''), 'unknown');
});

test('skipResult shape', () => {
  assert.deepEqual(skipResult('no-pr'), { status: 'skipped', reason: 'no-pr' });
});

test('parseBitbucketRemote: https and ssh', () => {
  assert.deepEqual(parseBitbucketRemote('https://bitbucket.org/eliq/webx.git'), {
    workspace: 'eliq',
    repo: 'webx',
  });
  assert.deepEqual(parseBitbucketRemote('git@bitbucket.org:eliq/webx.git'), {
    workspace: 'eliq',
    repo: 'webx',
  });
});

test('classifySkip: unknown host before no-pr', () => {
  assert.equal(classifySkip({ host: 'unknown', url: null }), 'unknown-host');
  assert.equal(classifySkip({ host: 'github', url: null }), 'no-pr');
  assert.equal(classifySkip({ host: 'gitlab', url: 'https://gitlab.com/o/r/-/merge_requests/1' }), 'no-mapping');
});

test('classifySkip: hasAuth false is no-auth, not no-pr', () => {
  assert.equal(classifySkip({ host: 'github', url: null, hasAuth: false }), 'no-auth');
  assert.equal(classifySkip({ host: 'bitbucket', url: null, hasAuth: false }), 'no-auth');
  assert.equal(classifySkip({ host: 'github', url: null, hasAuth: true }), 'no-pr');
});

test('githubHasAuth: gh missing and no token is unauthenticated', () => {
  assert.equal(githubHasAuth({ ghMissing: true, hasToken: false }), false);
  assert.equal(githubHasAuth({ ghMissing: true, hasToken: true }), true);
  assert.equal(githubHasAuth({ ghMissing: false, hasToken: false }), true);
});

test('isOpenPullState: only open counts', () => {
  assert.equal(isOpenPullState('OPEN'), true);
  assert.equal(isOpenPullState('open'), true);
  assert.equal(isOpenPullState('MERGED'), false);
  assert.equal(isOpenPullState('closed'), false);
  assert.equal(isOpenPullState(undefined), false);
});

test('parseBitbucketPrUrl: workspace/repo/id from PR URL', () => {
  assert.deepEqual(
    parseBitbucketPrUrl('https://bitbucket.org/other-ws/other-repo/pull-requests/42'),
    { workspace: 'other-ws', repo: 'other-repo', id: 42 },
  );
});

test('resolveBitbucketRepo: --pr-url wins over origin', () => {
  assert.deepEqual(
    resolveBitbucketRepo({
      remoteUrl: 'https://bitbucket.org/eliq/webx.git',
      prUrlArg: 'https://bitbucket.org/other-ws/other-repo/pull-requests/42',
    }),
    { workspace: 'other-ws', repo: 'other-repo', id: 42 },
  );
  assert.deepEqual(
    resolveBitbucketRepo({
      remoteUrl: 'https://bitbucket.org/eliq/webx.git',
      prUrlArg: null,
    }),
    { workspace: 'eliq', repo: 'webx' },
  );
});

test('bitbucketListSkipReason: 401/403 is no-auth, not no-pr', () => {
  assert.equal(bitbucketListSkipReason(401), 'no-auth');
  assert.equal(bitbucketListSkipReason(403), 'no-auth');
  assert.equal(bitbucketListSkipReason(404), 'no-pr');
  assert.equal(bitbucketListSkipReason(200), null);
});

test('Bitbucket GET-by-id: 401/403 skips no-auth, 404 skips no-pr, never found+errorStatus', () => {
  assert.deepEqual(bitbucketGetByIdFailure(401), { found: false, skipReason: 'no-auth' });
  assert.deepEqual(bitbucketGetByIdFailure(403), { found: false, skipReason: 'no-auth' });
  assert.deepEqual(bitbucketGetByIdFailure(404), { found: false, skipReason: 'no-pr' });
  assert.deepEqual(bitbucketGetByIdFailure(500), { found: false, skipReason: 'no-pr' });
  assert.equal(bitbucketGetByIdFailure(200), null);
});

test('GitHub REST find: 401/403 is no-auth, not no-pr', () => {
  assert.equal(githubRestFindSkipReason(401), 'no-auth');
  assert.equal(githubRestFindSkipReason(403), 'no-auth');
  assert.equal(githubRestFindSkipReason(404), 'no-pr');
  assert.equal(githubRestFindSkipReason(200), null);
});
