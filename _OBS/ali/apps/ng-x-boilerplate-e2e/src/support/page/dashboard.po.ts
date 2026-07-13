/* /////////////////////////////////////////////////////////////////////////
 * Page Object (PO) for the Dashboard page.
 *
 * Keeps selectors + small helpers in ONE place, so specs read like a story.
 * If a `data-cy` changes, you fix it here, not in every spec. Mirrors the spec
 * layout: specs in `e2e/page/dashboard/`, this PO in `support/page/`.
 * ////////////////////////////////////////////////////////////////////////// */

// Select by `data-cy` (added in the libs' templates), NOT by CSS class or text.
// Classes/text change often; `data-cy` is a stable, intentional test API.
export const dashboardPo = {
  /**
   * Open the dashboard. Kept here (not in beforeEach) so each test can register
   * its own intercepts BEFORE the page boots. `onBeforeLoad` runs before app
   * JS, so the console.log spy is in place from the very first line the app
   * executes and catches the page handler's call.
   */
  visit: () =>
    cy.visit('/dashboard', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'log').as('consoleLog');
      },
    }),

  // `ui` lib (shared-ui-ng-x-profile-info): the button the user clicks — this
  // starts the ui → feature → page chain we want to prove.
  readMoreBtn: () =>
    cy.get('[data-cy="x-profile-info-v1_profile-info_data-btn-read-more"]'),

  // The whole X Profile Info card.
  profileInfoCard: () =>
    cy.get('[data-cy="x-profile-info-v1_profile-info_data"]'),

  // PAGE-OWNED readiness anchor: the widget grid renders only once the page's
  // "ready" gate has fired. Belongs to the dashboard page (not any feature
  // lib), so a feature spec can wait on "the page is ready" without coupling to
  // a sibling widget. Used by absence tests to prove a card's absence is real.
  widgetsReady: () => cy.get('[data-cy="dashboard-v1_widgets"]'),
};
