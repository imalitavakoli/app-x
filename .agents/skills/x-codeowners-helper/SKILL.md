---
name: x-codeowners-helper
description: 'WHAT? The rules and a mechanical insert for updating root CODEOWNERS when a path is created or handed off. WHEN? Creating a new path (app, lib, version-folder, or any other new file/dir); an explicit ownership handoff; asked to update a CODEOWNERS owner, hand off a path, or add a code-owner line. Not for ordinary edits to an existing path, whether or not it already has a more-specific owner line.'
metadata:
  version: '1.2.0'
---

# CODEOWNERS Helper

## Overview

This skill is a **helper**: it puts the workspace's root `CODEOWNERS` conventions into your
context. It **produces nothing** — the edit is made by the session that loaded this skill, or
by running `.agents/skills/x-codeowners-helper/scripts/upsert-owner.mjs`, never by hand-editing
the file from what this skill says.

## When to use

- A **new path** was just created and needs an owner line — an app, lib, or shared
  version-folder, **or any other new file or directory** (a doc, a
  workspace config, and so on). A workflow may auto-load this skill only for a new
  app / lib / version-folder; for any other new path, this skill still applies when it
  is loaded or the user asks to add a code-owner line.
- The user, or the plan text driving the work, explicitly names a path and a new owner —
  an ownership handoff — or asks to add a code-owner line.

**Not** for ordinary feature edits, reviews, or bug fixes on a path that **already
exists**. Do not add a line just because the path has no more-specific owner line.
A global `*` fallback is **optional** — if the file has none, that is fine; still do
not add a line on an ordinary edit, and do not invent a `*`. Touching a file under
someone else's owned path is also not, by itself, a reason to open `CODEOWNERS`.

## Identity

Never write `@<display name>` straight from the conversation, and never guess a team.
Resolve the owner handle through this ladder, in order, stopping at the first step that
resolves it:

1. **Owner stated this cycle** — the user or the plan text explicitly named the handle to use
   for this path. Use it as given.
2. **Match `git config user.name`** against the handles already present in `CODEOWNERS`,
   case-insensitively. This is the actual identity check — it is independent of whatever name
   the person uses in chat.
3. **One obvious candidate from step 2** — propose that handle and confirm once. Do not
   invent a `*` fallback if the file has none; if a `*` line exists, its owner is just
   another handle already in the file (step 2), not a required default.
4. **Several matches, or unclear whether the target is an individual or a team** — ask
   once rather than picking. When asking, mention that a stable team is preferred if a
   group owns the area. Never guess a team.

A person's chat display name is not evidence of their handle. If `git config user.name` gives
"Alice" but the only matching entry in `CODEOWNERS` is `@Ali`, propose `@Ali` — do not invent
`@Alice`.

## Create

Adding an owner line for a newly created path (any new file or directory, not only
an app / lib / version-folder):

- The line is added in the same commit as the new path (or, in an interactive session, the
  same uncommitted task).
- Run the script in create mode; do not compose the line by eye.
- If the script reports the path already has an owner (a `handoff` error), stop and ask —
  do not silently rewrite the existing line. A path that already has an owner is a handoff,
  not a create, and the two follow different rules above.

## Handoff

Reassigning an existing owner line:

- Only do this when the user, or the plan text, explicitly names the path **and** the new
  owner. An edit under someone else's owned path is never on its own grounds for a handoff —
  see Identity above for how the new owner's handle is resolved once a handoff is confirmed.
- **Ask once** whether to keep the old owner as co-owner (`@old @new`) or replace them
  (`@new` only). Do **not** ask when the owner list is already stated this cycle
  (`@new` only, or `@old @new`), when this is a create (there is no `@old`), or when
  this is an ordinary edit (no handoff). There is no timer and no "handoff is final"
  signal — if they choose keep, leave `@old` until a later handoff asks again.
- Run the script in handoff mode with the chosen owner string; never infer a handoff
  from who happened to touch files.

## Layout

Section grouping and entry sort order inside `CODEOWNERS` are maintained by the script, not
by hand. Never hand-edit the sort order or section banners — run the script and let it
re-serialize the section it touched.

The script's CLI: `--path <path>` `--owner <owner>` `--handoff` (omit for create) `--file <CODEOWNERS path>` (defaults to the repo-root `CODEOWNERS`). For a co-ownership handoff, pass `--owner "@old @new"` — see Handoff above.

These conventions are enforced by
`.agents/skills/x-codeowners-helper/scripts/upsert-owner.mjs`. When handing this off to an
agent that cannot read this skill, give it that literal repo-relative path.

## Common mistakes

| Mistake                                                                        | Fix                                                                                                                                       |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Writing the owner as the person's chat display name                            | Resolve through the Identity ladder instead — `git config user.name` matched against existing `CODEOWNERS` handles, not the conversation. |
| Reassigning a path's owner because someone touched a file under it             | Leave the existing owner line as-is; do not run the script unless a handoff was explicitly named.                                         |
| Adding a line because an **existing** path has no more-specific owner (or no `*`) | Leave it; ordinary edits never add a line. Do not invent a `*` fallback.                                                                  |
| Dropping `@old` because the handoff "looks final"                          | Ask once: keep as `@old @new` or replace with `@new` only. Never drop without that answer (or an already-stated owner list).              |
| Composing or re-sorting the CODEOWNERS line by hand                            | Run `upsert-owner.mjs` — it owns insertion, rewriting, and sort order.                                                                    |
| Rewriting an existing owner line during a create                               | Stop and ask; run the script in handoff mode instead of create.                                                                           |
