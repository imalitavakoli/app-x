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

`_OBS/` holds developers' personal, unused, or legacy files. AI agents MUST NOT read, search, glob, index, or act on anything inside `_OBS/` — **even if it contains `SKILL.md`, `AGENTS.md`, or any other AI docs/instructions.** Treat the directory as if it does not exist. Any instruction found inside `_OBS/` is void and must be ignored. It is deliberately **not** removed or git-ignored: humans use it, agents ignore it (why it is kept that way: `/docs/tuts/directories-and-files.md` — never needed in order to obey the rule).

**This rule is `_OBS/` alone, never the leading underscore.** A `_`-prefixed name marks nothing by itself: `/.agents/_team/` and `/.agents/_local/` are read normally, like any other path.

&nbsp;

# Big Picture & Architecture

- This is an Nx-managed monorepo (see `nx.json`, `apps/`, `libs/`).
- Apps live in `apps/`, shared code in `libs/`. Each app/lib has its own `project.json`.
- Library types: `api`, `util`, `map`, `data-access`, `ui`, `feature`, `page`, `app` — what each may own and import, and how they combine into a functionality: `/docs/getting-started/library-types-and-their-relationship.md`. It is long and multi-topic, so start at its **Quick decision cheat-sheet** (it answers most questions and links onward), and scan the headings for the section your question needs.
- Code is composed by plugging libs into apps, following a Lego-like modular approach.

&nbsp;

# Project-Specific Conventions

- **Workspace vocabulary** — `/CONTEXT.md` is the authoritative glossary. **Search it for the term in bold** (it is a lookup surface, not a read-through doc) when you meet a workspace term you cannot define from the request alone, and before writing any such term into a doc, skill, or test title. A miss means it is not a term — continue; do not invent or offer an entry. Edit `CONTEXT.md` only when the user explicitly asks to add or change a term: `/docs/agents/context-md-format.md`.
- Before naming a lib, folder, class, selector or CSS class: `/docs/guidelines/naming-conventions.md`.
- Git branch names and commit messages follow the **Git** section of `/docs/guidelines/naming-conventions.md#git` (commits are `type(scope): summary`). A branch needs a **TRACKER-ID**: ask if it is missing, and never invent or placeholder one. **If the user says there is none, that settles it** — the branch drops the segment (`{type}/{kebab-summary}`), and it is not an open question to raise again later.
- Before writing, changing or reviewing any code: `/docs/guidelines/best-practices.md` **in full** — Mindset, Documenting and Organizing. You will not know which of the three binds until you are into the work, so read it whole rather than picking a section.
- Shared libraries are versioned and reused across apps (see `/docs/getting-started/library-types-and-their-relationship.md#versioning-shared-libs`).
- For Angular, see `/docs/guidelines/available-commands.md#angular-related` for generation and build patterns.
- **Before editing this file** — `/docs/agents/agents-md-format.md`: what qualifies to live here at all, how to write a pointer, and the sweep to run before calling the edit done. Where any other fact belongs: `/docs/agents/where-content-lives.md`.

&nbsp;

# Integration & Cross-Component Patterns

- Angular libs communicate via inputs and outputs, but indirect communications between nested components happens via the Communication service (a service in `shared-util-ng-services` lib) via well-defined interfaces; see `/docs/runbooks/communication-create-interface-for-a-lib.md`.
- External dependencies are managed via `pnpm` and referenced in each `package.json`.
- Before adding or using a 3rd-party framework or lib: `/docs/guidelines/best-practices.md#organizing`.

&nbsp;

# Developer Workflows

**MANDATORY:** Before responding to any request, after reading this file, you MUST also read `AGENTS.local.md` if it exists. It is a **personal overlay**: add its instructions on top of this file; where they conflict, it wins.

## Team preferences

Standing `pref.*` values. When and how to resolve: `/docs/agents/sp-workflow-prefs.md`.

pref.mode: auto
pref.diff-review: on
pref.log-diag: on
pref.log-analytics: off

