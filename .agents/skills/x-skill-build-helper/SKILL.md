---
name: x-skill-build-helper
description: "WHAT? The workspace conventions for building or updating a skill under `.agents/skills/` — where it lives, how it is named and versioned, the pointer stub each AI tool needs, and a starting template per skill kind. WHEN? Before creating, renaming, or editing any workspace skill or its description; when deciding a skill's name, kind, folder layout, frontmatter, or where its templates and examples live."
metadata:
  kind: helper
  version: '2.0.0'
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
3. **Is the content workspace-wide rather than skill-owned?** Then it does not belong in a skill at all — `docs/agents/where-content-lives.md` decides its home (a term goes to `CONTEXT.md`, a subsystem rule to its `docs/` page), and the skill cites it. That is a separate change, not part of building the skill.

If an existing skill nearly fits but not quite, say so and ask — do not create a near-duplicate silently.

## How broad may one skill be?

**Broad in verbs over one subject. Never broad in subjects.**

A skill may legitimately create, change, verify and explain — so long as one **subject** binds all of it: one artifact type, one file, one lib type, one format. That is what makes a wide skill coherent: every verb is about the same thing, so the reader always knows what they are getting.

**Several verbs is the normal case, not a warning sign.** Splitting is the exception, and the section below exists to collapse verbs rather than multiply skills — the count that matters is deliverables, and four verbs routinely share one.

A skill spanning unrelated subjects has nothing binding it, and it fails in four specific ways rather than merely being untidy:

- **It cannot be triggered.** Its `description` has to cover every subject, so it fires where most of it is noise and captures its neighbours' requests.
- **It cannot state prerequisites.** Different subjects need different required inputs and different stop conditions. One guard either blocks work that needed none of it, or guards nothing.
- **It loads in full to do one thing** — the opposite of what the three-tier layout is for.
- **It is control flow wearing a skill's clothes.** "Do this, then if needed that, then check" is an order of operations, and order of operations lives outside skills.

### Count deliverables, not verbs

Four verbs almost never mean four skills, because verbs **collapse**. Two rules do the collapsing:

- **Discard degenerate cases.** If verb B is verb A at a boundary, it is not a second verb. Creating a file you maintain is maintaining it from zero. Updating what you created is creating it again with different input. Neither adds a deliverable.
- **Do not weigh them.** Effort, step count and frequency decide nothing here — see _Decide the kind_ below for why weighing produces confident wrong answers.

Once the verbs have collapsed, the number of **deliverables** is the number of candidate skills. Which kind each one is: _Decide the kind_.

### The only three reasons to split into two skills

A closed set. If none applies, it is one skill with sections:

1. **A second subject with its own lifecycle.** Documentation that evolves independently of the thing it describes is its own skill. A `README` emitted *as part of* what gets created is not — same lifecycle, so it is a file in the output.
2. **A judgement that must stay auditable.** Judging instances the same run may have changed leaves nobody able to separate "this was wrong" from "this was made true". Note the narrowness: a skill checking **its own** output against **its own** rules is a Validate section, not a reviewer.
3. **Two distinct deliverables where neither guard is wrong.** Genuinely rare. Hitting it twice means the taxonomy needs review, not the skill.

`x-codeowners-editor` is the worked case: it resolves an owner through a judgement ladder, ships a script that inserts or updates the line and owns the file's sort order, and stops to ask rather than overwriting when the path already has an owner. Three verbs, one deliverable, one skill — `editor`, because the unit is **one line within a file it does not own**. That the file's existence is assumed rather than handled is itself the tell: a skill owning the whole artifact would have to answer for its absence.

**If the deliverables will not collapse and no reason above justifies the split, you are holding a workflow.** Split it anyway, and let whatever owns control flow put the pieces in order — that is the one case where several skills is the right answer rather than the lazy one.

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

**The kind and the suffix are the same word** — an **agent noun naming the work**, so a skill's last segment says what it does, and that same word names its template. If none fits, do not coin a new one on your own — take it through _When a new kind is allowed_ below.

