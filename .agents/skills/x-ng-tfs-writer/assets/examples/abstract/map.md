### 🗺️ 'map' Library Specification

#### Lib Name

`shared-map-ng-user-geo`

#### Class & Methods

`V1UserGeo extends V1BaseMap`:

- `getGeo(url: string, userId: number, lib = 'any'): Observable<V1UserGeo_MapGeo>` — `GET {url}/users/{userId}/geo` (authenticated via the shared auth interceptor). Maps the API response to `V1UserGeo_MapGeo`.
- `patchCurrency(url: string, userId: number, currency: string, lib = 'any'): Observable<V1UserGeo_MapGeo>` — `PATCH {url}/users/{userId}/geo` with body `{ currency }`; lets the user override the detected currency and returns the updated geo.

#### Interfaces

- `V1UserGeo_ApiGeo` — the exact server schema, e.g. `{ country_code: string; currency_code: string; detected_at: string }`.
- `V1UserGeo_MapGeo` — reshaped for easy consumption: `{ country: string; currency: string }` (camelCase, and `detected_at` dropped because no consumer needs it — parsing done here, not in a consumer).

#### Functional Requirements & Business Rule Breakdown

`describe`↔FR, `it`↔BR.

- **GEO_MAP_FR-01** _(maps to PRD GEO-AC-01)_: Test mapping.
  - **GEO_MAP_BR-01**: Given a `200` response `{ country_code: 'SE', currency_code: 'SEK', detected_at: '…' }` _(Arrange)_; When `getGeo` completes _(Act)_; Then it emits `{ country: 'SE', currency: 'SEK' }` (no `detected_at`) _(Assert)_.

#### Error Handling & Edge Cases

- Any non-2xx / network error is re-thrown as a normalised error string for the effect's `catchError`.
