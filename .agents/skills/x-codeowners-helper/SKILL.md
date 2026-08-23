---
name: x-codeowners-helper
description: "WHAT? The rules and a mechanical insert for updating root CODEOWNERS when a path is created or handed off. WHEN? Creating a new app, lib, or shared version-folder; an explicit ownership handoff; asked to update a CODEOWNERS owner, hand off a path, or add a code-owner line. Not for ordinary edits under an existing path."
metadata:
  version: '1.0.0'
---

# Codeowners Helper

## Overview

This skill is a **helper**: it puts the workspace's root `CODEOWNERS` conventions into your
context. It **produces nothing** — the edit is made by the session that loaded this skill, or
by running `.agents/skills/x-codeowners-helper/scripts/upsert-owner.mjs`, never by hand-editing
the file from what this skill says.

## When to use

- A new app, lib, or shared version-folder was just created and needs an owner line.
- The user, or the plan text driving the work, explicitly names a path and a new owner —
  an ownership handoff.

**Not** for ordinary feature edits, reviews, or bug fixes under a path that already has an
owner. Touching a file inside someone else's owned path is not, by itself, a reason to open
`CODEOWNERS`.

## Identity

Never write `@<display name>` straight from the conversation, and never guess a team.
Resolve the owner handle through this ladder, in order, stopping at the first step that
resolves it:

1. **Owner stated this cycle** — the user or the plan text explicitly named the handle to use
   for this path. Use it as given.
2. **Match `git config user.name`** against the handles already present in `CODEOWNERS`,
   case-insensitively. This is the actual identity check — it is independent of whatever name
   the person uses in chat.
3. **One obvious candidate from step 2** — propose using the fallback owner already on the
   root rule (the catch-all line) and confirm once before writing anything.
4. **Several matches, or unclear whether the target is an individual or a team** — ask once
   rather than picking.

A person's chat display name is not evidence of their handle. If `git config user.name` gives
"Alice" but the only matching entry in `CODEOWNERS` is `@Ali`, propose `@Ali` — do not invent
`@Alice`.

## Create

Adding an owner line for a newly created path:

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
- A short co-ownership transition (`@old @new`) is fine when asked for; drop `@old` once the
  handoff is final.
- Run the script in handoff mode; never infer a handoff from who happened to touch files.

## Layout

Section grouping and entry sort order inside `CODEOWNERS` are maintained by the script, not
by hand. Never hand-edit the sort order or section banners — run the script and let it
re-serialize the section it touched.

These conventions are enforced by
`.agents/skills/x-codeowners-helper/scripts/upsert-owner.mjs`. When handing this off to an
agent that cannot read this skill, give it that literal repo-relative path.

## Common mistakes

| Mistake | Fix |
| --- | --- |
| Writing the owner as the person's chat display name | Resolve through the Identity ladder instead — `git config user.name` matched against existing `CODEOWNERS` handles, not the conversation. |
| Reassigning a path's owner because someone touched a file under it | Leave the existing owner line as-is; do not run the script unless a handoff was explicitly named. |
| Composing or re-sorting the CODEOWNERS line by hand | Run `upsert-owner.mjs` — it owns insertion, rewriting, and sort order. |
| Rewriting an existing owner line during a create | Stop and ask; run the script in handoff mode instead of create. |
