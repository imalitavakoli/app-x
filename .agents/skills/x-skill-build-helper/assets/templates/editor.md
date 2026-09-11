# Template — editor skill

An **editor** supplies the spec for editing files that **already exist** — where to look, what to change, and how to tell the change has already been made. The edit itself is applied either by a `scripts/` transform the skill ships, or by an agent following the spec by hand.

**Machinery is optional and does not change the kind.** What it changes is **who guarantees repeatability**: with a script, idempotency lives in code that cannot forget; without one, the skill has to write down a recognition rule an agent can apply. Ship a script wherever the edit is genuinely mechanical — prose for a deterministic edit drifts between runs — and where it is not, say so plainly rather than implying a repeatability you do not have.

Examples: `x-codeowners-editor` (ships the transform); an editor that adds logging calls where the right call site is a judgement (does not).

**A target that may not exist yet does not make this a scaffolder.** If the skill maintains a part within an artifact — one line, one entry, one member — then creating that artifact when it is absent is the edit's **empty case**, and belongs in the edit procedure as a branch. Becoming a scaffolder would import the wrong guard: _target already exists → STOP_ halts the normal run, where the artifact is there and only the part is missing.

## Declare the invoker — do this before anything else

A skill is text. It never edits anything: an **agent holding tools** does, having read this skill. So an editor has to arrive in the context where that editing happens, and there are only two ways in. Pick one, say which, and say it in the scaffold:

| Shape                                                                                | The edit is made by                       | Reaches an editing context that cannot invoke skills? |
| ------------------------------------------------------------------------------------ | ----------------------------------------- | ----------------------------------------------------- |
| **document** — the artifact that context reads names this skill's repo-relative path  | that agent, reading this file as prose    | **yes** — the only shape that does                    |
| **in-session** — the agent making the edits is one that can invoke skills, so it self-fires | that agent, from this skill's `description` | no                                                    |

**Some editing contexts read files and never invoke a skill.** Where the agent doing the editing is one of those, only the `document` shape arrives at all — the other is a skill nothing will ever call. If your skill must work there, it ships a path.

**Both may be true.** Say which, and say which is primary. What is not allowed is silence: an editor that never says who applies it names no moment it could fire at.

## The boundary — behaviour that would carry acceptance criteria is not yours

If the edit changes what the product **does** — an event a stakeholder would sign off on, a user-visible string, anything someone would write an acceptance criterion for — that is design work, and it goes through the normal design and planning route. This skill's job shrinks to the mechanical shape of the change once the requirement exists.

The tell: **if you cannot name the rule the edit follows, you are not editing — you are deciding.** Split the skill, or hand the decision back.

```markdown
---
name: x-{tech}-{domain}-editor
description: 'WHAT? <the edit it specifies, one clause>. WHEN? <the situations + keywords>'
metadata:
  kind: editor
  version: '1.0.0'
---

# {Domain} Editor

## Overview

<What kind of edit this specifies, and into what kind of target. Say plainly that the agent
reading this makes the edit — this skill supplies the rule, not the change.>

## Invoker & moment

**Shape:** <document | in-session> — <one sentence on who applies it and when>.
<For `document`: state this skill's repo-relative path once, so whatever carries it copies
something that resolves.>
<For `in-session`: say what the description is bound narrowly enough to avoid capturing.>

## When to use

<Triggers. Then when NOT to — generated files, vendored code, and anything whose behaviour
would carry an acceptance criterion.>

## Target & scope

<How to find the target and which members to touch. Conceptually — never a hardcoded path
under libs/ or apps/. Say what is explicitly out of scope.>

## Prerequisites

The target must exist and be identifiable. If it is ambiguous or there is more than one
candidate, STOP and ask — do not pick one.
<If the edit implements a requirement, name the requirement as an input; never invent it.>

## The edit

<Exactly what changes and where: imports, call sites, naming, ordering. Give one worked
before/after — a spec an agent applies by hand needs an example far more than a scripted
one does, because there is no transform to disambiguate it.>

## Already done?

How to recognise the edit has already been applied, and what to do then — update in place,
or leave it. An agent cannot rely on a script's idempotency here, so the recognition rule
has to be written down.

## Verify

Build, lint and test the touched project after editing. On failure, fix or revert —
never leave the workspace in a state that does not build.

## Optional prefs — DROP this heading and everything under it if the skill stores nothing, or if the four live in a file SKILL.md already points at

<If it stores state: include all four from _Document the store_ — Resolve
**per key**, a key table, the `version` mismatch rule (`version` is the file shape, not
`metadata.version`), and one example of the file. Default home is this section. If
resolving already requires another of the skill's files, put the four there and replace
this section with a pointer.>

## Common mistakes

| Mistake       | Fix              |
| ------------- | ---------------- |
| <the failure> | <the correction> |
```

## Notes

- **Ask once, early: can this be a script?** If yes, ship one — the kind is the same either way, and prose is only quicker to write, never safer to run. The temptation is to skip the transform because the spec already reads clearly.
- **_Already done?_ is this kind's hardest section and the one most often skipped.** With a script, the transform owns idempotency. Without one, this section is the only thing standing between a second run and a duplicated edit, and it has to be a rule an agent can actually apply — not "check whether it is already there".
- **Give a worked before/after.** A scripted edit is specified by its code; a hand-applied edit is specified by prose, which is far more likely to be read two ways.
- An editor that cannot find its target must stop. Editing the wrong file is worse than doing nothing.
- **A skill that edits and also decides is two skills.** Keep this one to the shape of the change, and name the requirement as an input.
