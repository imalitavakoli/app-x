# shared-page-ng-test

This is an empty test page.

It simply gives us, developers, an isolated area to conduct tests. This is useful when we're creating a new lib or if we want to test something in a real-world working app.

## Visibility

Everyone can visit this page.

## Implementation guide

We simply set the page route in our app's `app.routes.ts` file.

```ts
import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'test',
    loadChildren: () =>
      import('@x/shared-page-ng-test').then((m) => m.testRoutes),
  },
];
```

## Important requirements

_None._

## Running unit tests

Run `nx test shared-page-ng-test` to execute the unit tests.
