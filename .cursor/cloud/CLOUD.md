# Cursor Cloud

Durable notes for **Cursor Cloud Agent** VMs only — not desktop Cursor, not Claude Code.

SessionStart injects a pointer at this file when `CURSOR_AGENT` is set. Do not copy this body into `AGENTS.md` (that file is paid for by every harness on every turn).

## Skeleton (reuse in other repos)

Fill each section that applies; delete headings you do not need. Keep facts that are non-obvious in this VM — not a repeat of `README` / Nx target lists.

### Runtime & install

- What the Cloud `install` already ran (and what you must not re-do).
- Package manager / Node expectations if they differ from laptop docs.
- Pin installer: `node .cursor/cloud/install-pinned-plugins.mjs` (from `.cursor/environment.json`).

### Apps / serve / test

- Which app is the default focus, how to serve it, ports, “one server per port”.
- Build/test commands that must pass before claiming done.
- Viewport / device caveats (e.g. mobile emulation + reload).

### Auth & external services

- Demo accounts, magic-link shortcuts, localStorage seeds.
- What is remote vs local; what fails without egress.

### Host limits

- What this VM cannot run (Xcode, Android emulators, Electron, …).
- Acceptable substitutes (browser serve, unit tests).

### Known baseline failures

- Failures on `main` that are product debt, not environment bugs — so agents do not “fix” the VM.

### PR evidence / artifacts

- How to attach screenshots/videos for this team’s PR convention.

---

## This repository

### Runtime & install

- Dependencies: use the workspace package manager as in `docs/getting-started/setting-up-the-repository.md` / root `package.json` (typically `pnpm install`).
- On Cloud boot, `.cursor/environment.json` runs `node .cursor/cloud/install-pinned-plugins.mjs` so SHA-pinned plugins from `.agents/_pins/plugins/catalog.json` land under `~/.cursor/skills/` (same Superpowers commit Claude Code pins via `.claude/plugins`).
- `CURSOR_AGENT=1` marks this harness; desktop Cursor does not use this install path.

### Apps / serve / test

- Prefer Nx targets via the workspace package manager (`pnpm nx …`). Exact apps and ports are project-specific — see app `project.json` files and getting-started docs when you need them.
- After TypeScript / template / wiring changes, run the relevant build or test target before claiming done.

### Auth & external services

- (None recorded yet for this monorepo’s Cloud profile — add demo credentials or proxy notes here when they matter.)

### Host limits

- No assumption of macOS-only native toolchains in this Linux Cloud VM. Prefer browser / unit / e2e paths that run headless here.

### Known baseline failures

- (Add known `main` reds that are not env issues.)

### PR evidence / artifacts

- When the team wants inline Cloud artifacts in a PR body, use the absolute paths under the environment’s artifacts directory as your process requires — do not invent hosted URLs for private VM files.
