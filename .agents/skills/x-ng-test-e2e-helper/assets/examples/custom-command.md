# Example — shared custom command

Reusable setup (like login) lives in `apps/{app}-e2e/src/support/commands.ts`, not copied into each spec. Document each command with the **"…is setup based on: `<lib>` (v#) → `<Component>`"** convention — on the type interface and on the implementation — plus a **NOTE** explaining any non-obvious flow, so a reader knows _why_ it looks the way it does.

```ts
declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Parent command: Authentication.
     * It is setup based on: `shared-page-ng-auth` lib (v2) → `MethodMagicComponent` component.
     */
    login(email: string): Chainable<void>;
  }
}

/**
 * Parent command: Authentication.
 * Flow is setup based on: `shared-page-ng-auth` lib (v2) → `MethodMagicComponent` component.
 *
 * NOTE: the app uses an email-only "magic link" flow (no password). Success just
 * persists a token in localStorage that the route guard reads on init — so instead
 * of driving the login UI every test, we seed that token directly. `cy.session`
 * caches it, so login runs once and is restored (fast) for every following test.
 */
Cypress.Commands.add('login', (email: string) => {
  cy.session(email, () => {
    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.setItem(
        'eAuth_token',
        JSON.stringify({ userId: 123, accessToken: 'test-access-token' }),
      );
    });
  });
});
```
