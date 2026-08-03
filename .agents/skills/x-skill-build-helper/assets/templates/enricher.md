# Template — enricher skill (`x-{tech}-{tool}-…`)

An **enricher** edits a document that belongs to another tool — typically so workspace rules reach a place they otherwise could not, such as an execution step that runs in an isolated context and reads only that document.

This is the one kind that is **not** independently usable: it only makes sense inside the other tool's lifecycle. It is also the one kind permitted to name another skill, and then only to read something inside it.

Example: `x-ng-sp-plan-enricher`.

```markdown
---
name: x-{tech}-{tool}-{artifact}-{verb}
description: "WHAT? <the other tool's artifact, edited so <what> reaches <where>>. WHEN? <the lifecycle point + keywords>"
metadata:
  version: '1.0.0'
---

# {Artifact} {Verb}

## Overview

<Which artifact it edits and at exactly which point in the other tool's lifecycle.
State WHY it exists: what cannot reach its destination any other way.
End with the boundary: "It edits documents only — it builds nothing and writes no tests.">

## When to use

<The single lifecycle point. Then: "Do not use for <the path that doesn't need it>.">

## Prerequisites

**Required inputs — if any is missing, STOP and ask:**

- <the artifact itself>
- <each source document it folds in, by exact path>
- <any decision the user must already have made; never assume a default>

## Inputs & output

- **Reads:** <the artifact; the source documents; where the authoritative rule list lives>
- **Writes:** <the edited artifact, and precisely which parts of it>

## Workflow

<Numbered steps with a copyable, tagged checklist. Locate → source the rules →
edit the artifact → annotate the specific items → validate.>

## Rules

- **Carry, don't copy.** Inject _pointers_ to the source documents and the _concrete
  values_ each step needs — do not paste whole documents in. The artifact references
  the sources; it is not a second copy of them.
- **Merge, never duplicate.** If the section you add to already exists, enrich it in
  place; never append a second one.
- **Edit documents only.** Never scaffold, build, or write tests here.
- **The artifact is the only carrier.** Anything its downstream reader must obey but
  that isn't written into it will not arrive.
- **Record decisions, never make them.** Where a choice belongs to the user, write down
  what was chosen; if you don't know it, stop and ask. Do not default.
- **Don't hardcode which skills supply the rules.** Defer to the workflow definition for
  the source set; point readers at the source-of-truth documents, not at skill names.

## Validate

**Review Checklist** — before finalising, verify:

- [ ] <one line per rule, phrased as a check>
- [ ] Nothing was built, scaffolded, or tested — only the artifact was edited.

**Validation Steps (iterative loop):** check every item; if any fails, fix and re-check
the whole list; only when all pass, report.

## Summary

1. Report the artifact edited and what was folded in.
2. List each item annotated and the values added to it.
3. Note any prerequisite gaps you had to stop for.

## Common mistakes

| Mistake       | Fix              |
| ------------- | ---------------- |
| <the failure> | <the correction> |
```

## Notes

- **Name it after the artifact and the verb**, not after the rules it carries — the artifact is what makes this kind distinct. Keep the tool segment: it is the short name of the tool that owns the artifact (`sp` = Superpowers), so `x-ng-sp-plan-enricher` reads as "Angular · Superpowers · plan · enricher".
- **This kind is exempt from "never name another skill", narrowly.** It may name one to read that skill's internals (a template or asset it must stay in sync with). It still may not name a skill merely to consume its output — reference the produced file instead.
- Its output is only as durable as the artifact. If the other tool's file is ephemeral, everything this skill writes disappears with it — which is correct, and the reason the durable rules must also live somewhere permanent.
- Because it is lifecycle-bound, it is the one kind whose Prerequisites should include _decisions_ as well as files.