**Declare it twice, in the name and in `metadata`.** The suffix is what a reader sees; `kind:` under `metadata` is what tooling reads without parsing a name. They must agree, and a checker holds them to it.

> **We keep the suffix deliberately.** Each one is an **agent noun that names the work** — a `-writer` writes, a `-reviewer` reviews, an `-enricher` enriches. That is the same form the wider ecosystem already uses (`mcp-builder`, `skill-creator`, `artifacts-builder`), so this is **not** a case of naming a category where others name work.
>
> The actual difference is that our set is **closed**: a fixed list, each word mapping to exactly one template, where the ecosystem picks a fresh verb per skill. Closed is what buys the two things nothing else does — a name that states its own contract, and a one-word lookup from kind to template — and it is why our names stay one shape instead of three. The cost is expressiveness: a skill takes one of the listed words even where a sharper verb exists.
>
> The general advice to **avoid vague names** (`helper`, `utils`, `tools`) therefore lands on exactly **one** of them. `helper` names the _absence_ of work where the rest name work, and it is also our most-used suffix. We accept that, because the cost falls on a surface that does not drive matching — agents trigger on the `description`, not the name.
>
> **Revisit if** triggering ever starts keying on the name, the kind list grows past what a suffix can carry legibly, or `helper` turns out to be covering jobs distinct enough to deserve their own words.

| Kind       | Suffix        | Example                 |
| ---------- | ------------- | ----------------------- |
| writer     | `-writer`     | `x-ng-doc-prd-writer`   |
| helper     | `-helper`     | `x-ng-test-unit-helper` |
| scaffolder | `-scaffolder` | `x-ng-lib-scaffolder`   |
| editor     | `-editor`     | `x-codeowners-editor`   |
| enricher   | `-enricher`   | `x-ng-sp-plan-enricher` |
| reviewer   | `-reviewer`   | `x-ng-pr-reviewer`      |
| runner     | `-runner`     | `x-ng-e2e-runner`       |

What each kind **is** — the one statement of it — is the unit table under _Decide the kind_. This table is the name shape only, and some examples name a skill that does not exist yet.

**A kind names what the skill supplies, never what it does.** A skill is text: it never writes a file, edits code, or produces a document. An **agent holding tools** does all of that, having read the skill. So the kinds differ by what the skill puts in front of that agent, not by who acts on it.

**No kind says who invokes it.** That is the invoking workflow's decision and it varies freely: any of these may be loaded by the agent already working, invoked directly by a user, or handed to a subagent. A kind that named its invoker would be describing one workflow's current shape, which is the coupling this skill forbids everywhere else.

Invocation becomes a real constraint in exactly one case, and it is about capability rather than convention: **some editing contexts cannot invoke a skill at all** — they read files and nothing more. A skill whose whole purpose is an edit has to arrive in the context where that edit happens, so it says how. Nothing else here does.

### Decide the kind

**Name the unit of the deliverable — what exists afterwards that did not before.** Not what the skill instructs, not what the folder contains, and not which verb is the most work.

| The unit is…                             | Kind         |
| ---------------------------------------- | ------------ |
| the artifact itself, newly existing      | `scaffolder` |
| a part **within** an artifact            | `editor`     |
| a document                               | `writer`     |
| a part within another tool's artifact    | `enricher`   |
| a judgement about input someone supplied | `reviewer`   |
| the result of an action taken            | `runner`     |
| the rules, for the reader to act on      | `helper`     |

Read straight on from the suffix table above: unit → kind → suffix → template.

**The question that separates the first two rows: does the skill own the whole artifact, or a part within it?** Owning the whole thing makes it a `scaffolder`, and later changes are its already-exists branch. Owning a part — one line, one entry, one member of a long-lived shared file — makes it an `editor`, and creating the file when absent is that edit's empty case.

**Never weigh the verbs.** Effort, step count and frequency produce confident wrong answers: a lib scaffolder runs one generate command and then five wiring steps, so by weight it "is" an editor — but what exists afterwards is the lib, and calling it an editor imports the wrong guard. Weight also drifts over time and two readers weigh it differently, so it can never be checked.

