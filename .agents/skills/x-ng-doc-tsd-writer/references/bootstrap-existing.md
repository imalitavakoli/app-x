# First-time TSD when libs already exist

Use this only when `docs/x/{domain}/{name}/TSD/` does **not** exist yet (look for `docs/x/*/{name}/TSD/` when `{domain}` is not yet known), but one or more `map` / `data-access` / **single-purpose** `ui` / `feature` / `page` libs that share the functionality `{name}` already exist in the workspace. A **grab-bag** `ui` / `feature` lib has no functionality name and never gets a TSD — do not bootstrap one for it.

Prerequisite still holds: the **PRD** must exist (or be provided — `docs/x/{domain}/{name}/PRD/README.md`, or the path the caller passed). If it is missing, STOP and ask — do not invent a TSD from code. Copy `{name}` and **Domain** from that PRD; if the PRD has no Domain field → stop and ask; do not infer.

## What you may use as input

- The approved PRD (source of ACs and product scope).
- **Observable contracts** from existing owned libs that share `{name}`: public API surfaces, inputs/outputs, `[data-cy]` selectors already in templates, DEP config/asset keys already read — as candidates for lib specs and for Open Technical Questions when the PRD is silent.
- The library-types and naming-conventions docs.

## What you must not do

- **Do not invent** FRs/BRs or technical journeys that the PRD does not support. Code is evidence for contracts; the PRD is the product source of truth.
- **Do not add owned lib types** that are not in the classification / PRD just because similarly named folders exist elsewhere.
- **Do not absorb consumer pages** as this functionality's `page-v{n}.md`.
- **Do not skip** putting Open Technical Questions to the user.

## How to proceed

1. Copy `{name}` and **Domain** from the PRD. Do not re-derive either. Confirm owned lib types from the PRD + libs that share that `{name}`.
2. Write one `{libtype}-v{n}.md` per owned type per live version under `docs/x/{domain}/{name}/TSD/`; ground public contracts in what exists where it matches the PRD. Write **Last Verified** as `NOT YET` on `README.md` and every lib file.
3. Build the README ID Index with AC back-links; mark product-observable gaps as `(new — suggest a PRD AC)` per the main skill. Copy Overview **Domain** from the PRD header.
4. Validate, then Confirm Open Technical Questions as in the main skill.
