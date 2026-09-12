# Cursor Cloud

Durable notes for **Cursor Cloud Agent** VMs only — not desktop Cursor, not Claude Code.

SessionStart injects a pointer at the filled `CLOUD.md` when `CURSOR_AGENT` is set. Do not copy this body into `AGENTS.md` (that file is paid for by every harness on every turn).

## Skeleton

Copy this file to `CLOUD.md` (or keep both: skeleton = template, `CLOUD.md` = this repo’s fill). Fill each section that applies; delete headings you do not need. Keep facts that are non-obvious in this VM — not a repeat of `README` / Nx target lists.

### Runtime & install

- What the Cloud `install` already ran (and what you must not re-do).
- Point at the repo’s getting-started / package-manager docs for Node and pnpm versions — do not duplicate version pins here.
- Recovery install command (e.g. frozen lockfile) when deps are missing or broken.
- Pin installer path, if this repo uses one.

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
- Diff-review / human-report prepend rules when this harness creates or updates PRs.