**If the unit is genuinely ambiguous, ask which guard would be _wrong_.** A guard that fires on the normal case disqualifies its kind. The `scaffolder` guard is _target already exists → STOP_; for a skill maintaining one line of a shared file, the file existing **is** the normal case, so that guard would halt nearly every legitimate run. That decides in a way "which guard do I want" does not.

Two consequences worth stating outright, because both are reached for as if they changed the kind:

- **A script never changes the kind.** Any kind may ship a `scripts/` transform: an editor may carry the codemod that applies its edit, a helper may carry a mechanical step inside an otherwise judgement-heavy convention, a writer may ship a generator. What the script changes is **who guarantees repeatability** — with one, idempotency is the script's job; without one, the skill has to write down a recognition rule an agent can apply. Say in the Overview which it is, and say what the script does rather than claiming the skill produces nothing: a skill shipping something that writes to the repo has not "produced nothing", and the flat claim reads as false to anyone who opens the folder.
- **A verdict about the skill's own subject is not a `reviewer`.** A skill that validates **its own** output against **its own** rules keeps the kind of that subject and holds the validator in `scripts/` — a helper with a proof. `reviewer` is for judging input the **caller** supplies: a diff, a pull request, a document it does not own.

How many skills the deliverables add up to is a different question: _How broad may one skill be?_

### When a new kind is allowed

The list is neither a target nor a ceiling. A new kind earns its place only if **all three** hold:

1. **It needs a template the existing kinds cannot produce by deletion.** If you can get there by dropping sections from the closest template, you have that kind, not a new one.
2. **Its Prerequisites or Validate shape genuinely differs** — different inputs, a different stop condition, a different thing to check before finishing. A kind that validates identically to an existing one is that one wearing a different word.
3. **A real skill needs it now.** Not a planned one, not a plausible one — one being built.

**Criterion 3 is the load-bearing one.** A kind with no instance has never had to work: nothing has tested whether its template is right, whether its contract is complete, or whether it is even a distinct kind. The two ways it fails are worth naming, because both look reasonable when the row is written:

- **A kind that is really another kind with a different implementation.** If what separates it from an existing kind is whether it ships a script, runs a tool, or has a longer procedure, that is not a kind — it is one kind's variation. The test is whether the **work** differs, not the mechanics.
- **A kind whose contract nobody has had to complete.** An unused row keeps whatever gaps it was written with, and they surface only when someone finally tries to build one.

> **Standing debt — three kinds, no instances.** `reviewer`, `scaffolder` and `runner` clear criteria 1 and 2 but **not 3**: each has a template and a Prerequisites/Validate shape the others cannot produce by deletion, and each was admitted on an intended skill rather than a built one. Written down because unrecorded exceptions become precedent.
>
> **Retire any of them** if no skill carries its suffix by the time the next kind is proposed — that is the checkpoint, and _Retiring a kind_ below is the procedure. `editor` cleared criterion 3 outright.

**Retiring a kind** is three steps, the first a precondition: confirm no skill carries the suffix, then delete its template, then remove it from the kind list, the glossary, and the checker's list. The precondition is enforced rather than trusted — with the kind gone from the checker's list, any skill still carrying that suffix fails as an unknown kind.

## Write the description

Format: `WHAT? <what it supplies>. WHEN? <the situations it applies to, plus the keywords someone would use to ask for it>`. Third person. Keep the whole field **under ~500 characters**, with WHAT as a **single clause naming what it supplies**.

A WHAT that grows into an inventory of the skill's sections and mechanics is the one description mistake to avoid: agents then follow the description as a summary instead of reading the skill.

## Version it

Add `kind` and `version` under `metadata`, in **block** form, the version in single quotes:

```yaml
metadata:
  kind: helper
  version: '1.0.0'
```

`kind` must be the same word as the name's suffix — the spec keeps `metadata` open for exactly this, and a field is what tooling can read without parsing a name. Neither of these goes in a stub.

