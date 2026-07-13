// ***********************************************
// Custom Cypress commands. Registered globally via `support/e2e.ts`.
// Docs: https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    /**
     * Log in as the given email. Our app uses an email-only "magic link" flow
     * (no password), and the whole flow is mocked in code — success just
     * persists a token in `localStorage['eAuth_token']`, which the route guard
     * (`v1AuthActivateIfLoggedin`) reads on app init.
     *
     * So instead of driving the login UI on every test, we seed that token
     * directly. `cy.session` caches it, so login runs once and is restored
     * (fast) for every following test.
     */
    login(email: string): Chainable<void>;
  }
}

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
