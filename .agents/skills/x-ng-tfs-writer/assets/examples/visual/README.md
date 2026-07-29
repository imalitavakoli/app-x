<!-- Example TFS folder for a VISUAL functionality (ui + feature). Mirrors docs/x/ng-x-profile/TFS/. A visual+ functionality would add page.md — see the mixed-plus example. -->

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
