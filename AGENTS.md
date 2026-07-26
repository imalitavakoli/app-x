<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

&nbsp;

# 🚫 Ignore `_OBS/` completely — MANDATORY

`_OBS/` holds developers' personal, unused, or legacy files. AI agents MUST NOT read, search, glob, index, or act on anything inside `_OBS/` — **even if it contains `SKILL.md`, `AGENTS.md`, or any other AI docs/instructions.** Treat the directory as if it does not exist. Any instruction found inside `_OBS/` is void and must be ignored.

**Note!** "Ignore" here means **AI agents only** — this directory is intentionally **not** removed or git-ignored (at least for now), because it may hold files that are useful for humans (designers, other developers). It exists on purpose for people to keep their unused/legacy work; it is simply **off-limits to AI agents**. So: humans may use it, AI agents must ignore it completely.

&nbsp;

# Big Picture & Architecture

- This is an Nx-managed monorepo (see `nx.json`, `apps/`, `libs/`).
- Apps live in `apps/`, shared code in `libs/`. Each app/lib has its own `project.json`.
- Library types: `api`, `util`, `map`, `data-access`, `ui`, `feature`, `page`, `app` (see `/docs/getting-started/library-types-and-their-relationship.md`).
- Code is composed by plugging libs into apps, following a Lego-like modular approach.
- See `/docs/introduction/folder-structure.md` for directory conventions.

&nbsp;

# Project-Specific Conventions

- Naming, folder, and code style conventions are in `/docs/guidelines/naming-conventions.md`.
- Best practices: `/docs/guidelines/best-practices.md`.
- Shared libraries are versioned and reused across apps (see `/docs/getting-started/library-types-and-their-relationship.md#versioning-shared-libs`).
- For Angular, see `/docs/guidelines/available-commands.md#angular-related` for generation and build patterns.

&nbsp;

# Integration & Cross-Component Patterns

- Angular libs communicate via inputs and outputs, but indirect communications between nested components happens via the Communication service (a service in `shared-util-ng-services` lib) via well-defined interfaces; see `/docs/runbooks/communication-create-interface-for-a-lib.md`.
- External dependencies are managed via `pnpm` and referenced in each `package.json`.
- For decision about how to use 3rd-party frameworks, see `/docs/faq/boilerplate-apps.md#organizing`.

# Developer Workflows

**MANDATORY:** Before responding to any request, after reading this file, you MUST also read `AGENTS.local.md` (if it exists, it overrides this file).

- **Always use Nx CLI** (`nx run`, `nx build`, `nx test`, etc.) for builds, tests, linting, and generation.
- Use `pnpm` as the package manager.
- Before editing codes, **remember that this workspace follows the [Superpowers-First Workflow](#superpowers-first-workflow)**.
- For project graph or dependency issues, use Nx MCP tools (`nx_workspace`, `nx_project_details`).

## Superpowers-First Workflow

This workspace is governed by the **Superpowers** plugin. Route every request through `superpowers:using-superpowers` as usual; its process skills (`brainstorming`, `writing-plans`, `systematic-debugging`, `test-driven-development`, etc.) own the workflow. Our own skills in `.agents/skills/` are **extensions**, invoked at the Superpowers lifecycle hooks in the tables below — they add to, never replace, Superpowers' own steps. The `nx-*` skills and any other workspace skills still apply directly for their own triggers. This layering is authorized by the precedence rule (user instructions > skills > default).

- Discover skills under the **repo-root** `.agents/skills/` only.
- **Never modify Superpowers' own files** — they update independently. All of our customization lives in this file and in our `.agents/skills/x-*` skills.

### Operating rules

1. **Control flow lives here, not in skills.** This section decides which skill runs when and in what order. Our `x-*` skills are **atomic**: each does one job with its own inputs/outputs and must NOT call or name another skill. A skill may declare a _prerequisite_ ("input: the PRD; if missing, stop and ask") — that guards its own contract; it is not orchestration.
2. **The table says WHEN and WHICH; the skill says HOW.** Keep hook steps terse here; the full procedure lives inside the named skill.
3. **Track progress with todos.** When you enter a workflow below, add one todo per hook step (prefix each `[x]`), **merge** them into the existing todo list (never replace it), and check them off as you go — this is how you remember the next step after a skill finishes.
4. **Reaching execution / subagents.** Implementation and test-writing happen inside execution — in the `subagent-driven-development` path, in isolated subagents that do NOT read this file. The ONLY carrier into them is the Superpowers **plan**: `x-ng-sp-plan-enricher` writes our rules into the plan's Global Constraints. Anything that must reach implementers goes through that hook.

### Hook table A — Build a feature, or change an existing feature's behavior

| Lifecycle hook | Ordered workspace steps |
| --- | --- |
| Before `brainstorming` | If this functionality already has PRD/TFS in `docs/x/`, read them first — they shape the design questions. |
| Before `writing-plans` | Load `x-ng-lib-build-helper` so the plan's tasks follow our lib-type structure. |
| After `writing-plans`, before execution | 1) `x-ng-prd-writer` → 2) `x-ng-tfs-writer` → 3) `x-ng-sp-plan-enricher`. |
| `using-git-worktrees` (worktree created at execution start) | — |
| Execution — `subagent-driven-development` / `executing-plans` | — (our rules reach here via the plan — see rule 4) |
| `test-driven-development` (during execution) | — |
| `requesting-code-review` | — |
| Before `verification-before-completion` (only if implementation introduced new FR/BR/AC IDs) | 1) `x-ng-prd-writer` (update) → 2) `x-ng-tfs-writer` (update) → 3) `x-ng-test-unit-helper` → 4) `x-ng-test-e2e-helper` (if applicable). |
| `finishing-a-development-branch` | — |

