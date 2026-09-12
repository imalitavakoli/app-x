# Cursor Cloud

Durable notes for **Cursor Cloud Agent** VMs only — not desktop Cursor, not Claude Code.

SessionStart injects a pointer at this file when `CURSOR_AGENT` is set. Do not copy this body into `AGENTS.md` (that file is paid for by every harness on every turn).

Template headings for reuse: [`CLOUD.skeleton.md`](./CLOUD.skeleton.md).

## This repository

### Runtime & install

- Node / pnpm / Nx versions and laptop setup: `docs/getting-started/setting-up-the-repository.md` — do not restate version numbers here.
- **Boot already ran** (via `.cursor/environment.json`): `node .cursor/cloud/install-pinned-plugins.mjs`, which installs SHA-pinned plugins from `.agents/_pins/plugins/catalog.json` into `~/.cursor/skills/` for harness `cursor-cloud`. Do not re-run that installer unless pins look missing.
- **Deps install / recovery:** `pnpm install --frozen-lockfile` (same as getting-started). Use when `node_modules` is missing or broken — not as a substitute for the pin installer.
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

#### Diff review → PR description

The Superpowers workflow may load `x-code-diff-reviewer` when `pref.diff-review` is on (which steps, and when: `AGENTS.md` + the active path file — do not hardcode step ids here). That skill’s **main product** is the human report in the session and at:

`.agents/_local/skills/x-code-diff-reviewer/latest.md`

**Whenever you `create_pr` or `update_pr`:** if that `latest.md` exists, prepend its full contents at the top of the PR description (before your walkthrough / summary), wrapped in:

`<!-- x-code-diff-reviewer:start -->` … `<!-- x-code-diff-reviewer:end -->`

If a block with those markers already exists, replace that block only. If the report does not exist yet (Cloud often opens a PR before the review has finished), create/update without it; **when `latest.md` appears later in this run, `update_pr` and prepend then**. Missing prepend because the PR appeared only after this agent exited is expected for that turn — not a failed review; a later run that has the PR can add it.

Prefer the Cloud PR write tool for this harness. The skill’s `publish-pr-description.mjs` remains valid on hosts/CI that use it; a skipped publish is not a failed review when the report is already on disk.
