# Util libs — `requirements.md` + unit IDs

Read this when writing or updating unit tests for a **`util`** lib version folder.

## Where

Beside the **inner** (version) README:

`{util-lib}/src/lib/{version-folder}/requirements.md`

Example: `libs/shared/util/ng-formatters/src/lib/date-format-v1/requirements.md` next to that folder's `README.md`.

## Lifecycle

- Created/updated by the **unit-test work**, not by a separate writer skill (same timing idea as e2e `user-stories.md`).
- If missing when you write the first ID-tagged util unit test → **create** it.
- If it exists → **update** it: preserve existing IDs; never renumber; only add.
- Do **not** create `docs/x/…` PRD/TFS for a util lib.

## IDs

- Pattern: `UTIL-{KEY}-FR-##` / `UTIL-{KEY}-BR-##`
- `{KEY}`: basename of `{version-folder}` → strip trailing `-v{digits}` → uppercase → `-` to `_`
  - `date-format-v1` → `DATE_FORMAT` → `UTIL-DATE_FORMAT-FR-01`
  - `capacitor-browser-v1` → `CAPACITOR_BROWSER`
- Same `{KEY}` for every ID in that file.
- No ACs in this file.

## Spec mapping

- `describe` ↔ FR from this `requirements.md`
- `it` ↔ BR from this `requirements.md`
- AAA / Given-When-Then titles / preset / observable-effect rules: same as the parent skill.

## Doc shape

Minimal: short intro + FRs with nested BRs (Given/When/Then). Imitate [../../assets/examples/requirements.md](../../assets/examples/requirements.md) (repo path when handing to a subagent: `.agents/skills/x-ng-test-unit-helper/assets/examples/requirements.md`).

## Common mistakes

| Mistake | Fix |
| --- | --- |
| Skipping util unit tests because no TFS | Write tests; use this file for IDs |
| Inventing TFS-like IDs without `UTIL-` prefix | Always `UTIL-{KEY}-…` |
| Putting `requirements.md` at lib outer root only | It lives beside the **inner** version README |
| Creating `docs/x/` for a util | Never — util is not a functionality |
