# Example — e2e spec

A `feature` lib (`shared-feature-ng-x-profile-info`) composed on the **dashboard** page. The file lives at `apps/{app}-e2e/src/e2e/page/dashboard/x-profile-info.cy.ts` — **folder = composition context** (`page/dashboard/`), **file = the feature under test**. (`.cy.ts` is the current runner's extension — read your workspace's e2e setup for today's runner.)

Conventions shown: **no wrapping `describe`** (the file name names the feature); `describe` = a **US** (from `apps/{app}-e2e/user-stories.md`), `it` = an **AC** (from the PRD); `Given/When/Then` in the `it` title, **AAA** in the body; assert **only what the user observes** (DOM via `data-cy`) — never internal state; selectors + helpers come from the **Page Object**; login + stubs keep the test **hermetic** and **independent**.

```ts
import { dashboardPo } from '../../../support/page/dashboard.po';

// No wrapping describe — the file name already names the feature under test.

beforeEach(() => {
  // Independent & deterministic: cache login once (cy.session), restore per test.
  cy.login('ada@example.com');

  // Hermetic: stub ONLY the external boundary (a third-party API), never internal app code.
  cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users', {
    fixture: 'users.json', // shared test data lives in src/fixtures/
  }).as('getUsers');
});

/* //////////////////////////////////////////////////////////////////////// */
/* XPI-US-01: As a user, I can open a profile's full details from the dashboard */
/* //////////////////////////////////////////////////////////////////////// */

describe("XPI-US-01 | As a user, I can open a profile's full details from the dashboard", () => {
  it('XPI-AC-01 | Given the profile-info card is shown, When "Read more" is clicked, Then the dashboard opens the details', () => {
    // Arrange
    dashboardPo.visit();
    dashboardPo.profileInfoCard().should('be.visible'); // retry until visible — no fixed wait

    // Act
    dashboardPo.readMoreBtn().click();

    // Assert — a user-observable outcome, via the page's data-cy anchor (not component state)
    dashboardPo.detailsView().should('be.visible');
  });
});

/* //////////////////////////////////////////////////////////////////////// */
/* XPI-US-02: As the product, the profile-info widget appears only when enabled */
/* //////////////////////////////////////////////////////////////////////// */

describe('XPI-US-02 | As the product, the profile-info widget appears only when enabled in config', () => {
  beforeEach(() => {
    // Per-US arrange: stub the external config asset to disable the widget.
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

  it('XPI-AC-02 | Given the widget is disabled in config, Then the profile-info card is not shown', () => {
    // Arrange
    dashboardPo.visit();
    dashboardPo.widgetsReady().should('be.visible'); // page-owned readiness anchor: the grid rendered

    // Assert — absence is trustworthy only after the page reports ready
    dashboardPo.profileInfoCard().should('not.exist');
  });
});
```
