---
name: x-skill-build-helper
description: "WHAT? The workspace conventions for building or updating a skill under `.agents/skills/` — where it lives, how it is named and versioned, the pointer stub each AI tool needs, and a starting template per skill kind. WHEN? Before creating, renaming, or editing any workspace skill or its description; when deciding a skill's name, kind, folder layout, frontmatter, or where its templates and examples live."
metadata:
  version: '1.0.0'
---

# Skill Build Helper

## Overview

This skill is a **helper**: it puts the workspace's skill-authoring conventions into your context. It **produces nothing** — whoever is doing the work writes the skill, following these conventions.

It covers only the **workspace-specific** rules, and deliberately does not restate what it sits on top of:

- the **method** of authoring a skill — test-first, the baseline-before-writing discipline, discovery and description theory — belongs to the general skill-authoring process;
- the **file format** — every frontmatter field, the directory layout, packaging and validation — belongs to the [Agent Skills specification](https://agentskills.io/specification).

Both remain in force. For anything this skill doesn't mention, go to them rather than assuming it is unspecified.

## When to use

Creating a new workspace skill, renaming one, changing its `description`, or editing its body or assets. Not for editing skills that belong to an installed plugin — those update independently and are never modified here.

## Before creating one — check the neighbours

A new skill is not always the answer. Before minting one:

1. **Does a skill already do this?** If an existing skill owns the same job, the same output, or the same artifact, **extend it** — add the rule or section there and bump its version — rather than creating a sibling. Two skills that overlap cannot coordinate: a skill may not name another to divide work with it, and control flow lives outside skills entirely.
2. **Would its triggers collide?** Read the `description` of every skill in the same area. If yours would fire on the same words as a sibling, either bind yours narrowly enough to separate them, or extend the sibling instead. The same check applies when _widening_ an existing description — a new trigger phrase can start capturing a neighbour's requests.
3. **Is the content workspace-wide rather than skill-owned?** Then it belongs in `docs/` — cited by a skill, not wrapped in a new one. That is a separate change, not part of building the skill.

If an existing skill nearly fits but not quite, say so and ask — do not create a near-duplicate silently.

## Where skills live

The canonical skill is `.agents/skills/{name}/SKILL.md`. That is the **single source of truth** and the directory most agents read directly.

```
.agents/skills/{name}/
├── SKILL.md
└── assets/            (only if the skill needs it — see "A skill's own content")
```

## Register a pointer stub per AI tool that needs one

Some tools discover skills only inside their own directory. Each of those gets a **pointer stub** — never a copy, so the skill stays single-sourced.

| Tool                                                                   | Needs a stub?                                 |
| ---------------------------------------------------------------------- | --------------------------------------------- |
| Claude Code                                                            | **Yes** — at `.claude/skills/{name}/SKILL.md` |
| Tools that read `.agents/skills/` directly (Gemini, GitHub Copilot, …) | **No** — they load the canonical file         |

Add a row when a new tool needs its own location. A stub is frontmatter (`name` + the **identical** `description`, no `metadata`) plus one imperative line:

```markdown
---
name: { name }
description: '<copied verbatim from the canonical SKILL.md>'
---

# {name} (pointer)

This skill's full instructions live at `.agents/skills/{name}/SKILL.md`.

**Read that file now, before taking any action.** This page is only a registry entry so the skill is discoverable — it contains none of the skill's content.
```

**Update every stub in the same commit** as the canonical file whenever you add or rename a skill or change its `description` — that field is the one thing duplicated, so it is the one thing that can drift. A stale stub means the tool keeps matching on the old trigger text while the canonical file says something else.

## Name the skill

- **`x-`** — marks a workspace skill (distinct from plugin and `nx-*` skills).
- **tech segment** — add one (e.g. `ng` for Angular) only when the skill is tied to that technology; omit it for tech-agnostic skills.
- **tool segment** — the **short name of the tool whose artifact the skill edits** (`sp` = Superpowers). Add it when the skill reads or edits that tool's artifact, or exists only inside that tool's lifecycle. General form `x-{tech}-{tool}-…`, or `x-{tool}-…` when tech-agnostic. A skill editing a different tool's artifact takes that tool's short name in the same slot.
- **domain segment** — what the skill is about (`test-unit`, `lib-build`, `skill-build`).
- **kind suffix** — the last segment names the kind, so the name says what it does:

**The kind and the suffix are the same word** — so a skill's last segment names its kind, and the kind names its template. There are four; if none fits, ask rather than coining a fifth.

| Kind     | Suffix      | Example                 |
| -------- | ----------- | ----------------------- |
| writer   | `-writer`   | `x-ng-prd-writer`       |
| helper   | `-helper`   | `x-ng-test-unit-helper` |
| injector | `-injector` | `x-ng-log-injector`     |
| enricher | `-enricher` | `x-ng-sp-plan-enricher` |

## Write the description

Format: `WHAT? <what it produces or supplies>. WHEN? <the situations it applies to, plus the keywords someone would use to ask for it>`. Third person. Keep the whole field **under ~500 characters**, with WHAT as a **single clause naming the output**.

A WHAT that grows into an inventory of the skill's sections and mechanics is the one description mistake to avoid: agents then follow the description as a summary instead of reading the skill.

## Version it

Add `version` under `metadata`, in **block** form with single quotes:

```yaml
metadata:
  version: '1.0.0'
```

Bump it when you change the skill:

- **major** — the skill's identity changes: renamed, changed to a different kind, split, merged, or a rule removed that callers relied on.
- **minor** — anything that changes _when the skill fires_ or _what it instructs_: a description that widens or narrows triggers, a changed or added rule, a new section or template.
- **patch** — wording only: typos, formatting, clarification that leaves behaviour identical.

One bump covers everything since the last committed version — don't stack a bump per edit while the change is still uncommitted.

## Pick the matching kind template

Start from the template for the kind, then **drop what the skill doesn't need** — these are starting points, not mandates. A tiny helper should not carry a Validate or Summary section it would leave empty.

| Kind                                            | Template                                                     |
| ----------------------------------------------- | ------------------------------------------------------------ |
| **writer** — produces a document                | [assets/templates/writer.md](assets/templates/writer.md)     |
| **helper** — supplies context, produces nothing | [assets/templates/helper.md](assets/templates/helper.md)     |
| **injector** — edits existing code              | [assets/templates/injector.md](assets/templates/injector.md) |
| **enricher** — edits another tool's artifact    | [assets/templates/enricher.md](assets/templates/enricher.md) |

The H1 is the skill name minus its `x-` and tech segments, title-cased; keep the tool segment and upper-case it — `x-ng-test-unit-helper` → `# Test Unit Helper`, `x-ng-sp-plan-enricher` → `# SP Plan Enricher`.

If the skill's checklist is meant to be copied into todos, **prefix each todo with a short tag** (e.g. `[prd]`). Inside a larger workflow this keeps its steps grouped and the outer todos visible instead of buried.

## Keep each skill self-contained

A skill holds everything it needs and **does not name another skill**. When it depends on another skill's **output**, it names the produced _artifact_ (the file), not the producer — and if that file is missing it stops and asks (a prerequisite guard).

**The one exception — reading another skill's internals.** Name another skill only when you must read something _inside_ it (its template, examples, assets), not merely consume its output. Even then, prefer to **inline** the piece you need; name the skill only if that content must stay single-sourced there. Expected mainly in enrichers (`x-{tech}-{tool}-*`).

## Don't hardcode paths to volatile code

Refer _conceptually_ (e.g. "the base `ui` lib's root CSS variables") rather than naming a concrete file under `libs/` or `apps/`, or embedding a literal value — so the skill survives the workspace evolving. Name an exact code path or value **only when the user explicitly asks**.

**Structural patterns are fine; specific files are not.** A placeholder path that describes the _shape_ every project follows — `src/lib/{version}/`, `apps/{app}-e2e/user-stories.md`, a root config file like `jest.preset.js` — names a convention, not a file, and stays true as libs come and go. `libs/shared/ui/base/src/lib/v3/root.scss` names one file that can be renamed tomorrow.

**Exception — `docs/`:** these are the stable reference surface and exist to be cited, so refer to them by exact path freely.

## A skill's own content

`SKILL.md` is the only required file. Everything else is optional and goes in one of the three directories the spec defines — they differ by **how the agent uses the file**, so put each thing where its use fits:

| Directory     | Holds                                                       | The agent…                |
| ------------- | ----------------------------------------------------------- | ------------------------- |
| `scripts/`    | executable code — a deterministic transform, a generator    | **runs** it               |
| `references/` | extra documentation too long to keep inline                 | **reads** it on demand    |
| `assets/`     | static resources — templates, worked examples, data, images | **copies or imitates** it |

All three load only when the task reaches them, so move detail out rather than growing `SKILL.md`.

Our conventions inside `assets/`:

- `assets/template.md`, or `assets/template/` when there is one template per output file — the shape a **writer** must produce.
- `assets/examples/` — worked examples to imitate. An example-backed skill also needs a _pick the matching example_ section and a **fallback** for cases the examples don't cover (e.g. ask the user which existing code to imitate).
- `assets/templates/` — starting scaffolds the reader chooses between.

Prefer `scripts/` over prose for any edit that is genuinely mechanical — an **injector** especially. Prose instructions for a deterministic edit drift between runs; a script does not.

**Keep a skill's content in the skill, and leave everything else where it is.** Cite `docs/` freely by exact path, but don't write into it — it is a curated reference surface, and adding to it is a separate, deliberate change, never a side-effect of building a skill.

**If an isolated execution agent must read something, give it a resolvable path.** Those agents read files but never invoke skills, so they cannot turn a phrase like "the canonical examples" into a location. The fix is the **path, not a new home**: leave the content where it lives and make sure whatever reaches the agent carries the literal repo-relative path to it. Never relocate content to make it reachable.

Keep linking a skill's own files the normal way — relative to the skill root (`assets/examples/ui.md`) — which is what reads well and what the spec expects. That path is correct _inside_ the skill and meaningless _outside_ it, because an execution agent resolves against the repo root. So when a skill holds files that must reach one, **state the skill's repo-relative path once**, near where those files are listed:

> These examples live under `.agents/skills/{name}/assets/examples/`. When handing one to an agent that cannot read this skill, give it that full path.

One line, and whoever carries the path onward copies something that resolves instead of reconstructing it.

## Workflow wiring is not the skill's business

Write every skill so it stands on its own and triggers from its own `description`. **Do not add it to a workflow hook table** — not as part of creating it, and not afterwards. If it should be wired into one, the user will say so; treat that as a separate, explicitly requested change.

## Common mistakes

| Mistake                                                  | Fix                                                                                                        |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Canonical skill updated, stub left behind                | Same commit, every stub — the `description` is the one duplicated field.                                   |
| Copying the skill's content into the stub                | The stub is a pointer: frontmatter + one line. Content stays single-sourced.                               |
| Adding `metadata`/`version` to a stub                    | Stubs carry `name` + `description` only.                                                                   |
| Inline `metadata: { version: '1.0.0' }`                  | Use block form under `metadata:`.                                                                          |
| Tech segment on a tech-agnostic skill                    | Omit it — `ng` only when the skill is genuinely Angular-tied.                                              |
| Inventing a kind suffix                                  | Use the suffix for the kind; if no kind fits, ask rather than coining one.                                 |
| Description that summarises the skill's workflow         | WHAT names the output in one clause; the mechanics stay in the body.                                       |
| Changing a description without bumping the version       | Trigger changes are minor bumps.                                                                           |
| Naming another skill                                     | Name the artifact it produces. Reading another skill's internals is the only exception.                    |
| Hardcoding a `libs/` or `apps/` path                     | Describe it conceptually; only `docs/` paths are cited exactly.                                            |
| Putting the skill's own templates or examples in `docs/` | They live under the skill's `assets/`. `docs/` is for content the whole workspace needs.                   |
| Adding the new skill to a workflow hook table            | Don't — skills stand alone unless the user explicitly asks for wiring.                                     |
| Creating a skill that duplicates one that already exists | Extend the existing skill and bump it; overlapping skills cannot coordinate.                               |
| Widening a description without reading the neighbours'   | A new trigger phrase can capture a sibling's requests. Check, then bind it narrowly or extend the sibling. |
| Pointing an execution agent at "the canonical examples"  | It reads files, not skills — give it the literal repo-relative path.                                       |
| Relocating content so an agent can reach it              | Leave it where it is and give the path.                                                                    |
| Skill-relative path handed to an execution agent         | It resolves against the repo root. State the skill's repo-relative path once, beside the file list.        |
