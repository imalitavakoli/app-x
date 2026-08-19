### 📄 'page' Library Specification

- **Last Updated** (YYYY-MM-DD): 2026-07-26
- **Last Verified** (YYYY-MM-DD): 2026-07-26

#### Lib Name

`shared-page-ng-x-wallet`

#### Routes

`lib.routes.ts`: parent `''` → `V1XWalletPageComponent`, child `:id` → `V1XWalletOnePageComponent` (the child is an "One" page — it shows one account's detail).

#### Parent Page: `V1XWalletPageComponent`

```ts
@Component(...)
export class V1XWalletPageComponent extends V2BasePageParentComponent {}
```

- Required URL query params: none (loads for the logged-in user). Starter lib: `V1XWalletCardFeaComponent` (`_xHasInitStarterLibs` / `onReadyStarterLib1`); the child `router-outlet` renders only after it's ready. Navigation: on the feature's `clickedTopUp`, navigates to the top-up route. Errors aggregated via `$errors` / `xOnError`.

#### Child Page: `V1XWalletOnePageComponent`

```ts
@Component(...)
export class V1XWalletOnePageComponent extends V2BasePageChildComponent {}
```

- `_pageName = 'Wallet'`, `_urlRoot = '/x-wallet'`, `$id` from the `:id` route param (the account). Composes `V1XWalletCardFeaComponent` for the single account identified by `$id`; `xOnError` forwards to the parent.

#### Functional Requirements & Business Rule Breakdown

- **XWALLET_PAGEV1_FR-01** _(maps to PRD XWALLET-AC-07)_: Test navigation.
  - **XWALLET_PAGEV1_BR-01** _(maps to PRD XWALLET-AC-07)_: Given the card feature emits `clickedTopUp(accountId)` _(Arrange)_; When the parent handles it _(Act)_; Then it navigates to the top-up route for that account _(Assert)_.
