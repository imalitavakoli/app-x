# Example — Page Object

One Page Object per `page` / `feature` lib under test, at `apps/{app}-e2e/src/support/page/{page}.po.ts`. It keeps that lib's **`data-cy` selectors + small helpers in one place**, so specs read like a story and a selector change is fixed once. Includes a **page-owned readiness anchor** so a feature spec can wait on "the page is ready" without coupling to sibling widgets.

```ts
/* /////////////////////////////////////////////////////////////////////////
 * Page Object (PO) for the Dashboard page.
 * Selectors live here, not in specs. Select by `data-cy` (added in the libs'
 * templates), NOT by CSS class or text — data-cy is a stable, intentional
 * test API; classes/text change often.
 * ////////////////////////////////////////////////////////////////////////// */

export const dashboardPo = {
  // Open the page. Register intercepts BEFORE boot in the spec, not here.
  visit: () => cy.visit('/dashboard'),

  // The whole X Profile Info card (from the `ui` lib's template).
  profileInfoCard: () =>
    cy.get('[data-cy="x-profile-info-v1_profile-info_data"]'),

  // The button the user clicks — starts the ui → feature → page chain.
  readMoreBtn: () =>
    cy.get('[data-cy="x-profile-info-v1_profile-info_data-btn-read-more"]'),

  detailsView: () => cy.get('[data-cy="dashboard-v1_profile-details"]'),

  // PAGE-OWNED readiness anchor: the widget grid renders only once the page's
  // "ready" gate fires. Belongs to the page (not any feature), so a feature
  // spec can wait on "page ready" — and absence checks become trustworthy.
  widgetsReady: () => cy.get('[data-cy="dashboard-v1_widgets"]'),
};
```