Bump it when you change the skill:

- **major** — the skill's identity changes: renamed, changed to a different kind, split, merged, or a rule removed that callers relied on.
- **minor** — anything that changes _when the skill fires_ or _what it instructs_: a description that widens or narrows triggers, a changed or added rule, a new section or template.
- **patch** — wording only: typos, formatting, clarification that leaves behaviour identical.

One bump covers everything since the last committed version — don't stack a bump per edit while the change is still uncommitted.

## Pick the matching kind template

Start from the template for the kind, then **drop what the skill doesn't need** — these are starting points, not mandates. A tiny helper should not carry a Validate or Summary section it would leave empty.

| Kind           | Template                                                         |
| -------------- | ---------------------------------------------------------------- |
| **writer**     | [assets/templates/writer.md](assets/templates/writer.md)         |
| **helper**     | [assets/templates/helper.md](assets/templates/helper.md)         |
| **scaffolder** | [assets/templates/scaffolder.md](assets/templates/scaffolder.md) |
| **editor**     | [assets/templates/editor.md](assets/templates/editor.md)         |
| **enricher**   | [assets/templates/enricher.md](assets/templates/enricher.md)     |
| **reviewer**   | [assets/templates/reviewer.md](assets/templates/reviewer.md)     |
| **runner**     | [assets/templates/runner.md](assets/templates/runner.md)         |

The H1 is the skill name minus its `x-` and tech segments, title-cased; keep the tool segment and upper-case it — `x-ng-test-unit-helper` → `# Test Unit Helper`, `x-ng-sp-plan-enricher` → `# SP Plan Enricher`. Two adjustments to that:

- **A segment that is itself a filename, acronym or proper noun keeps its own casing** rather than being title-cased — `x-codeowners-editor` → `# CODEOWNERS Editor`, `x-ng-test-e2e-helper` → `# Test E2E Helper`.
- **Drop a segment the rest of the H1 already implies.** `x-ng-doc-prd-writer` → `# PRD Writer`: a PRD is a document, so `doc` adds nothing a reader did not already have. The segment stays in the **name**, where it groups siblings; it just earns no room in the heading.

If the skill's checklist is meant to be copied into todos, **prefix each todo with a short tag** (e.g. `[prd]`). Inside a larger workflow this keeps its steps grouped and the outer todos visible instead of buried.

## Keep each skill self-contained

A skill holds everything it needs and **does not name another skill**. When it depends on another skill's **output**, it names the produced _artifact_ (the file), not the producer — and if that file is missing it stops and asks (a prerequisite guard).

**The one exception — reading another skill's internals.** Name another skill only when you must read something _inside_ it (its template, examples, assets), not merely consume its output. Even then, prefer to **inline** the piece you need; name the skill only if that content must stay single-sourced there. Expected mainly in enrichers (`x-{tech}-{tool}-*`).

## Don't depend on the workflow's landmarks

A skill must not name the **control-flow vocabulary** of the workflow that happens to invoke it — gate names, hook IDs, constraint names, path letters. Doing so couples the skill to one workflow's current shape: rename a gate and the skill is wrong, and the skill can no longer be used outside that workflow at all.

Express the **substance** instead, in terms the skill itself owns:

| Instead of                                            | Write                                                                      |
| ----------------------------------------------------- | -------------------------------------------------------------------------- |
| "its own Missing-docs gate must be answered first"    | "its docs must be written first — a separate decision, and a separate run" |
| "the Functionality gate answers No for those"         | "those are never functionalities, so they have no such docs"               |
| "carried in at hook {ID} and re-tagged at {later ID}" | "supplied as an input; if it is missing, stop and ask"                     |

The pattern: a skill states its **own** prerequisites, inputs and outputs, and reports what it cannot decide — it never describes _who_ decides or _when_. That keeps control flow outside skills, which is where it belongs.

**Two exceptions, both narrow:**

