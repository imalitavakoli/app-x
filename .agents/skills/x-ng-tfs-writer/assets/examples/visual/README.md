<!-- Example TFS folder for a VISUAL functionality with ui + feature (either alone is also valid visual). Mirrors docs/x/ng-x-profile/TFS/. A visual+ owns a page — add page.md (see mixed-plus example for page.md shape). -->

# TFS — ng-x-profile

- **Last Updated**: 2026-07-26
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

- `shared-ui-ng-popup`: the detail's "expand" popup.

### Used util libs

- `shared-util-ng-bases` → `V1BaseUiComponent`; `shared-util-ng-bases-consumer` → `V2BaseFeatureExtComponent`.

## 🧭 ID Index

> Every FR/BR in this TFS, the file it lives in, and the PRD AC it maps to. Keeps IDs unique across all files.

| ID                       | Lib file     | Maps to PRD AC |
| ------------------------ | ------------ | -------------- |
| XPROFILE_CARD_FR-01      | `ui.md`      | XPROFILE-AC-01 |
| XPROFILE_CARD_BR-01      | `ui.md`      | —              |
| XPROFILE_CARD_BR-02      | `ui.md`      | XPROFILE-AC-01 |
| XPROFILE_CARD_BR-03      | `ui.md`      | —              |
| XPROFILE_CARD_BR-04      | `ui.md`      | —              |
| XPROFILE_CARD_FR-02      | `ui.md`      | XPROFILE-AC-02 |
| XPROFILE_CARD_BR-05      | `ui.md`      | XPROFILE-AC-02 |
| XPROFILE_DETAIL_FR-01    | `ui.md`      | XPROFILE-AC-03 |
| XPROFILE_DETAIL_BR-01    | `ui.md`      | XPROFILE-AC-03 |
| XPROFILE_DETAIL_BR-02    | `ui.md`      | —              |
| XPROFILE_DETAIL_FR-02    | `ui.md`      | XPROFILE-AC-04 |
| XPROFILE_DETAIL_BR-03    | `ui.md`      | XPROFILE-AC-04 |
| XPROFILE_CARDFEA_FR-01   | `feature.md` | XPROFILE-AC-01 |
| XPROFILE_CARDFEA_BR-01   | `feature.md` | XPROFILE-AC-01 |
| XPROFILE_CARDFEA_BR-02   | `feature.md` | XPROFILE-AC-01 |
| XPROFILE_CARDFEA_BR-03   | `feature.md` | XPROFILE-AC-02 |
| XPROFILE_DETAILFEA_FR-01 | `feature.md` | XPROFILE-AC-03 |
| XPROFILE_DETAILFEA_BR-01 | `feature.md` | XPROFILE-AC-03 |

## ❓ Open Technical Questions

- Should the card and detail share one `feature` with a `dataType` switch instead of two? (Current choice: two components, matching the two views.)
