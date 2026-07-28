---
name: x-ng-lib-build-helper
description: "WHAT? Supplies the canonical structure and guidelines for building or updating a functionality's Nx + Angular libraries (map, data-access, ui, feature, page) — the reference examples an agent imitates instead of copying an arbitrary existing lib. WHEN? Before planning or building any workspace library; when scaffolding or updating a map / data-access / ui / feature / page lib, or deciding a lib's folder/file structure, base class, versioning, README files, or data-cy naming."
metadata:
  version: '1.0.0'
---

# Lib Build Helper

## Overview

This skill is a **reference**: it puts the workspace's canonical library examples into your context so you build every lib to match them. It does **not** build anything itself — whoever is doing the work (an implementation plan, or you working directly) does the scaffolding and coding, using these examples as the pattern.

**The examples in `assets/examples/` are the source of truth.** Build every lib to match the example for its type — do **not** imitate an arbitrary existing lib in the workspace, whose structure may be old or inconsistent.

## When to use

Building or updating a functionality's `map`, `data-access`, `ui`, `feature`, or `page` lib — or deciding its structure, base class, versioning, READMEs, or `data-cy` naming. Not for non-lib code.

## Pick the matching example

| Lib type      | Example                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------- |
| `map`         | `assets/examples/map.md`                                                                          |
| `data-access` | `assets/examples/data-access-{single-instance,multi-instance,entity}.md` (by variant — see below) |
| `ui`          | `assets/examples/ui.md`                                                                           |
| `feature`     | `assets/examples/feature.md`                                                                      |
| `page`        | `assets/examples/page.md`                                                                         |

Read the one matching example and reproduce what it demonstrates:

- **Directory & files** — `src/lib/{version}/`, `index.ts`, `test-setup.ts`, the config files (`project.json`, `.eslintrc.json`, `jest.config.ts`, `tsconfig*.json`), and the outer `README.md`. Scaffold the config files with the Nx generator; shape the content to the example.
- **Base class** — `ui` → `V1BaseUiComponent`; `feature` → `V2BaseFeatureExtComponent`; `map` → `V1BaseMap`; `data-access` → facade / effects / reducer built on the `v1Base…` helpers; `page` parent → `V2BasePageParentComponent`, `page` child → `V2BasePageChildComponent`. (The `page` example shows specialized `…Ext{Name}` bases — use those **only** when the TFS names one.)
- **Versioned naming** — `v{n}/` folders, `V{n}` class prefixes, `-v{n}` selectors (e.g. `x-balance-card-fea-v1`).
- **Both READMEs** — outer (high-level: what the lib is + the `nx test …` line) **and** inner (per component/version: a **ready-to-use copy-paste** example for the Boilerplate Test page; for `page` libs, an `app.routes.ts` snippet).
- **`data-cy` naming** — `{lib}-v1_{component}_{part}` (these live in `ui` libs).

## Fallback — only when the example doesn't cover it

If a lib type, variant, or a specific file isn't in the examples (e.g. an `api` / `util` lib, or a file a `feature` needs that its example doesn't show), **ask the user which existing workspace lib to imitate**, then read that lib. Rule: examples first; a real workspace lib only when the example doesn't cover it, and only the one the user names.

## `data-access` variant

Use the object structure the TFS specifies (it usually already chose):

- **entity** — only for a **pure** CRUD resource.
- **single-instance** — the lib is initialized once per page.
- **multi-instance** — the lib is initialized several times (by the page, or by multiple `feature` libs).

If a write must send an `extra` payload beyond the entity, it is **not** pure CRUD → use single- or multi-instance, not entity.

## Updating an existing lib

Keep the existing folder/version structure and public exports intact; for a breaking change add a new `v{n}/` rather than mutating a shipped version. Follow the same conventions as a new lib.

## Further reading

Lib types & import boundaries: `docs/getting-started/library-types-and-their-relationship.md`. Naming & file structure: `docs/guidelines/naming-conventions.md` and `docs/guidelines/best-practices.md` (Organizing).

## Common mistakes

| Mistake                                        | Fix                                                                                                                                                                                                                                                      |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Copying an arbitrary existing lib              | Use the `assets/examples/` example for that type — it is the source of truth.                                                                                                                                                                            |
| Inventing a base class                         | Extend the right base: `ui` → `V1BaseUiComponent`; `feature` → `V2BaseFeatureExtComponent`; `page` parent → `V2BasePageParentComponent`, child → `V2BasePageChildComponent` (a specialized `…Ext{Name}` only if the TFS names one); `map` → `V1BaseMap`. |
| Only an outer README                           | Add the inner, copy-paste-ready README too.                                                                                                                                                                                                              |
| `entity` data-access for a non-pure-CRUD write | Use single- or multi-instance.                                                                                                                                                                                                                           |
| Treating this skill as a builder               | It only supplies references; the builder (an implementation plan, or you) does the actual building.                                                                                                                                                      |