1. The `x-{tech}-{tool}-*` family (e.g. `x-ng-sp-plan-enricher`): it exists to operate on another tool's artifact inside that tool's lifecycle, so it may reference that lifecycle and the file that defines it.
2. A skill whose **subject is the workflow itself** (e.g. `x-sp-workflow-helper`, which exists to change it): the rule's cost — "the skill can no longer be used outside that workflow" — is not a cost for a skill that has no meaning outside it.

The line between them and everything else: a skill **invoked by** the workflow may not name its landmarks; a skill whose **subject is** the workflow must. No other kind may.

A skill's **own** guard is not a violation — a rule headed "Functionality gate" that stops the skill working on the wrong lib type is the skill guarding its own contract, even if the workflow happens to ask a similarly-named question.

## Don't hardcode paths to volatile code

Refer _conceptually_ (e.g. "the base `ui` lib's root CSS variables") rather than naming a concrete file under `libs/` or `apps/`, or embedding a literal value — so the skill survives the workspace evolving. Name an exact code path or value **only when the user explicitly asks**.

**Structural patterns are fine; specific files are not.** A placeholder path that describes the _shape_ every project follows — `src/lib/{version}/`, `apps/{app}-e2e/user-stories/`, a root config file like `jest.preset.js` — names a convention, not a file, and stays true as libs come and go. `libs/shared/ui/base/src/lib/v3/root.scss` names one file that can be renamed tomorrow.

**Exception — `docs/`:** these are the stable reference surface and exist to be cited, so refer to them by exact path freely.

## State today's rule, not how it got there

A skill is loaded **in full, every time it fires**, and everything in it is read as an instruction. History fails both tests at once: it costs exactly what a rule costs, and it instructs nobody.

The line is not "no explanation" — some rules are only obeyed when the reader knows what they prevent. The cut is **failure mode, not chronology**:

| Keep                                                                             | Drop                                                       |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| the failure a rule prevents, where knowing it changes whether the rule is obeyed | when it happened, how many times, or who did it            |
| "an unnamed obligation gets skipped, so name it in the checklist"                | "this was reworded twice before it stuck"                  |
| a **Revisit if** — the condition that would change the rule                      | a record of conditions that used to hold                   |

**Anything naming something that no longer exists is the worst case**, not merely dead weight. A reader cannot tell a retired thing from a live one, so they reason about it as though it were current — a retired kind, an old field name, a superseded path. Cite none of them; when a rule replaces another, state only the rule that now applies.

The same applies to a skill's own past shape. "This section used to cover X" tells a reader nothing they can act on, and invites them to look for X.

Where history genuinely matters it already has homes: a `docs/` page for a subsystem's reasoning, an ID registry's `DECISIONS.md` for a burned entry, and the repository's own history for the rest. **A skill points; it does not narrate.**

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

Prefer `scripts/` over prose for any edit that is genuinely mechanical. Prose instructions for a deterministic edit drift between runs; a script does not — and shipping one moves idempotency from a rule an agent has to apply into code that cannot forget.

**Keep a skill's content in the skill, and leave everything else where it is.** Cite `docs/` freely by exact path, but don't write into it — it is a curated reference surface, and adding to it is a separate, deliberate change, never a side-effect of building a skill.

**If an isolated execution agent must read something, give it a resolvable path.** Those agents read files but never invoke skills, so they cannot turn a phrase like "the canonical examples" into a location. The fix is the **path, not a new home**: leave the content where it lives and make sure whatever reaches the agent carries the literal repo-relative path to it. Never relocate content to make it reachable.

Keep linking a skill's own files the normal way — relative to the skill root (`assets/examples/ui.md`) — which is what reads well and what the spec expects. That path is correct _inside_ the skill and meaningless _outside_ it, because an execution agent resolves against the repo root. So when a skill holds files that must reach one, **state the skill's repo-relative path once**, near where those files are listed:

> These examples live under `.agents/skills/{name}/assets/examples/`. When handing one to an agent that cannot read this skill, give it that full path.

One line, and whoever carries the path onward copies something that resolves instead of reconstructing it.

