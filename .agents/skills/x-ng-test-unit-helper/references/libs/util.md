# Util libs — `requirements/` + unit IDs

Read this when writing or updating unit tests for a **`util`** lib version folder.

A `util` may be **single-purpose** (one concern, one `src/lib/v1/`) or a **grab-bag** (several unrelated helpers, each with its own `src/lib/{name}-v1/`). **It changes nothing here** — a `util` is never a functionality either way, and the location rule below already resolves per item for a grab-bag and per lib for a single-purpose one. (For `ui` / `feature` the shape _does_ decide whether the lib is a functionality — see [grab-bag.md](grab-bag.md).)

## Where

Beside the **inner** (version) README:

`{util-lib}/src/lib/{version-folder}/requirements/` — a **folder**: `README.md` (live) + `DECISIONS.md` (burned IDs)

Example: `libs/shared/util/ng-formatters/src/lib/date-format-v1/requirements/README.md`, in a `requirements/` folder next to that version folder’s own `README.md`.

## Lifecycle

- Created/updated by the **unit-test work**, not by a separate writer skill (same timing idea as the e2e `user-stories/` registry).
- If missing when you write the first ID-tagged util unit test → **create** the folder and its `README.md`.
- If it exists → **update** it: preserve existing IDs and never renumber. Adding is not the only outcome — an entry can also be **amended** (rewritten under its existing ID) or **retired** (moved to `DECISIONS.md`, number burned). The four outcomes and the reporting rule are in the parent skill.
- **A new version folder copies the predecessor's `DECISIONS.md`** — `{KEY}` drops the version, so `date-format-v1` and `date-format-v2` share one ID space; without the copy, deleting v1 frees numbers v2 could re-mint.
- Do **not** create `docs/x/…` PRD/TSD for a util lib.

## IDs

- Pattern: `UTIL-{KEY}-FR-##` / `UTIL-{KEY}-BR-##`
- `{KEY}`: basename of `{version-folder}` → strip trailing `-v{digits}` → uppercase → `-` to `_`
  - `date-format-v1` → `DATE_FORMAT` → `UTIL-DATE_FORMAT-FR-01`
  - `capacitor-browser-v1` → `CAPACITOR_BROWSER`
- Same `{KEY}` for every ID in that file.
- No ACs in this file.

## Spec mapping

- `describe` ↔ FR from this registry’s `README.md`
- `it` ↔ BR from this registry’s `README.md`
- AAA / Given-When-Then titles / preset / observable-effect rules: same as the parent skill.

## Doc shape

Minimal: short intro + FRs with nested BRs (Given/When/Then). Imitate the example folder [../../assets/examples/requirements/](../../assets/examples/requirements/) (repo path when handing to a subagent: `.agents/skills/x-ng-test-unit-helper/assets/examples/requirements/`).

## Common mistakes

| Mistake                                              | Fix                                                                           |
| ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| Skipping util unit tests because no TSD              | Write tests; use this file for IDs                                            |
| Inventing TSD-like IDs without `UTIL-` prefix        | Always `UTIL-{KEY}-…`                                                         |
| Putting `requirements/` at lib outer root only       | It lives beside the **inner** version README                                  |
| Deleting a retired entry instead of moving it        | Move it to `DECISIONS.md` — a deleted number cannot be seen to be burned      |
| A new version folder starting with no `DECISIONS.md` | Copy the predecessor's — `{KEY}` drops the version, so the ID space is shared |
| Creating `docs/x/` for a util                        | Never — util is not a functionality                                           |
