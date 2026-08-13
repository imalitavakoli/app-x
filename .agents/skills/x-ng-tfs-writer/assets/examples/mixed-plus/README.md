<!-- Example TFS folder for a MIXED+ functionality with the full optional set (map + data-access + ui + feature + page). mixed+ requires page + data-access; map/ui/feature are optional. A plain mixed requires data-access + feature and omits page-v1.md. Mirrors docs/x/ng-x-wallet/TFS/. -->

# TFS — ng-x-wallet

- **Last Updated**: 2026-07-26
- **Owner**: Ali

## ℹ️ Overview

### Functionality Name

`ng-x-wallet`

### Functionality Classification

**mixed+** — uses `map` + `data-access` + `ui` + `feature` + `page` libs.

### Domain

`shared` — usable by any app; its libs live under `libs/shared/…`.

### Rationale

x-wallet fetches its own data (accounts, then the selected account's balance), presents an interactive balance card, refreshes the balance live, polls while the balance is processing, and is itself an app page with an order-of-one child route — so it needs all five lib types.

**Live lib versions.** Four libs are at v1 (`map-v1.md`, `ui-v1.md`, `feature-v1.md`, `page-v1.md`); the `data-access` lib is at **v2** only (`data-access-v2.md`) — its v1 was retired in an earlier cycle once every consumer had migrated, so no `data-access-v1.md` exists. Versions are per **lib**, not per functionality, which is why one functionality's files can sit at different versions. That retirement is recorded in this functionality's `DECISIONS.md` → Retired lib versions (this example folder does not reproduce that file — see the `visual` example for its shape).

### Non-Goals & Why

- **Rejected — polling inside the dependency chain.** It would re-run the whole chain on every tick; the poll lives in its own `_util` service, started once all data is ready.
- **Rejected — `entity` state structure.** The balance write sends an `extra` payload beyond the entity, so it is not pure CRUD; `multi-instance` is used instead.
- **Not promoted to `shared` yet.** The libs stay app-scoped until a second app needs them — promoting early would fix a public contract before there is a second consumer to shape it.

## 🔗 Existing Dependencies & Reuse

> Only libs that do NOT belong to this functionality (its own `map`/`data-access`/`ui`/`feature`/`page` libs are specified below, not listed here).

### Used map / data-access libs

_NONE_ — x-wallet's own `map`/`data-access` do not depend on other functionalities' `map`/`data-access` libs. (Base URL / user id are provided by the base `feature` class, not fetched here.)

### Used ui / feature / page libs

- `shared-ui-ng-popup`: refresh-throttle and polling-timeout popups.

### Used util libs

- `shared-util-ng-bases` → `V1BaseUiComponent`, `V1BaseMap`, `V1BaseFacade`, `V1BaseEffects`.
- `shared-util-ng-bases-consumer` → `V2BaseFeatureExtComponent`, `V2BasePageParentComponent`, `V2BasePageChildComponent`.
- `shared-util-ng-capacitor` → `V1CapacitorCoreService` (`onPause`/`onResume`, for the poll & sync services).
- **`[TO-CREATE]`** `shared-util-ng-money` → `formatAmount(minorUnits, currency)`, for the balance and transaction amounts. Does not exist yet. A `util` never gets `docs/x/` — its requirements live in its own `requirements.md`, and creating it is a companion task in the plan. **Blocks:** `XWALLET-AC-01`.

## 🧭 ID Index

> Every FR/BR in this TFS, the file it lives in, and the PRD AC it maps to. Keeps IDs unique across all files.

| ID                      | Lib file            | Maps to PRD AC               |
| ----------------------- | ------------------- | ---------------------------- |
| XWALLET_MAPV1_FR-01     | `map-v1.md`         | XWALLET-AC-01                |
| XWALLET_MAPV1_BR-01     | `map-v1.md`         | XWALLET-AC-01                |
| XWALLET_DAV2_FR-01      | `data-access-v2.md` | XWALLET-AC-01, XWALLET-AC-05 |
| XWALLET_DAV2_BR-01      | `data-access-v2.md` | XWALLET-AC-05                |
| XWALLET_DAV2_FR-02      | `data-access-v2.md` | _(new — suggest a PRD AC)_   |
| XWALLET_DAV2_BR-02      | `data-access-v2.md` | _(new — suggest a PRD AC)_   |
| XWALLET_CARDV1_FR-01    | `ui-v1.md`          | XWALLET-AC-02                |
| XWALLET_CARDV1_BR-01    | `ui-v1.md`          | XWALLET-AC-02                |
| XWALLET_CARDV1_BR-02    | `ui-v1.md`          | —                            |
| XWALLET_CARDV1_FR-02    | `ui-v1.md`          | XWALLET-AC-03                |
| XWALLET_CARDV1_BR-03    | `ui-v1.md`          | XWALLET-AC-03                |
| XWALLET_CARDFEAV1_FR-01 | `feature-v1.md`     | XWALLET-AC-01                |
| XWALLET_CARDFEAV1_BR-01 | `feature-v1.md`     | XWALLET-AC-01                |
| XWALLET_CARDFEAV1_BR-02 | `feature-v1.md`     | XWALLET-AC-03                |
| XWALLET_POLLV1_FR-01    | `feature-v1.md`     | XWALLET-AC-04                |
| XWALLET_POLLV1_BR-01    | `feature-v1.md`     | XWALLET-AC-04                |
| XWALLET_POLLV1_BR-02    | `feature-v1.md`     | —                            |
| XWALLET_SYNCV1_FR-01    | `feature-v1.md`     | XWALLET-AC-06                |
| XWALLET_SYNCV1_BR-01    | `feature-v1.md`     | XWALLET-AC-06                |
| XWALLET_PAGEV1_FR-01    | `page-v1.md`        | XWALLET-AC-07                |
| XWALLET_PAGEV1_BR-01    | `page-v1.md`        | XWALLET-AC-07                |

## ❓ Open Technical Questions

- Confirm the refresh throttle window and the polling timeout.
- Confirm whether multiple accounts render multiple cards on the parent page (multi-instance) or only the first.
