# shared-page-ng-auth

v1.

## Implementation guide

```ts
// app.routes.ts

import { Routes } from '@angular/router';
import { AppShellComponent } from './app-shell/app-shell.component';
import { v1AuthActivateIfNotLoggedin } from '@x/shared-data-access-ng-auth';
import { environment } from '../environments/environment';

export const appRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('@x/shared-page-ng-auth').then((m) => m.V1AuthRoutes),
    canActivate: [v1AuthActivateIfNotLoggedin],
    data: {
      protectedInitialPath: environment.protected_initial_path, // Required for the guard.
    },
  },
];
```

```css
.e-auth {
  --e-auth--bg-color--gradient-a: var(--e-primary-color);
  --e-auth--bg-color--gradient-b: var(--e-accent-color);
}
```

## Important requirements

_None._
