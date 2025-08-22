# shared-util-ng-services

v1.

## Implementation guide

This service auto authenticates the user into the app, if `ticket-id` URL Query Parameter is provided.

If `location-id` URL Query Parameter is also provided, it stores in its `BehaviorSubject` so that the app's page (usually Insights page) can use it to select the desired location ID.

So basically, user visits the app like `{url}/#/auth?ticket-id=xxx&location-id=123`, then the app will auto-login the user with the provided `ticket-id`, redirects her to the app’s default page (Insights), and selects the passed `location-id` by default.

```ts
// In `app.component.ts`:

import { V1AuthAutoService } from '@x/shared-util-ng-services';

private readonly _authAutoService = inject(V1AuthAutoService);

// Auto-login right in `ngOnInit` lifecycle method.
this._authAutoService
      .autoLogin()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();

```

```ts
// In the Insights page of the app:

import { V1AuthAutoService } from '@x/shared-util-ng-services';

private readonly _authAutoService = inject(V1AuthAutoService);

// Listen for service's location ID related `BehaviorSubject`.
private _autoLoginLocation$ = this._authAutoService.locationId$.pipe(
    takeUntilDestroyed(this.destroyRef),
    filter(Boolean),
    shareReplay(1),
    tap((locationId) => this.controllersUpdateDefaultsLocationId(locationId)),
  );
this._autoLoginLocation$.subscribe();

```
