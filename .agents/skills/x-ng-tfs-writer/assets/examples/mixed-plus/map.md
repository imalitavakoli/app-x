### 🗺️ 'map' Library Specification

#### Lib Name

`shared-map-ng-x-wallet`

#### Class & Methods

`V1XWallet extends V1BaseMap`:

- `getAccounts(url, userId, lib): Observable<V1XWallet_MapAccount[]>` — `GET {url}/users/{userId}/wallet/accounts`.
- `getBalance(url, accountId, triggeredBy, lib): Observable<V1XWallet_MapBalance>` — `GET {url}/wallet/accounts/{accountId}/balance?triggered_by={triggeredBy}`.
- `patchAccountLabel(url, accountId, label, lib): Observable<V1XWallet_MapAccount>` — `PATCH {url}/wallet/accounts/{accountId}` with body `{ label }`; renames the account and returns it.

#### Interfaces

- `V1XWallet_ApiAccount` / `V1XWallet_MapAccount` — exact server shape vs `{ id, label }`.
- `V1XWallet_ApiBalance` / `V1XWallet_MapBalance` — server shape vs `{ amount, currency, status, lastRequestDate }`; `status: 'up-to-date' | 'processing'` (parsed here from the server's raw status field so the `ui` receives a clean enum).

#### Functional Requirements & Business Rule Breakdown

`describe`↔FR, `it`↔BR.

- **XWALLET_MAP_FR-01** _(maps to PRD XWALLET-AC-01)_: Test mapping.
  - **XWALLET_MAP_BR-01**: Given a balance response whose raw status is "processing" _(Arrange)_; When `getBalance` completes _(Act)_; Then it maps to `{ status: 'processing', … }` _(Assert)_.

#### Error Handling & Edge Cases

- HTTP `0` → normalised `'BLOCKED'`; HTTP `404` on balance → `'NOT_FOUND'` (transient, pre-provisioning).
