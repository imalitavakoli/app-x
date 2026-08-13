<!-- Example TFS folder for a VISUAL functionality with ui + feature (either alone is also valid visual). Mirrors docs/x/ng-x-profile/TFS/. A visual+ owns a page — add page.md (see mixed-plus example for page.md shape). -->

# TFS — ng-x-profile

- **Last Updated**: 2026-08-13
- **Owner**: Ali

## ℹ️ Overview

### Functionality Name

`ng-x-profile`

### Functionality Classification

**Visual** — uses `ui` + `feature` libs only.

### Domain

`shared` — usable by any app; its libs live under `libs/shared/…`.

### Rationale

x-profile presents the user's profile in two forms — a compact card and an expanded detail. It has no `map`/`data-access` of its own: it reuses the shared `ng-user` **abstract** functionality's `data-access` lib for the data. So it needs `ui` + `feature` only.

### Non-Goals & Why

- **No `map` / `data-access` libs.** The shared `ng-user` abstract functionality already exposes this data; our own would duplicate its fetch and its cache.
- **Rejected — one exported component with a `dataType` switch.** The compact card and the expanded detail differ in data and lifecycle, so two exported components keep each independently testable.
- **Rejected — a `page` lib.** Nothing routes to this functionality directly; it is always composed by a host page, so a page lib would add a route no one navigates to.

## 🔗 Existing Dependencies & Reuse

### Used map / data-access libs

- `shared-data-access-ng-user` → `V1UserFacade` → `getUser` method; `userData$`, `userLoaded$`, `userError$` observables: the user data this functionality fetches (via that shared facade) and presents.
- `shared-data-access-ng-config` → `V2ConfigFacade`: DEP config/assets (via `V2BaseFeatureExtComponent`).

### Used ui / feature / page libs

- **`[TO-UPDATE]`** `shared-ui-ng-popup` — the detail's "expand" popup.
  - **Surface it must gain for us:** a `size` input (`'sm' | 'lg'`), so the expanded detail can open at the large size.
  - **Owner:** `ng-popup` (a separate visual functionality). Its requirements live in its own PRD & TFS; a companion task in the plan. No FR/BR here describes the popup's own behaviour or the surface it must gain — our only entry is the boundary BR `XPROFILE_DETAILV1_BR-05`, which asserts what we pass it.
  - **Blocks:** `XPROFILE-AC-05`.

### Used util libs

- `shared-util-ng-bases` → `V1BaseUiComponent`; `shared-util-ng-bases-consumer` → `V2BaseFeatureExtComponent`.

## 🧭 ID Index

> Every FR/BR in this TFS, the file it lives in, and the PRD AC it maps to. Keeps IDs unique across all files.

| ID                         | Lib file     | Maps to PRD AC |
| -------------------------- | ------------ | -------------- |
| XPROFILE_CARDV1_FR-01      | `ui.md`      | XPROFILE-AC-01 |
| XPROFILE_CARDV1_BR-01      | `ui.md`      | —              |
| XPROFILE_CARDV1_BR-02      | `ui.md`      | XPROFILE-AC-01 |
| XPROFILE_CARDV1_BR-03      | `ui.md`      | —              |
| XPROFILE_CARDV1_BR-04      | `ui.md`      | —              |
| XPROFILE_CARDV1_BR-08      | `ui.md`      | XPROFILE-AC-07 |
| XPROFILE_CARDV1_FR-02      | `ui.md`      | XPROFILE-AC-05 |
| XPROFILE_CARDV1_BR-05      | `ui.md`      | XPROFILE-AC-05 |
| XPROFILE_DETAILV1_FR-01    | `ui.md`      | XPROFILE-AC-03 |
| XPROFILE_DETAILV1_BR-01    | `ui.md`      | XPROFILE-AC-03 |
| XPROFILE_DETAILV1_BR-02    | `ui.md`      | —              |
| XPROFILE_DETAILV1_BR-05    | `ui.md`      | XPROFILE-AC-05 |
| XPROFILE_DETAILV1_FR-02    | `ui.md`      | XPROFILE-AC-06 |
| XPROFILE_DETAILV1_BR-03    | `ui.md`      | XPROFILE-AC-06 |
| XPROFILE_CARDFEAV1_FR-01   | `feature.md` | XPROFILE-AC-01 |
| XPROFILE_CARDFEAV1_BR-01   | `feature.md` | XPROFILE-AC-01 |
| XPROFILE_CARDFEAV1_BR-02   | `feature.md` | XPROFILE-AC-01 |
| XPROFILE_CARDFEAV1_BR-03   | `feature.md` | XPROFILE-AC-05 |
| XPROFILE_DETAILFEAV1_FR-01 | `feature.md` | XPROFILE-AC-03 |
| XPROFILE_DETAILFEAV1_BR-01 | `feature.md` | XPROFILE-AC-03 |

## ❓ Open Technical Questions

- Should the card and detail share one `feature` with a `dataType` switch instead of two? (Current choice: two components, matching the two views.)