## Before calling a rule change done — sweep for its other homes

A rule is rarely written in one place. Changing it where you happened to be reading is the easy half; the copies are what drift. This bites hardest when the rule change is **incidental to some larger design work** — the edit you set out to make gets made, and "where else does this rule live?" never comes up.

**The check, at completion time:** take a distinctive phrase from the text you just replaced and grep `.agents/skills/`, `.claude/skills/`, and `AGENTS.md` for it. Fix every hit in the same commit. It costs seconds, and it is the only thing that reliably finds the copies you forgot you wrote.

Where the same rule commonly repeats — check each that exists:

| Place                                                                                      | Why it holds a copy                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| the `SKILL.md` body                                                                        | where the rule is stated                                                                                                                                                                                                                                   |
| its **Common mistakes** table                                                              | rows often restate the rule instead of naming the fix                                                                                                                                                                                                      |
| its **todo checklist**                                                                     | must name every obligation its step carries — an obligation the todos omit is one that gets skipped                                                                                                                                                        |
| every file under `assets/template.md` **or** `assets/template/` **or** `assets/templates/` | the shape the writer must produce — a skill often has **several** (one per output file, or one scaffold per kind), and the rule can sit in a `>` helper note, a heading, sample content, or a table row alike. Check them all, not just the one you edited |
| `assets/examples/*`                                                                        | worked examples demonstrate the rule                                                                                                                                                                                                                       |
| `references/*`                                                                             | the long-form version                                                                                                                                                                                                                                      |
| **another skill**                                                                          | one that must inject the rule somewhere it cannot otherwise reach (e.g. into a plan read by execution subagents)                                                                                                                                           |
| `AGENTS.md`                                                                                | when the workflow states the rule as control flow                                                                                                                                                                                                          |
| `CONTEXT.md`                                                                               | when the change coins, renames or retires a **term**, or changes which spelling is correct — the glossary is updated at that moment, not on a review cadence (`docs/agents/context-md-format.md`)                                                          |
| the `.claude/` stub                                                                        | only when the `description` carries it                                                                                                                                                                                                                     |

**Remove drift sites while you are there.** Two habits cut the number of copies:

- **State a rule once per file.** A Common-mistakes row should carry the _fix action_ ("use `[TO-UPDATE]` exactly"), not a re-derivation of the rule it belongs to. A row that restates the rule is a second copy that will silently go stale.
- **Point rather than copy.** A skill should refer to `AGENTS.md` instead of restating it — **unless** it must place the text somewhere `AGENTS.md` cannot reach, which is the one case where duplication is genuinely forced. Then it is a known drift site: sweep it every time.

## Workflow wiring is not the skill's business

Write every skill so it stands on its own and triggers from its own `description`. **Do not wire it into the workflow** — no step naming it inside a path's `🪝` hook in `AGENTS.md`, and no row in that file's table of workspace skills. Not as part of creating it, and not afterwards. If it should be wired in, the user will say so; treat that as a separate, explicitly requested change.

## Common mistakes

