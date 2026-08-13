# Product app — `requirements/` + unit IDs

Read this when writing or updating **unit** tests for a product **`app`** under `apps/{app-name}/` (not `{app}-e2e`).

## Where

Beside the app README:

`apps/{app-name}/requirements/` — a **folder**: `README.md` (live) + `DECISIONS.md` (burned IDs)

Example: `apps/ng-boilerplate/requirements/README.md`.

## Lifecycle

- Created/updated by the **unit-test work**, not by a separate writer skill.
- If missing when you write the first ID-tagged app unit test → **create** the folder and its `README.md`. A product app is unversioned, so there is no predecessor `DECISIONS.md` to carry forward.
- If it exists → **update** it: preserve existing IDs and never renumber. Adding is not the only outcome — an entry can also be **amended** (rewritten under its existing ID) or **retired** (moved to `DECISIONS.md`, number burned). The four outcomes and the reporting rule are in the parent skill.
- Do **not** create `docs/x/…` PRD/TFS for an app.
- Do **not** put this file in `{app}-e2e` — e2e apps use a `user-stories/` folder instead.

## IDs

- Pattern: `APP-{KEY}-FR-##` / `APP-{KEY}-BR-##`
- `{KEY}`: basename of `{app-name}` → uppercase → `-` to `_`
  - `ng-boilerplate` → `NG_BOILERPLATE` → `APP-NG_BOILERPLATE-FR-01`
- Same `{KEY}` for every ID in that file.
- No ACs in this file.

## Spec mapping

- `describe` ↔ FR from this registry’s `README.md`
- `it` ↔ BR from this registry’s `README.md`
- AAA / preset / observable-effect rules: same as the parent skill.

## Doc shape

Same structure as the example folder [../../assets/examples/requirements/](../../assets/examples/requirements/), but every ID uses the `APP-` prefix (not `UTIL-`).

## Common mistakes

| Mistake                                      | Fix                                                       |
| -------------------------------------------- | --------------------------------------------------------- |
| Using `user-stories/` for app unit tests     | That registry is e2e-only; unit tests use `requirements/` |
| Putting requirements under `apps/{app}-e2e/` | Wrong project — use `apps/{app-name}/requirements/`       |
| `UTIL-` prefix on an app                     | Use `APP-{KEY}-…`                                         |
| Creating `docs/x/` for an app                | Never — app is not a functionality                        |