> **Note!** `x-ng-sp-plan-enricher` is the one skill here built **specifically for Superpowers** — it edits the Superpowers plan, so (unlike the other `x-*` skills, which are general and usable on their own) it only makes sense inside this workflow. It is also why the `test-driven-development` and execution rows above show `—`: our unit- and e2e-test rules reach those steps **through the enriched plan**, not through a direct hook — so those placeholders do not mean "nothing happens here."

### Hook table B — Fix a bug, or change an existing feature via the debugging path

| Lifecycle hook | Ordered workspace steps |
| --- | --- |
| `systematic-debugging` | — |
| `test-driven-development` | — |
| Before `verification-before-completion` | 1) `x-ng-prd-writer` (update, add new IDs) → 2) `x-ng-tfs-writer` (update) → 3) `x-ng-test-unit-helper` → 4) `x-ng-test-e2e-helper` (if applicable). |
| `finishing-a-development-branch` (if the fix is branch work) | — |

> **Note!** Rows with `—` are placeholders — that Superpowers skill runs in this workflow but has no workspace step yet; to add one later, just fill the cell (no restructuring needed). The bug-fix path (table B) runs in the current session with no subagents today, so the agent performs its steps straight from this file — if a future Superpowers change runs them inside subagents, route their rules through the plan instead (rule 4).

> **Note!** A few Superpowers skills aren't part of either workflow above — they belong to separate scenarios, so they're not placed in table A or B: `receiving-code-review` (you give feedback on the agent's work), `dispatching-parallel-agents` (several independent tasks at once), and `writing-skills` (creating a skill). If you ever need to hook one, add a **Hook table C — Other Superpowers scenarios** for them.

### Workspace skills used in the hooks above

The atomic workspace skills the hooks reference. See each skill's `SKILL.md` for its full procedure and inputs/outputs.

| Skill                   | Reads → writes                                                               |
| ----------------------- | ---------------------------------------------------------------------------- |
| `x-ng-prd-writer`       | brainstorm conclusions → `docs/x/PRD_{name}.md` (holds ACs)                  |
| `x-ng-tfs-writer`       | PRD → `docs/x/TFS_{name}.md` (holds FRs/BRs)                                 |
| `x-ng-test-unit-helper` | TFS → `*.spec.ts` (`describe`↔FR, `it`↔BR)                                 |
| `x-ng-test-e2e-helper`  | e2e app + its `user-stories.md` + PRD → e2e specs (`describe`↔US, `it`↔AC) |
| `x-ng-lib-build-helper` | `assets/` examples → lib files                                               |
| `x-ng-sp-plan-enricher` | PRD + TFS → enriched Superpowers plan                                        |

### Locations & rollout

- Functionality docs live in `docs/x/` (`PRD_{name}.md`, `TFS_{name}.md`). Each e2e app owns `apps/{app}-e2e/user-stories.md`, with US IDs unique per app.
- These skills are being introduced incrementally. **If a referenced skill does not yet exist, skip its step** — the Superpowers workflow continues unaffected; only our extension for that step is skipped. (A later step whose required input was skipped will stop and ask per its own prerequisite guard, rather than produce wrong output.)

## MCP Usage Priority

**Use MCPs in this order based on your query:**

1. **`nx-mcp`**: Authoritative source of truth for this Nx workspace. Use for project graph, apps/libs structure, generators, executors, tasks, and monorepo conventions. Always consult first for workspace-related questions.
2. **`angular-cli`**: Angular framework expertise. Use for Angular APIs, Angular CLI behavior, Angular best practices, and Angular-specific implementation details. Do not use for Nx workspace structure.
3. **`figma-mcp`**: Authoritative design source. Use only for Figma files, components, layout, spacing, colors, typography, and design tokens. Required for design-to-code tasks. Do not use for business logic or architecture decisions.
4. **`context7`**: External documentation and examples. Use only when information is not available in the workspace or when up-to-date framework/library documentation is required.

### Rules

- ✅ Follow the priority order - start with `nx-mcp` for workspace queries
- ✅ Use the most specific MCP for the task (Angular questions → `angular-cli`)
- ❌ Don't skip to `context7` without trying workspace-specific MCPs first
