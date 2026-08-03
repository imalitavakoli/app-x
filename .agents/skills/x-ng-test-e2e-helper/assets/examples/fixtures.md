# Example — fixtures

Fixtures are the test data an intercept serves (`{ fixture: '<path>' }`). Build them from the **external boundaries** mapped code-first (page/feature → `data-access` / `map`) — hermetic e2e never hits those real APIs by default. They live in `apps/{app}-e2e/src/fixtures/`, **placed by owner** — the lib that owns the stubbed data / boundary. Paths stay put: other specs **reference** that path; they never copy the file and never move it when reuse appears.

The layout below shows the three owner cases in the dashboard app's e2e project:

```
apps/dashboard-e2e/src/fixtures/
├─ session.json                         # no single owner (app-wide login)     → flat root
├─ page/
│  └─ dashboard/
│     └─ widgets-config.json            # owned by the dashboard page          → page/{page-name}/
└─ feature/
   └─ x-profile-info/
      └─ users.json                     # owned by the x-profile-info feature  → feature/{feature-name}/
```

- `{page-name}` / `{feature-name}` match the lib's spec / Page Object short name — drop scope (`shared-` / app-domain), lib-type (`page-` / `feature-`), and technology (`ng-`, …). e.g. `shared-feature-ng-x-profile-info` → `feature/x-profile-info/`.
- Locate: (1) already exist? reference it; (2) new? put under the owning lib; (3) later reuse? keep the path, reference from the other spec.
- Owner, not consumer: `users.json` stays under `feature/x-profile-info/` even if a page spec also stubs with it.

A concrete fixture — `feature/x-profile-info/users.json`, owned by the profile-info feature (the third-party users API it stubs):

```json
[
  {
    "id": 1,
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "company": { "name": "Analytical Engines" }
  }
]
```

Reference it from any spec by its **path relative to `src/fixtures/`** (Cypress resolves it there) — including from a page spec that didn't create it:

```ts
cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users', {
  fixture: 'feature/x-profile-info/users.json',
}).as('getUsers');
```
