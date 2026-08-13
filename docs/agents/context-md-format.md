[🔙](../../README.md#guidelines)

# `CONTEXT.md` format 📖

How to write and maintain the workspace glossary at `CONTEXT.md` (repo root).

**What belongs in it at all** is decided by [where-content-lives.md](where-content-lives.md) → _a term's meaning vs its consequences_. Read that first; this doc only covers the shape of an entry once the fact belongs here.

&nbsp;

## Entry shape

```markdown
**{Term}**:
{One or two sentences saying what it IS.}
_Avoid_: {alternative names we do not use, comma-separated}
```

- **One term per concept.** If two names are in circulation, pick one and put the loser under `_Avoid_`. Two entries for one concept defeats the file's purpose.
- **Define the thing, not its behaviour.** No "so it gets…", no "which means you must…". Those are consequences and live in the subsystem doc.
- **Group when it helps.** Use `##` sections for clusters once the flat list stops scanning well; keep it flat while it still does.
- **Bold the term, colon, definition on the next line.** Consistent shape is what makes the file skimmable and greppable. (Some published examples of this format put the definition on the same line as the term — we do not; pick one and keep it.)

**This workspace is single-context:** one `CONTEXT.md` at the repo root, and **no `CONTEXT-MAP.md`**. That file exists in the wider convention to index several contexts in one repo; we have one product domain, so its absence is deliberate — do not create it.

&nbsp;

## What to leave out

Ask: **is this term specific to this workspace, or would it mean the same in any repo?** Only the first belongs here.

| Leave out                                                    | Why                                                             |
| ------------------------------------------------------------ | --------------------------------------------------------------- |
| General programming concepts (mock, signal, guard, monorepo) | They mean the same everywhere; defining them is noise           |
| Framework vocabulary (Angular, Nx, Jest, Cypress terms)       | Their own documentation owns them                               |
| Anything with no competing name and no ambiguity              | An entry that could never be misread earns nothing              |
| Consequences, procedures, examples of use                     | [where-content-lives.md](where-content-lives.md) routes these   |

&nbsp;

## `_Avoid_` is not decoration

It is the working half of an entry. Our naming rules are load-bearing — a wrong marker or class name breaks a grep or a selector, not just a style preference — so the rejected spellings belong here rather than as a mistakes-table row inside one skill:

- `[TO-UPDATE]`, never `[UPDATE REQUIRED]` — it must stay greppable across every TFS.
- `e-popup`, never `e-popup-v2` — the CSS class carries no version.
- **retired**, never "deleted" — a retired entry moves to `DECISIONS.md`; deleting it is a different (wrong) action.

Omit `_Avoid_` only when no alternative name is plausible.

&nbsp;

## Flagged ambiguities

A `## Flagged ambiguities` section at the end holds terms that are **in use but not settled** — two readings in circulation, or a name nobody is happy with. Record the competing readings so the eventual resolution is a real decision rather than a fresh coinage.

**This does not block anything.** It is deliberately weaker than a PRD's or TFS's Open Questions, which must be put to the user before that doc is finished. A glossary ambiguity is a parking spot: it exists so a contested term is not silently coined twice in two skills. Resolve one when the work makes the answer obvious, and move it into the body.

&nbsp;

## Maintenance — event-driven, not dated

The glossary is **not** verified against code, so it carries **no `Last Verified` stamp**. That stamp means "checked against shipped behaviour" everywhere else in the workspace (PRD, TFS, `user-stories/`, `requirements/`), and reusing the word here for a different relationship would be exactly the confusion this file exists to prevent.

Its failure mode is not staleness against code but **incompleteness against vocabulary**: a term coined and not recorded, or renamed and not updated. So it is maintained at the moment a term changes, not on a review cadence:

1. **Coining a term** — one that will appear in more than one doc, skill, or test title → add its entry in the same change.
2. **Renaming or retiring a term** — update the entry and move the old name into its `_Avoid_` line, so the dead name still resolves for a reader who meets it in an old commit or comment.
3. **Sweeping** — `x-skill-build-helper` → _Before calling a rule change done_ lists `CONTEXT.md` among the places a changed rule may already live. That sweep is the trigger; there is no separate review step to schedule.

If a completeness check is ever wanted, the mechanical one is cheap and needs no stamp: grep the codebase and docs for the words listed under `_Avoid_`. A hit is either a term to fix or an `_Avoid_` line to reconsider.

[🔙](../../README.md#guidelines)
