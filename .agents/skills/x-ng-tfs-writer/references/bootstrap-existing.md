# First-time TFS when libs already exist

Use this only when `docs/x/{name}/TFS/` does **not** exist yet, but one or more `map` / `data-access` / `ui` / `feature` / `page` libs that share the functionality `{name}` already exist in the workspace.

Prerequisite still holds: the **PRD** must exist (or be provided). If it is missing, STOP and ask — do not invent a TFS from code.

## What you may use as input

- The approved PRD (source of ACs and product scope).
- **Observable contracts** from existing owned libs that share `{name}`: public API surfaces, inputs/outputs, `[data-cy]` selectors already in templates, DEP config/asset keys already read — as candidates for lib specs and for Open Technical Questions when the PRD is silent.
- The library-types and naming-conventions docs.

## What you must not do

- **Do not invent** FRs/BRs or technical journeys that the PRD does not support. Code is evidence for contracts; the PRD is the product source of truth.
- **Do not add owned lib types** that are not in the classification / PRD just because similarly named folders exist elsewhere.
- **Do not absorb consumer pages** as this functionality's `page.md`.
- **Do not skip** putting Open Technical Questions to the user.

## How to proceed

1. Confirm `{name}` and owned lib types from the PRD + libs that share that name.
2. Write one `{libtype}.md` per owned type; ground public contracts in what exists where it matches the PRD.
3. Build the README ID Index with AC back-links; mark product-observable gaps as `(new — suggest a PRD AC)` per the main skill.
4. Validate, then Confirm Open Technical Questions as in the main skill.
