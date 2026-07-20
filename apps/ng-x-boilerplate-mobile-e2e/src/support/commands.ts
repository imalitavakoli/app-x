// ***********************************************
// Custom Cypress commands. Registered globally via `support/e2e.ts`.
// Docs: https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    /**
     * Interface for the parent command: Authentication
     * It is setup based on: `shared-page-ng-auth` lib (v2) → `MethodMagicComponent` component.
     */
    login(email: string): Chainable<void>;
  }
}

/**
 * This is a parent command: Authentication
 * Flow is setup based on: `shared-page-ng-auth` lib (v2) → `MethodMagicComponent` component.
 *
 * NOTE: Our app uses an email-only "magic link" flow (no password). success
 * just persists a token in `localStorage['eAuth_token']`, which the route
 * guard (`v1AuthActivateIfLoggedin`) reads on app init. So instead of
 * driving the login UI on every test, we seed that token directly.
 * `cy.session` caches it, so login runs once and is restored (fast) for
 * every following test.
 */
Cypress.Commands.add('login', (email: string) => {
  // `cy.session` caches everything set here (cookies + storage) under the key
  // `email`; on later tests it restores the snapshot instead of re-running.
  cy.session(email, () => {
    // Visit once to establish the app's origin, then write the token the app
    // expects. The mocked login always resolves to userId 123, so we mirror
    // that here. (`accessToken` just needs to be truthy for the guard.)
    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.setItem(
        'eAuth_token',
        JSON.stringify({ userId: 123, accessToken: 'test-access-token' }),
      );
    });
  });
});

// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
