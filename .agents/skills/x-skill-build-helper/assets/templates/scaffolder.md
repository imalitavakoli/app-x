# Template — scaffolder skill

A **scaffolder** supplies the spec for creating something that does not exist yet — a project, a lib, a folder tree, a set of files that only make sense together. Its subject is **new**, which is what separates it from the two kinds either side.

| Not a scaffolder                                          | It is a…                                                    |
| --------------------------------------------------------- | ----------------------------------------------------------- |
| one document, at a path the skill owns, in a shape it defines | **writer**                                                  |
| a change to files that already exist                      | **editor**                                                  |
| the examples a builder imitates, with no creation step     | **helper** — supplying the pattern is not creating from it   |

The last row is the one to watch: a skill that says "here is what a good one looks like" is a helper, even when the reader goes on to create something. A scaffolder is the one that says **create it, here, like this**.

## Run the real generator, never hand-write the tree

If the ecosystem ships a generator for this, the scaffolder's job is to **invoke it with the right arguments and then finish what it leaves undone** — not to write the files itself. A hand-written tree drifts from what the tool produces the moment the tool changes, and nothing catches it.

State the tool as *what it is today, and re-checkable*:

> Scaffolding today goes through <the tool> (re-check; it can change). Read the workspace's own configuration for the current invocation rather than trusting the flags written here.

Where no generator exists, say so explicitly — that is the case where hand-writing is correct, and a reader needs to know which case they are in.

## The half that gets forgotten: wiring

Creating the tree is the easy half. What a scaffolder earns its place on is everything the generator *does not* do — the registrations, ownership, exports, config entries, and index files that leave the new thing actually usable. List them as steps, and say which are conditional.

```markdown
---
name: x-{tech}-{domain}-scaffolder
description: 'WHAT? <what it creates, one clause naming the thing>. WHEN? <the situations + keywords>'
metadata:
  kind: scaffolder
  version: '1.0.0'
---

# {Domain} Scaffolder

## Overview

<What it creates, and what the created thing is for. Say plainly that the agent reading this
runs the generator and does the wiring — the skill supplies the spec.>

## When to use

<Triggers. Then when NOT to: when the thing already exists (that is an editor's job), and
when what to create has not been decided yet (that is a design decision, not scaffolding).>

## Prerequisites

**Required inputs — if any is missing, STOP and ask. Never invent them:**

- <the name>, <the location>, <the type or variant>
- <any decision that changes the shape of what gets created>

**If the target already exists, STOP.** Creating over an existing thing is not this skill's
job, and overwriting is never the recovery.

## What gets created

<The tree, as a tree. Mark what is always present and what depends on an input.
Use placeholder paths that describe the shape — never a concrete path under libs/ or apps/.>

## Generate

<The generator invocation and how to confirm the current flags. If there is no generator,
say so here and give the files to create instead.>

## Wire it up

<Numbered steps for everything the generator leaves undone — registrations, exports,
config, ownership, index entries. Mark each conditional one with its condition.>

## Verify

Build, lint and test the new thing before calling it done. A scaffold that does not build is
not a scaffold, and this is the step that most often gets skipped because the files look right.

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

- **The generator is the source of truth for the tree.** Every file this skill spells out by hand is a file that can silently diverge from what the tool actually emits. Spell out the *arguments* and the *wiring*, not the output.
- **Existing target → stop, always.** This is the one prerequisite that cannot be softened. Overwriting is the failure mode that loses work, and "it looked empty" is how it happens.
- **Name and location are inputs, never inferences.** A scaffolder that guesses a name creates something nobody can find, and renaming after the fact is far more expensive than asking.
- **Verify is not optional here.** Unlike a document, a scaffold has a build to pass, so there is an objective answer available — take it.
- **A scaffolder that also decides what to build is two skills.** What to create belongs to whatever owns requirements or design; keep this one to creating it.
