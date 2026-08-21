#!/usr/bin/env node
// Guards the Superpowers-First Workflow surfaces against silent breakage.
//
//   workflow-edit-guard.mjs pre    (PreToolUse)  — remind, before the edit
//   workflow-edit-guard.mjs post   (PostToolUse) — run the checker, after it
//
// Fires ONLY when the edited path is one of the guarded surfaces. Every other
// Edit/Write in the session exits at the path test, having done nothing.
//
// Why a hook and not the skill's own description: skill discovery is a match on
// prose and can miss. A hook is run by the harness, so the CHECK is guaranteed
// even when the skill never loaded. The reminder is still only a reminder — a
// hook cannot force a read — but it arrives at the moment of the edit, which is
// the moment it can still change the outcome.
//
// Pure Node (no jq / bash / PowerShell syntax) so it behaves identically on
// macOS, Linux and Windows. Paths resolve relative to this script.

import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, isAbsolute } from 'node:path';

const mode = process.argv[2] === 'post' ? 'post' : 'pre';
const scriptDir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(scriptDir, '..', '..');
const CHECKER = join(
  ROOT, '.agents', 'skills', 'x-sp-workflow-helper', 'scripts', 'check-workflow.mjs',
);

// Surfaces the checker governs. Keep in step with config.mjs.
//
// Skill paths are narrowed to the `x-` prefix on purpose: `.agents/skills/` also
// holds plugin-provided skills (`nx-*`), which are not ours to edit and which
// the checker does not govern. Guarding the whole directory would fire on every
// plugin-skill touch and teach people to ignore the reminder.

/** Matched exactly. */
const GUARDED_FILES = ['AGENTS.md', 'AGENTS.local.md', '.claude/settings.json'];

/** Matched as a path prefix. */
const GUARDED_PREFIXES = [
  'docs/agents/',
  '.agents/skills/x-',
  '.claude/skills/x-',
  '.claude/hooks/',
];

const emit = (obj) => { process.stdout.write(JSON.stringify(obj)); process.exit(0); };
const quiet = () => process.exit(0);

/* ------------------------------------------------- read the hook's stdin */

let raw = '';
try {
  raw = readFileSync(0, 'utf8');
} catch {
  quiet(); // no stdin — nothing to judge
}

let payload;
try {
  payload = JSON.parse(raw || '{}');
} catch {
  quiet(); // malformed payload is not our problem to report
}

const filePath =
  payload?.tool_input?.file_path ??
  payload?.tool_response?.filePath ??
  '';
if (!filePath) quiet();

// Normalise to a repo-relative, forward-slash path so the prefix test works on
// Windows (where the harness reports C:\... ) as well as POSIX.
const slashed = filePath.split('\\').join('/');
const relPath = (isAbsolute(filePath) ? relative(ROOT, filePath) : filePath)
  .split('\\').join('/');

const strictHit = !relPath.startsWith('..')
  && (GUARDED_FILES.includes(relPath)
    || GUARDED_PREFIXES.some((p) => relPath.startsWith(p)));

// Fallback: match the guarded segment anywhere in the path. This deliberately
// errs toward firing, because a path flavour we failed to anticipate (a POSIX
// /c/... spelling, a symlinked checkout, a worktree) would otherwise make the
// GUARD fail silently — the precise failure mode it exists to prevent. The cost
// of a false positive is one extra reminder and one fast checker run.
const looseHit =
  GUARDED_FILES.some((f) => slashed.endsWith(`/${f}`) || slashed === f)
  || GUARDED_PREFIXES.some((p) => slashed.includes(`/${p}`) || slashed.startsWith(p));

if (!strictHit && !looseHit) quiet();

/* ------------------------------------------------------------------ pre */

if (mode === 'pre') {
  emit({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      additionalContext:
        `You are about to edit \`${relPath}\`, a Superpowers-First Workflow surface. ` +
        'These files are held together by references — a hook ID cited from a `Spans:` line, ' +
        'an anchor in a pointer, a Superpowers skill name a hook hangs off, a `description` ' +
        'duplicated into each tool stub — and every one of them breaks SILENTLY: the text still ' +
        'reads correctly afterwards, so review does not catch it.\n\n' +
        'Invoke the `x-sp-workflow-helper` skill before continuing, unless it is ' +
        'already in your context. It carries the change procedure, the sweep for a rule\'s other ' +
        'homes (which no script can find), and the Superpowers upgrade playbook. ' +
        'The integrity checker runs automatically after this edit.',
    },
  });
}

/* ----------------------------------------------------------------- post */

if (!existsSync(CHECKER)) {
  emit({
    systemMessage:
      `Workflow guard: checker not found at ${relative(ROOT, CHECKER)} — edit NOT verified.`,
  });
}

let out = '';
let failed = false;
try {
  out = execFileSync(process.execPath, [CHECKER], {
    cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 60_000,
  });
} catch (err) {
  failed = true;
  out = `${err.stdout ?? ''}${err.stderr ?? ''}` || String(err.message);
}

if (!failed) {
  emit({
    suppressOutput: true,
    systemMessage: `Workflow guard: all integrity rules passed after editing ${relPath}.`,
  });
}

// Failures: surface to the user AND feed back to the model so it fixes them now.
const failingLines = out
  .split(/\r?\n/)
  .filter((l) => /^\[FAIL\]|^\s+✗|failure\(s\)/.test(l))
  .join('\n');

emit({
  systemMessage: `Workflow guard: integrity FAILURES after editing ${relPath}.`,
  hookSpecificOutput: {
    hookEventName: 'PostToolUse',
    additionalContext:
      `The workflow integrity checker failed after your edit to \`${relPath}\`. ` +
      'These are silent-breakage classes — the files still read correctly, so nothing else ' +
      'will catch them. Fix them before moving on, then re-run ' +
      '`pnpm run check:workflow`.\n\n' +
      `${failingLines || out}\n\n` +
      'If a finding is a genuine false positive, fix the RULE or add a justified entry to ' +
      "that skill's `scripts/allowlist.mjs` — never widen the " +
      'allowlist just to reach green.',
  },
});
