#!/usr/bin/env node
// SessionStart hook: reports when Superpowers has moved to a version this
// workflow has never been reviewed against.
//
// Why SessionStart and not the edit-time hook: Claude Code resolves plugins at
// startup, so a version change is already in effect before anyone is looking —
// so the new version is already in effect by then, and it can arrive without any
// diff to review. The
// edit-time PostToolUse guard does run the same check, but only when someone
// edits a workflow doc, which is the RAREST activity in the repo. Between an
// upgrade and the next workflow edit, every cycle would run against an
// unreviewed version and nothing would say so. This fires every session, which
// is the first moment after an upgrade that anyone is present to be told.
//
// Silent when the versions match — a hook that speaks every session is a hook
// people learn to skim.
//
// Delegates the comparison to the checker's own `sp-version` rule, so the rule
// lives in exactly one place. Pure Node for cross-platform parity.

import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// `emit` only — no stdin. `readFileSync(0)` blocks, and a session-start hook
// that blocks can hang the session before anyone sees a word of it; failing
// closed is the contract these hooks are built on. Deriving the event name would
// buy nothing either: `SessionStart` is spelled identically in every harness
// verified so far (Claude Code, Codex, Gemini), and a harness that named it
// differently while offering no readable stdin would fall back to this same
// literal. The edit guard derives, because its event names really do differ.
import { emit } from './harness.mjs';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(scriptDir, '..', '..');
const CHECKER = join(
  ROOT,
  '.agents',
  'skills',
  'x-sp-workflow-helper',
  'scripts',
  'check-workflow.mjs',
);

if (!existsSync(CHECKER)) process.exit(0); // nothing to check against

let result;
try {
  const out = execFileSync(
    process.execPath,
    [CHECKER, '--rule=sp-version', '--json'],
    {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 30_000,
    },
  );
  result = JSON.parse(out);
} catch (err) {
  // Exit 1 is the expected path when the rule FAILS — the payload is still on
  // stdout. Anything else (crash, timeout, unparseable) stays silent rather
  // than opening every session with noise about our own tooling.
  try {
    result = JSON.parse(err.stdout ?? '');
  } catch {
    process.exit(0);
  }
}

const rule = result?.results?.find((r) => r.id === 'sp-version');
if (!rule || rule.skipped || rule.failures?.length === 0) process.exit(0);

const detail = [...(rule.failures ?? []), ...(rule.details ?? [])]
  .join(' ')
  .replace(/\s+/g, ' ');

emit({
  systemMessage:
    'Superpowers version changed — the workflow upgrade review is owed. See ' +
    '.agents/skills/x-sp-workflow-helper/references/superpowers-upgrade.md',
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext:
      'SUPERPOWERS VERSION CHANGED SINCE THIS WORKFLOW WAS LAST REVIEWED.\n\n' +
      `${detail}\n\n` +
      'Our workflow is a layer over Superpowers and relies on behaviours Superpowers does not ' +
      'know it promises — a dozen of them rest on single sentences in its own skill files. An ' +
      'upgrade therefore cannot fail loudly; it can only start behaving differently while every ' +
      'one of our files still reads correctly.\n\n' +
      'WHAT TO DO — this is an escalation, not your task to absorb. Reviewing and updating the ' +
      "workflow is the Workspace Specialist's job. " +
      'So: tell the user at the START of your reply, before doing anything else, and ask whether ' +
      'they are that person.\n' +
      '  - If YES and they want it done now: work through ' +
      'the `x-sp-workflow-helper` skill and follow its upgrade playbook.\n' +
      '  - If NO, or they want to get on with their actual request: proceed with it, but say ' +
      'plainly that the workflow is running against an unreviewed Superpowers version, so a ' +
      'hook may attach to a lifecycle moment that has moved. Do not attempt the review yourself ' +
      'and do not treat the request as blocked.\n\n' +
      'Either way: do NOT update `scripts/superpowers-baseline.json` to silence this. Bumping it ' +
      'without doing the review removes the only thing that noticed, and the next person sees a ' +
      'green check that means nothing.',
  },
});
