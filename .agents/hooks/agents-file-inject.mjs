#!/usr/bin/env node
// SessionStart hook: injects a small, always-inline directive telling the model
// to read AGENTS.md (and AGENTS.local.md, if present) IN FULL via the Read tool.
//
// Why a directive rather than the file's contents: the full AGENTS.md (~20 KB)
// exceeds Claude Code's inline hook-output cap, so the harness would persist it
// to a file and inject only a ~2 KB preview — the whole file would NOT reliably
// land in context. A compact directive (well under the cap) is guaranteed to be
// injected inline; the Read tool then loads the whole file reliably, since it
// paginates and never elides the middle the way `cat` does.
//
// Pure Node (no jq / bash / PowerShell syntax) so it behaves identically on
// macOS, Linux, and Windows. Paths are resolved relative to this script, so it
// works regardless of the process working directory.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// `emit` only — this hook deliberately does NOT read stdin. `readFileSync(0)` is
// a BLOCKING read, and blocking at session start (this hook has no configured
// timeout) hangs the session before anything else runs, which is a far worse
// outcome than a wrong event name. Cursor spells this event `sessionStart` and
// reads top-level `additional_context`; `emit()` mirrors the nested Claude Code
// field onto that name so this file still need not detect the harness.
import { emit } from './harness.mjs';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(scriptDir, '..', '..');

const agentsPath = join(ROOT, 'AGENTS.md');
if (!existsSync(agentsPath)) process.exit(0); // nothing to enforce

// Splitting on '\n' yields a trailing empty string for the newline that ends a
// well-formed text file, so drop it — otherwise every such file is reported one
// line too long. Counting this way is deliberately line-ending-agnostic: a CRLF
// line still ENDS with '\n' (the '\r' just rides along on the preceding piece),
// so the count is identical on a Windows checkout and a mac/linux one. That
// matters here: this repo sets core.autocrlf=true with no .gitattributes, so the
// same file really is CRLF on Windows and LF elsewhere.
const lineCount = (p) => {
  const text = readFileSync(p, 'utf8');
  if (text === '') return 0;
  return text.split('\n').length - (text.endsWith('\n') ? 1 : 0);
};

let directive =
  `MANDATORY — before acting on ANY request, read AGENTS.md IN FULL using the Read tool ` +
  `(NOT cat/Bash: cat truncates large output mid-file). It is ${lineCount(agentsPath)} lines at ` +
  `${agentsPath}. Verify you reached the last line before proceeding.`;

const localPath = join(ROOT, 'AGENTS.local.md');
if (existsSync(localPath)) {
  directive +=
    ` Then read AGENTS.local.md IN FULL (${lineCount(localPath)} lines at ${localPath}) — ` +
    `it layers on AGENTS.md; on conflict, local wins.`;
}

// A REJOIN is a cycle start, and it is the route this reminder exists to cover.
// A fresh session handed a plan path — or asked to continue work already in
// progress — reaches its first decision, and its first question to the user,
// without ever invoking a Superpowers skill. So the skill-invocation reminder
// cannot have fired yet, and the cycle-start reads read as something owed later.
// They are not. This is the only surface open at that moment, which is why the
// clause rides along here rather than becoming a hook of its own.
directive +=
  ` If this session begins by resuming a plan, continuing a cycle already in ` +
  `progress, or being handed a path to one, that IS a cycle start: the reads ` +
  `AGENTS.md marks for cycle start fall due BEFORE your first question to the ` +
  `user — not before your first skill invocation, which on that route comes last.`;

emit({
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: directive,
  },
});
