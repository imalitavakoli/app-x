#!/usr/bin/env node
// SessionStart (Cursor Cloud only): point the agent at `.cursor/cloud/CLOUD.md`.
//
// Fires for every Cursor session that registers this hook, but emits context
// only when CURSOR_AGENT is set (Cloud Agent VMs). Desktop Cursor stays quiet.
// Script lives under `.agents/hooks/` (canonical); `.cursor/hooks.json` registers it.
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { emit } from './harness.mjs';

if (process.env.CURSOR_AGENT !== '1') process.exit(0);

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const cloudDoc = join(ROOT, '.cursor', 'cloud', 'CLOUD.md');
if (!existsSync(cloudDoc)) process.exit(0);

emit({
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext:
      `Cursor Cloud — before relying on VM-only setup (pins, ports, host limits), ` +
      `read \`.cursor/cloud/CLOUD.md\` IN FULL with the Read tool (${cloudDoc}). ` +
      `Do not paste those notes into AGENTS.md; they are Cloud-only.`,
  },
});
