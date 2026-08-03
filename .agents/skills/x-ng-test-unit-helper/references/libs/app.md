# Product app — `requirements.md` + unit IDs

Read this when writing or updating **unit** tests for a product **`app`** under `apps/{app-name}/` (not `{app}-e2e`).

## Where

Beside the app README:

`apps/{app-name}/requirements.md`

Example: `apps/ng-boilerplate/requirements.md`.

## Lifecycle

- Created/updated by the **unit-test work**, not by a separate writer skill.
- If missing when you write the first ID-tagged app unit test → **create** it.
- If it exists → **update** it: preserve existing IDs; never renumber; only add.
- Do **not** create `docs/x/…` PRD/TFS for an app.
- Do **not** put this file in `{app}-e2e` — e2e apps use `user-stories.md` instead.

## IDs

- Pattern: `APP-{KEY}-FR-##` / `APP-{KEY}-BR-##`
- `{KEY}`: basename of `{app-name}` → uppercase → `-` to `_`
  - `ng-boilerplate` → `NG_BOILERPLATE` → `APP-NG_BOILERPLATE-FR-01`
- Same `{KEY}` for every ID in that file.
- No ACs in this file.

## Spec mapping

- `describe` ↔ FR from this `requirements.md`
- `it` ↔ BR from this `requirements.md`
- AAA / preset / observable-effect rules: same as the parent skill.

## Doc shape

Same structure as [../../assets/examples/requirements.md](../../assets/examples/requirements.md), but every ID uses the `APP-` prefix (not `UTIL-`).

## Common mistakes

| Mistake | Fix |
| --- | --- |
| Using `user-stories.md` for app unit tests | That file is e2e-only; unit tests use `requirements.md` |
| Putting requirements under `apps/{app}-e2e/` | Wrong project — use `apps/{app-name}/requirements.md` |
| `UTIL-` prefix on an app | Use `APP-{KEY}-…` |
| Creating `docs/x/` for an app | Never — app is not a functionality |