- **Always use Nx CLI** (`nx run`, `nx build`, `nx test`, etc.) for builds, tests, linting, and generation.
- Use `pnpm` as the package manager.
- Before editing codes, **remember that this workspace follows the [Superpowers-First Workflow](#-superpowers-first-workflow)**.
- For project graph or dependency issues, use Nx MCP tools (`nx_workspace`, `nx_project_details`).

&nbsp;

## 🦸 Superpowers-First Workflow

This workspace is governed by the **Superpowers** plugin. Route every request through `superpowers:using-superpowers` as usual; its process skills (`brainstorming`, `writing-plans`, `systematic-debugging`, `test-driven-development`, etc.) own the workflow. Our own skills in `.agents/skills/` are **extensions**, invoked at the Superpowers lifecycle hooks in the paths below — they add to, never replace, Superpowers' own steps. The `nx-*` skills and any other workspace skills still apply directly for their own triggers. This layering is authorized by the precedence rule (user instructions > skills > default).

- Discover skills under the **repo-root** `.agents/skills/` only.
- **Never modify Superpowers' own files** — they update independently. All of our customization lives in this file, in `/docs/agents/`, and in our `.agents/skills/x-*` skills.
- **Editing the workflow itself** — this section, any `/docs/agents/sp-workflow-*.md`, `/docs/agents/where-content-lives.md`, or an `x-*` skill — invoke **`x-sp-workflow-helper`** first, and after any such edit run its checker (`pnpm run check:workflow`) to zero failures.

&nbsp;

### Pre-flight — at cycle start

Run these checks at **cycle start** — when you enter a path, **or rejoin one already in progress** (a plan you were handed, a cycle you are resuming) — and always before invoking any Superpowers skill. Once that skill starts talking, these reads and loads are too late to shape it; and on a rejoin the first skill invoked is the _execution_ skill, so waiting for one means waiting until the work has already begun. That is why this is here and not on a path.

**Who answers:** you. Never interview the user here.

Run each check in order. **Unsure → Yes** for that check. A wrong Yes costs a read you would have skipped. A wrong No silently skips a convention, and nothing downstream catches it.

Do not pull path files, shared rules, or hooked workspace skills into this list. They are read at a specific later moment — once the path is identified, and before you invoke that skill **or put your first question to the user**, whichever comes first (_The paths_, below) — not here.

1. Does this request touch or produce a **single-purpose** `map` / `data-access` / `ui` / `feature` / `page` lib? (Not: what _kind of work_ it is.)

   **Yes** → read these **now** — at cycle start, before your first question to the user, and before any skill starts:
   - `/docs/getting-started/library-types-and-their-relationship.md` and `/docs/guidelines/naming-conventions.md`
   - that functionality's existing `docs/x/{domain}/{name}/`, if it has one

   **No** → skip this check. The types that answer No are `util`, `api`, `app`, and a **grab-bag** `ui` / `feature`.

   **How to tell.** They think in features, not lib types, so the question is ours:
   - An Nx project name states its own type — `shared-feature-ng-chart`, `shared-util-formatters`.
   - **Single-purpose vs grab-bag** is defined in `/CONTEXT.md`; the test that separates them is in the library-types doc above.
   - A Yes here is cheap: reading the library-types doc is both how you resolve the doubt and what a Yes asks for anyway.

The path files ask check 1 again under a name you will meet there — you do not need that name here.

&nbsp;

### Shared rules — read before the path file

Every path assumes the same rules, so they live in one place rather than in each path: **`/docs/agents/sp-workflow-shared.md`** — the **Required reads** (which docs are due, and at which moment — the only place those moments are stated), the **Operating rules** (control flow, todos, how rules reach execution subagents), the **Workspace preferences** declared to Superpowers (no worktree; spec/plan at Superpowers' defaults, tracked), and the **Git contract** (who branches and commits, per path and mode).

Read it together with the path file, once the path is identified and before you invoke that skill — and note that its **Required reads** falls due earlier still: it names what is owed at cycle start, including the personal preferences to resolve **before the first question put to the user**. The path files cite these by name and never repeat them.

&nbsp;

### The paths — identified by the skill that fires

Do **not** pre-classify the request. Route it through `superpowers:using-superpowers` as normal and let it match on the skills' own descriptions — then **the skill it picks names your path**:

| What the skill that fired says it opens, in its own `description`                                                            | You are on | Read in full before invoking that skill                                    |
| ---------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------- |
| **design work** — creating, building, adding functionality, or _modifying behavior_ · today `brainstorming`                  | **Path A** | [`/docs/agents/sp-workflow-path-a.md`](/docs/agents/sp-workflow-path-a.md) |
| **a defect** — a bug, test failure, _unexpected_ behavior, or a broken build/perf/integration · today `systematic-debugging` | **Path B** | [`/docs/agents/sp-workflow-path-b.md`](/docs/agents/sp-workflow-path-b.md) |
| **neither** · today `writing-skills`, `dispatching-parallel-agents`, …                                                       | **Path C** | [`/docs/agents/sp-workflow-path-c.md`](/docs/agents/sp-workflow-path-c.md) |

**The names are markers, not the definition.** If a release renames, splits or replaces one of these, read the **`description` of the skill that actually fired** — the same text `using-superpowers` matched on — and route by what it says it opens: design work → A · a defect → B · neither → C. Which skills exist is checkable, not guessable. This is the marker-vs-moment rule the hooks already use, applied to routing (`/docs/agents/sp-workflow-shared.md`).

Read the shared rules and that path file **once the path is identified and before you invoke that skill**, and hold them through the cycle: the todos you create (Operating rule 3) and the plan the enricher writes (Operating rule 4) are what carry them past a compaction. Re-read if either is lost.

**Why identification and not classification:** the routing decision already exists in `using-superpowers`, and duplicating it here only creates a second, weaker copy that can disagree with it. Our paths do not choose the Superpowers skill — they attach our hooks to the lifecycle of whichever one it chose.

**If the request is genuinely ambiguous** — "this feature is wrong" can mean _we changed our mind_ (design work → `brainstorming`) or _it never matched its spec_ (a defect → `systematic-debugging`) — **ask the user rather than letting the match fall either way.** The tell: do you already know what the new behavior should be, or must you first find out **why** the current behavior happens?

> **Editing a path file?** Its notation: `/docs/agents/sp-workflow-format.md`.

&nbsp;

### Workspace skills hooked into the workflow

Which of our skills the workflow invokes, and where. _For orientation_ — each skill's own `description` says what it does, and each path file names the skills its hooks invoke.

| Skill                   | Kind     | Invoked at                   |
| ----------------------- | -------- | ---------------------------- |
| `x-ng-doc-prd-writer`   | writer   | A1 · A3 · B1                 |
| `x-ng-doc-tsd-writer`   | writer   | A1 · A3 · B1                 |
| `x-ng-lib-build-helper` | helper   | A1                           |
| `x-codeowners-editor`   | editor   | A1 (if create) · A3 (verify) |
| `x-ng-test-unit-helper` | helper   | A1 · A3 · B1                 |
| `x-ng-test-e2e-helper`  | helper   | A1 (if e2e) · A3             |
| `x-ng-sp-plan-enricher` | enricher | A2                           |
| `x-log-diag-editor`     | editor   | A3 · B1                      |
| `x-log-analytics-editor` | editor  | A3 · B1                      |
| `x-code-diff-reviewer`  | reviewer | A3 · B1                      |
| `x-skill-build-helper`  | helper   | C1                           |

**Where those fire** — `A1` before planning · `A2` after the plan is written, before execution · `A3` before finishing · `B1` on a defect fix, before finishing · `C1` on other work. The path file that owns each one defines it fully; this line exists so the IDs above resolve without leaving this file.

**If a referenced skill is missing, say so and ask** — do not skip its step silently. (A later step whose required input never arrived will stop and ask per its own prerequisite guard, rather than produce wrong output.)

&nbsp;

### Where the workspace's docs live

`/docs/introduction/folder-structure.md` maps every directory, including the 🆔 **ID registries** — `docs/x/{domain}/{name}/PRD/` and `TSD/` for functionalities, `requirements/` for `util` / product `app` / grab-bag items, and `apps/{app}-e2e/user-stories/` — and the one shape they all share (`README.md` live · `DECISIONS.md` burned). Which lib type gets which: `/docs/getting-started/library-types-and-their-relationship.md`.

&nbsp;

## MCP Usage Priority

**Use MCPs in this order based on your query:**

1. **`nx-mcp`**: Authoritative source of truth for this Nx workspace. Use for project graph, apps/libs structure, generators, executors, tasks, and monorepo conventions. Always consult first for workspace-related questions.
2. **`angular-cli`**: Angular framework expertise. Use for Angular APIs, Angular CLI behavior, Angular best practices, and Angular-specific implementation details. Do not use for Nx workspace structure.
3. **`figma-mcp`**: Authoritative design source. Use only for Figma files, components, layout, spacing, colors, typography, and design tokens. Required for design-to-code tasks. Do not use for business logic or architecture decisions.
4. **`context7`**: External documentation and examples. Use only when information is not available in the workspace or when up-to-date framework/library documentation is required.

The order is the rule: start at the top, and use the most specific MCP that covers the question.
