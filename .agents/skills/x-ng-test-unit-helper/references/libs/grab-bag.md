# Grab-bag `ui` / `feature` libs — `requirements/` + unit IDs

Read this when writing or updating unit tests for an item inside a **grab-bag** `ui` or `feature` lib.

## Is it a grab-bag?

A grab-bag holds several **unrelated** items that share only a technical kind (directives, pipes, animations); each versions on its own. A single-purpose lib holds **one** product concern and versions as a whole.

- **Tell (shared libs):** per-item version folders (`src/lib/toggle-me-v1/`) = grab-bag. One folder for the whole lib (`src/lib/v1/`) = single-purpose.
- **App-domain libs** have no version folders — apply the concern test directly.
- **Only `util`, `ui` and `feature` can be grab-bags** — a `map`/`data-access` is bound to one functionality and a `page` is one screen, so never ask the question for those.
- **A `util` may be either shape and it changes nothing** — it is never a functionality either way, so use [util.md](util.md), not this file. This file is for `ui` / `feature`, where the shape decides whether the lib is a functionality at all.
- Authoritative definition: `docs/getting-started/library-types-and-their-relationship.md` → Single-purpose vs grab-bag.

A grab-bag is **not a functionality**: no `docs/x/…` PRD or TFS, no ACs, and **never e2e**. A single-purpose `ui`/`feature` lib is the opposite — use the parent skill's TFS contract for those.

## Where

Beside the **inner** (version/item) README, exactly as for `util`:

`{lib}/src/lib/{item-version-folder}/requirements/` — a **folder**: `README.md` (live) + `DECISIONS.md` (burned IDs)

Example: `libs/shared/ui/ng-directives/src/lib/toggle-me-v1/requirements/README.md`, in a `requirements/` folder next to that item folder’s own `README.md`.

**One registry per item**, never one for the whole lib — the items are unrelated, so a shared file would mix concerns and grow without bound.

## Lifecycle

- Created/updated by the **unit-test work**, not by a separate writer skill (same as `util`).
- Missing when you write the first ID-tagged test for that item → **create** the folder and its `README.md`.
- Exists → **update** it: preserve existing IDs and never renumber. Adding is not the only outcome — an entry can also be **amended** (rewritten under its existing ID) or **retired** (moved to `DECISIONS.md`, number burned). The four outcomes and the reporting rule are in the parent skill.
- **A new item-version folder copies the predecessor's `DECISIONS.md`** — `{KEY}` drops the version, so `toggle-me-v1` and `toggle-me-v2` share one ID space.
- Do **not** create `docs/x/…` PRD/TFS, and do **not** add the item to another functionality's TFS.

## IDs

- Pattern by lib type: `UI-{KEY}-FR-##` / `UI-{KEY}-BR-##` · `FEA-{KEY}-FR-##` / `FEA-{KEY}-BR-##`
- `{KEY}`: basename of the item's version folder → strip trailing `-v{digits}` → uppercase → `-` to `_`
  - `toggle-me-v1` → `TOGGLE_ME` → `UI-TOGGLE_ME-FR-01`
  - `form-validate-email-or-tel-v1` → `FORM_VALIDATE_EMAIL_OR_TEL`
- Same `{KEY}` for every ID in that file.
- No ACs in this file.

## Spec mapping

- `describe` ↔ FR from this registry’s `README.md`
- `it` ↔ BR from this registry’s `README.md`
- AAA / Given-When-Then titles / preset / observable-effect rules: same as the parent skill.

## Doc shape

Minimal: short intro + FRs with nested BRs (Given/When/Then). Imitate the example folder [../../assets/examples/requirements/](../../assets/examples/requirements/) (repo path when handing to a subagent: `.agents/skills/x-ng-test-unit-helper/assets/examples/requirements/`), swapping `UTIL-` for `UI-` / `FEA-`.

## Common mistakes

| Mistake                                                    | Fix                                                                              |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Writing a PRD/TFS because the lib type is `ui` / `feature` | Grab-bags are not functionalities — use this file for its IDs                    |
| One `requirements/` for the whole grab-bag lib             | One per item, beside its inner version README                                    |
| Using `UTIL-` for a grab-bag `ui` item                     | `UI-{KEY}-…` (or `FEA-{KEY}-…`) — the prefix names the lib type                  |
| Treating a single-purpose `ui` lib as a grab-bag           | One product concern, one version folder for the lib → it **is** a functionality  |
| Expecting e2e for a grab-bag item                          | Never — it has no PRD and therefore no ACs to drive                              |
