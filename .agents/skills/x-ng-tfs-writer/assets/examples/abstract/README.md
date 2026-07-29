<!-- Example TFS folder for an ABSTRACT functionality (map + data-access). Mirrors docs/x/ng-user-geo/TFS/. -->

# TFS — ng-user-geo

- **Last Updated**: 2026-07-26
- **Owner**: Ali

## ℹ️ Overview

### Functionality Name

`ng-user-geo`

### Functionality Classification

**Abstract** — uses `map` + `data-access` libs only.

### Domain

`shared` — any app can resolve the user's geo context, so its libs live under `libs/shared/…`.

### Rationale

user-geo only resolves the user's geographic context from the server and exposes it to other functionalities; it has no UI. So it needs a `map` lib (to fetch/normalise) and its sister `data-access` lib (to store + expose), and nothing else.

## 🔗 Existing Dependencies & Reuse

### Used map / data-access libs

_NONE._ This functionality's own `map`/`data-access` libs do not depend on any other functionality's `map`/`data-access` libs. (The base URL and user id it needs are passed in by the calling page/feature — user-geo does not fetch them itself.)

### Used ui / feature / page libs

_NONE_ (abstract — no visual libs).

### Used util libs

- `shared-util-ng-bases` → `V1BaseMap`, `V1BaseFacade`, `V1BaseEffects`: base classes for the map/data-access.
- `shared-util-ng-bases-model`: cache-aware base state interfaces.

## 🧭 ID Index

> Every FR/BR in this TFS, the file it lives in, and the PRD AC it maps to. Keeps IDs unique across all files.

| ID            | Lib file         | Maps to PRD AC                             |
| ------------- | ---------------- | ------------------------------------------ |
| GEO_MAP_FR-01 | `map.md`         | GEO-AC-01                                  |
| GEO_MAP_BR-01 | `map.md`         | GEO-AC-01                                  |
| GEO_DA_FR-01  | `data-access.md` | GEO-AC-01, GEO-AC-02, GEO-AC-03, GEO-AC-04 |
| GEO_DA_BR-01  | `data-access.md` | GEO-AC-02                                  |
| GEO_DA_BR-02  | `data-access.md` | GEO-AC-01                                  |
| GEO_DA_BR-03  | `data-access.md` | GEO-AC-03                                  |
| GEO_DA_BR-04  | `data-access.md` | GEO-AC-04                                  |
| GEO_DA_FR-02  | `data-access.md` | _(new — suggest a PRD AC)_                 |
| GEO_DA_BR-05  | `data-access.md` | _(new — suggest a PRD AC)_                 |

## ❓ Open Technical Questions

- Should `currency` fall back to a workspace default when the server omits it?
- Confirm the `geo` cache TTL.
