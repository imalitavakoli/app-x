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

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = join(scriptDir, '..', '..');

const agentsPath = join(root, 'AGENTS.md');
if (!existsSync(agentsPath)) process.exit(0); // nothing to enforce

const lineCount = (p) => readFileSync(p, 'utf8').split('\n').length;

let directive =
  `MANDATORY — before acting on ANY request, read AGENTS.md IN FULL using the Read tool ` +
  `(NOT cat/Bash: cat truncates large output mid-file). It is ${lineCount(agentsPath)} lines at ` +
  `${agentsPath}. Verify you reached the last line before proceeding.`;

const localPath = join(root, 'AGENTS.local.md');
if (existsSync(localPath)) {
  directive +=
    ` Then read AGENTS.local.md IN FULL (${lineCount(localPath)} lines at ${localPath}) — ` +
    `it overrides AGENTS.md.`;
}

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: directive,
    },
  }),
);
