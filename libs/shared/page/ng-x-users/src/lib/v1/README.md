# shared-page-ng-x-users

x-users v1.

## Implementation guide

Here's how to import it in the app's `app.routes.ts` file:

```ts
// apps/{app-name}/src/app/app.routes.ts

import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'x-users',
    loadChildren: () =>
      import('@x/shared-page-ng-x-users').then((m) => m.V1XUsersRoutes),
  },
];
```

## More

**Required URL Query Params (inputs):**

_None._

## Important requirements

_None._

## Running unit tests

Run `nx test shared-page-ng-x-users` to execute the unit tests.
