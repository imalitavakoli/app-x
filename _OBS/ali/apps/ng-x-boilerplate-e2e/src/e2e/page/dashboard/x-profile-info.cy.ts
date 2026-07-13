import { dashboardPo } from '../../../support/page/dashboard.po';

/* /////////////////////////////////////////////////////////////////////////
 * E2E — feature lib `shared-feature-ng-x-profile-info` (x-x-profile-info-fea-v1)
 * as composed on the DASHBOARD page (folder = the composition context).
 *
 * Naming convention:
 *   folder   → where it's composed        (page/dashboard/)
 *   file     → the feature lib under test (x-profile-info) — shown by the runner
 *   describe → a User Story (US), prefixed with its unique PRD US id
 *   it       → an Acceptance Criterion (AC) of that US, with its unique AC id.
 *             Given/When/Then in the title; AAA (Arrange/Act/Assert) in code.
 *
 * No wrapping describe: the file name already names the feature lib.
 *
 * WHY E2E (vs unit): we drive the REAL app in a REAL browser and prove libs
 * cooperate: [ui] shared-ui-ng-x-profile-info
 *            -> [feature] this lib
 *            -> [page] shared-page-ng-dashboard
 * We assert only what a user can observe, never internal component state.
 * ////////////////////////////////////////////////////////////////////////// */

// Root-level hook: runs before EVERY `it` in this file (all User Stories).
beforeEach(() => {
  // 1) LOG IN FIRST. The dashboard route is behind an auth guard, so in the
  //    real app the user authenticates before reaching it. See
  //    support/commands.ts — it seeds the token the guard reads (cy.session
  //    caches it across tests).
  cy.login('ada@example.com');

  // 2) Stub the ONE real network call the dashboard makes: the X Users list
  //    (hardcoded to jsonplaceholder in the map lib). We stub it NOT to assert
  //    on it, but to keep the test hermetic (no real internet / third-party)
  //    and deterministic. Profile-info & credit data are mocked in the app's
  //    own code → no stub needed for them.
  cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users', {
    fixture: 'users.json',
  }).as('getUsers');
});

/* ////////////////////////////////////////////////////////////////////////// */
/* XPI-US-01: As a user; test opening profile details                         */
/* ////////////////////////////////////////////////////////////////////////// */

describe("XPI-US-01 | As a user, I can open a profile's full details from the dashboard", () => {
  /* XPI-AC-01 ////////////////////////////////////////////////////////////// */

  it('XPI-AC-01 | Given the profile-info widget is enabled, when the user clicks "Read more", then the dashboard handler runs', () => {
    // ARRANGE: open the dashboard, then wait until the card is on screen and
    // ready to interact with. We don't need to know HOW it appears (users load
    // → feature ready → card renders); `should` retries until visible.
    dashboardPo.visit();
    dashboardPo.profileInfoCard().should('be.visible');

    // ACT: click the "Read more" button (which lives in the ui lib).
    dashboardPo.readMoreBtn().click();

    // ASSERT: the page lib's handler ran (today it logs; swap for a visible
    // outcome — navigation/popup — once the feature does something real).
    cy.get('@consoleLog').should(
      'have.been.calledWith',
      'onXProfileInfoClickedReadMore',
    );
  });
});

/* ////////////////////////////////////////////////////////////////////////// */
/* XPI-US-02: As the product; test profile-info widget visibility             */
/* ////////////////////////////////////////////////////////////////////////// */

describe('XPI-US-02 | As the product, the profile-info widget appears only when enabled in config', () => {
  // Per-US Arrange: disable the profile-info widget in config. We intercept the
  // DEP config asset and strip its entry, keeping everything else (the
  // profile-image widget stays, so the widget grid still renders).
  beforeEach(() => {
    cy.intercept({ method: 'GET', url: /DEP_config.*\.json/ }, (req) => {
      req.continue((res) => {
        const cfg =
          typeof res.body === 'string' ? JSON.parse(res.body) : res.body;
        cfg.ui.home_view = cfg.ui.home_view.filter(
          (w: Record<string, unknown>) => !('HOME_WIDGET_X_PROFILE_INFO' in w),
        );
        res.body = cfg;
      });
    }).as('config');
  });

  /* XPI-AC-02 ////////////////////////////////////////////////////////////// */

  it('XPI-AC-02 | Given the profile-info widget is disabled in config, then the profile-info card is not shown', () => {
    dashboardPo.visit();

    // ARRANGE (cont.): wait until the PAGE reports it's ready. The dashboard
    // renders its widget grid (data-cy="dashboard_widgets") only after its
    // readiness gate fires (users loaded → $isReadyStarterLib1() → grid shown).
    // This anchor belongs to the page — NOT to any other feature lib — so the
    // absence check below is trustworthy (the card would already be here if it
    // were going to render). E2e observes the DOM, never internal signals.
    dashboardPo.widgetsReady().should('be.visible');

    // ASSERT: with the widget disabled, the profile-info card was never rendered.
    dashboardPo.profileInfoCard().should('not.exist');
  });
});