| Mistake                                                  | Fix                                                                                                                                      |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Canonical skill updated, stub left behind                | Same commit, every stub — the `description` is the one duplicated field.                                                                 |
| Rule changed in one file, its copies left stale          | Grep a distinctive phrase from the replaced text across `.agents/skills/`, `.claude/skills/` and `AGENTS.md` before calling it done.     |
| Mistakes row restating a rule instead of naming the fix  | The row carries the fix action; the body owns the rule. A restatement is a second copy that will drift.                                  |
| Step gains an obligation the todo checklist doesn't name | Update the checklist too — agents follow todos under context pressure, so an unnamed obligation is skipped.                              |
| Copying the skill's content into the stub                | The stub is a pointer: frontmatter + one line. Content stays single-sourced.                                                             |
| Adding `metadata`/`version` to a stub                    | Stubs carry `name` + `description` only.                                                                                                 |
| Inline `metadata: { version: '1.0.0' }`                  | Use block form under `metadata:`.                                                                                                        |
| Tech segment on a tech-agnostic skill                    | Omit it — `ng` only when the skill is genuinely Angular-tied.                                                                            |
| Inventing a kind suffix                                  | Take it through _When a new kind is allowed_ — all three criteria, criterion 3 included. Do not coin one alone.                          |
| A kind minted for a skill nobody is building yet          | Criterion 3 is "a real skill needs it now". A kind with no instance has never had to work — that is how `injector` went years unusable.  |
| A kind picked from whether `scripts/` exists              | Machinery never decides a kind. It decides who owns idempotency — the script, or a recognition rule the skill writes down.               |
| A rule narrated with its history                         | State the rule that applies now. Keep the failure it prevents only where that changes whether it is obeyed; drop the chronology.        |
| One skill spanning unrelated subjects                    | Broad in verbs is fine; broad in subjects is a workflow. Split it and let control flow order the pieces.                                |
| A kind picked by which verb is the most work             | Count deliverables, never effort or frequency. Weight drifts, differs per reader, and has no wrong answer to catch.                     |
| `scaffolder` chosen because the target might not exist   | Creating the artifact is the empty case of maintaining a part within it. Ask whether the skill owns the whole thing or a part.           |
| A boundary case counted as a second verb                 | Create-then-update is one deliverable. Only a genuinely separate deliverable adds a kind — or a skill.                                  |
| Split into several skills to keep each one "pure"        | Three reasons justify a split: an independent lifecycle, an auditable judgement, two deliverables with no wrong guard. Otherwise, sections. |
| Citing something that has been retired or renamed        | A reader cannot tell it from a live one and will act on it. Name only what currently exists.                                            |
| A scriptable edit left as prose                          | Ship the transform. The kind is unchanged either way, so there is nothing to gain by leaving a deterministic edit to drift.              |
| Reviewer minted for a skill validating its own rules      | That is a helper with a proof in `scripts/`. `reviewer` is for judging input the **caller** supplies.                                    |
| A reviewer that fixes what it finds                      | Two skills, two runs. Findings stop being auditable once the same run makes them true.                                                  |
| "Produces nothing" in a skill that ships a writing script | Say what the script writes. The flat claim reads as false to anyone who opens `scripts/`.                                                |
| An editor that never says who applies it                 | Declare `document` or `in-session`. Undeclared, it names no moment it could fire at.                                                     |
| `kind:` and the name's suffix disagreeing                | They are two statements of one fact — fix whichever is wrong. A checker holds them to it.                                               |
| Description that summarises the skill's workflow         | WHAT names the output in one clause; the mechanics stay in the body.                                                                     |
| Changing a description without bumping the version       | Trigger changes are minor bumps.                                                                                                         |
| Naming another skill                                     | Name the artifact it produces. Reading another skill's internals is the only exception.                                                  |
| Hardcoding a `libs/` or `apps/` path                     | Describe it conceptually; only `docs/` paths are cited exactly.                                                                          |
| Naming a gate, hook ID, constraint or path letter        | State the substance the skill owns. Only two kinds may not: the `x-{tech}-{tool}-*` family, and a skill whose subject _is_ the workflow. |
| Putting the skill's own templates or examples in `docs/` | They live under the skill's `assets/`. `docs/` is for content the whole workspace needs.                                                 |
| Wiring the new skill into a path's hook or skills table  | Don't — skills stand alone unless the user explicitly asks for wiring.                                                                   |
| Creating a skill that duplicates one that already exists | Extend the existing skill and bump it; overlapping skills cannot coordinate.                                                             |
| Widening a description without reading the neighbours'   | A new trigger phrase can capture a sibling's requests. Check, then bind it narrowly or extend the sibling.                               |
| Pointing an execution agent at "the canonical examples"  | It reads files, not skills — give it the literal repo-relative path.                                                                     |
| Relocating content so an agent can reach it              | Leave it where it is and give the path.                                                                                                  |
| Skill-relative path handed to an execution agent         | It resolves against the repo root. State the skill's repo-relative path once, beside the file list.                                      |
