### 🖼️ 'ui' Library Specification

#### Lib Name

`shared-ui-ng-x-wallet`

#### Exported Components

**Single-view** functionality (one balance-card view), so one component is exposed; its `dataType` is fixed at `'one'`.

##### Component: `V1XWalletCardComponent`

```ts
@Component(...)
export class V1XWalletCardComponent extends V1BaseUiComponent implements V1BaseUi_HasIt {}
```

###### Responsibility

Renders the balance amount, a status badge, and refresh/top-up actions for one account. Handles `loading` / `data`.

###### Inputs

Common: `state`, `dataType` (default `'one'`).

- `data: InputSignal<V1XWallet_MapBalance>` — _(JSDoc)_ Required. The balance to render.
- `badgeState: InputSignal<'processing' | 'updated' | 'hidden'>` — _(JSDoc)_ Optional. Controls the status badge. Default `'hidden'`.
- `refreshState: InputSignal<'idle' | 'loading' | 'disabled'>` — _(JSDoc)_ Optional. Controls the refresh button. Default `'idle'`.
- `showThrottlePopup: ModelSignal<boolean>` — _(JSDoc)_ Two-way; opens the refresh-throttle popup; reset to `false` on close.
- `icoWallet: InputSignal<string>` — _(JSDoc)_ Optional. Wallet icon path. Default `'./assets/images/libs/shared/x-wallet_ico-wallet.svg'` (overridden by the `feature` from DEP config).

###### Outputs

- `clickedRefresh: OutputEmitterRef<void>` — _(JSDoc)_ Emitted from `onClickedRefresh()`.
- `clickedTopUp: OutputEmitterRef<void>` — _(JSDoc)_ Emitted from `onClickedTopUp()`.

###### Rendering Rules

- `state = data`: `[data-cy="x-wallet-card-v1_card_data"]` with:
  - `span[data-cy="x-wallet-card-v1_card_data-amount"]` — the formatted amount.
  - `div[data-cy="x-wallet-card-v1_card_data-badge"]` — per `badgeState` (`'processing'` → "requesting" via `x_wallet.badge_requesting`; `'updated'` → via `x_wallet.badge_updated`).
  - `button[data-cy="x-wallet-card-v1_card_data-btn-refresh"]` — per `refreshState`; label via `x_wallet.refresh_btn`.
  - `button[data-cy="x-wallet-card-v1_card_data-btn-topup"]` — label via `x_wallet.topup_btn`.

###### DEP Styles (CSS variables)

```scss
.e-x-wallet-card {
  --e-x-wallet-card--amount-color: var(--e-night-color);
  --e-x-wallet-card--badge-color: var(--e-accent-color);
}
```

###### Functional Requirements & Business Rule Breakdown

- **XWALLET_CARD_FR-01** _(maps to PRD XWALLET-AC-02)_: Test badge + refresh visuals.
  - **XWALLET_CARD_BR-01** _(maps to PRD XWALLET-AC-02)_: Given `badgeState = 'processing'` _(Arrange)_; When `state = data` _(Act)_; Then `[data-cy="x-wallet-card-v1_card_data-badge"]` shows the "requesting" badge (`x_wallet.badge_requesting`) _(Assert)_.
  - **XWALLET_CARD_BR-02**: Given `refreshState = 'loading'` _(Arrange)_; Then the refresh button is disabled with the animating icon class _(Assert)_.
- **XWALLET_CARD_FR-02** _(maps to PRD XWALLET-AC-03)_: Test output emits.
  - **XWALLET_CARD_BR-03** _(maps to PRD XWALLET-AC-03)_: Given `refreshState = 'idle'` _(Arrange)_; When `button[data-cy="x-wallet-card-v1_card_data-btn-refresh"]` is clicked _(Act)_; Then `clickedRefresh` is emitted (via `onClickedRefresh()`) _(Assert)_.

###### Error Handling & Edge Cases

- `data.status = 'processing'` with no amount yet → amount shows the last known value; badge shows "requesting".
