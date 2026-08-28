# First-time PRD when libs already exist

Use this only when `docs/x/{domain}/{name}/PRD/README.md` does **not** exist yet (look for `docs/x/*/{name}/PRD/README.md` when `{domain}` is not yet known), but one or more `map` / `data-access` / **single-purpose** `ui` / `feature` / `page` libs that share the functionality `{name}` already exist in the workspace. A **grab-bag** `ui` / `feature` lib has no functionality name and never gets a PRD — do not bootstrap one for it.

The **document now / skip** choice is control flow outside this skill. You are here only after the user chose to document.

## What you may use as input

- Brainstorm conclusions / the user's description of the change and of the functionality.
- **Observable facts** from the existing owned libs that share `{name}`: public inputs/outputs, routes the `page` owns, data the `data-access` exposes, visible UI states — as candidates for Data Requirements, flows, and Open Questions.
- The library-types doc (classification shapes).

## What you must not do

- **Do not invent** product intent, ACs, users, or non-goals from code. Code shows what is built; the PRD states what is required.
- **Do not reverse-engineer a full PRD silently.** Put gaps in Open Questions and ask.
- **Do not absorb consumer pages** as owned pages because they import this functionality.
- **Do not skip Confirm** — present every AC and get explicit approval before the PRD is done.

## How to proceed

1. Confirm the functionality `{name}` (from the lib names + user), with the stack's technology prefix (`docs/guidelines/naming-conventions.md` → Folders).
2. List candidate owned libs that share that `{name}`; classify with the library-types doc.
3. Derive **Domain** (`CONTEXT.md`) from those libs' `domain:` tags; all must agree; if they disagree, stop and ask. Write under `docs/x/{domain}/{name}/PRD/`.
4. Draft from the template using the description + observable facts; mark unknowns as Open Questions. Write **Last Verified** as `NOT YET`.
5. Validate, then Confirm with the user as in the main skill.
