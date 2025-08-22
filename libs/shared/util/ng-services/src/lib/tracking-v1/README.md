# shared-util-ng-services

v1.

## Implementation guide

It's a facade which initializes 'user activity tracking services' in apps.

**Tip!** For the apps that initialize the 'consent' lib (to ask user whether she allows the app to track her activities across the app or not), `prepare` and then `initOrUpdate` method should be called.

**Tip!** `prepare` or `initOrUpdate` methods can be called multiple times without any problems...

**Tip!** 'feature' libs, should ONLY call `logEvent` method of this service.

```ts
// eslint-disable-next-line @nx/enforce-module-boundaries
import { environment } from 'apps/ng-appname/src/environments/environment';
import { V1TrackingService } from '@x/shared-util-ng-services';
private readonly _trackingService = inject(V1TrackingService);

// Prepare the service in `app.component.ts` of the app (after user logs in).
// NOTE: This method itself will also call the `initOrUpdate` method ONLY IF the
// `consentsTracking` property is NOT truthy in the DEP config (which is not
// truthy by default).
this._trackingService.prepare(environment.version);

// Init tracking related services.
// NOTE: This method MUST be called by the 'consent' lib's output handler in
// `app.component.ts` of the app... Of course if the 'consent' lib itself (its
// tracking view) is supposed to be initialized in the app.
this._trackingService.initOrUpdate(['feedbacks', 'analytics']);

// Log custom events to Apptentive & Firebase.
//
// NOTE: 'feature' libs initialize this service and send events.
//
// NOTE: Event name schema for libs: `lib-name_event-name`.
// e.g., `advisory-card_init`, `advisory-card_clicked-advice`.
this._trackingService.logEvent('lib-name_init', { data: 'something' });

// Access the `apptentiveService` instance.
// NOTE: `isInitApptentive` is true, if `initOrUpdate` with `'feedbacks'` type is already called.
if (this._trackingService.isInitApptentive) {
  this._trackingService.apptentiveService;
}

// Access the `firebaseService` instance.
// NOTE: `isInitFirebase` is true, if `initOrUpdate` with `'analytics'` type is already called.
if (this._trackingService.isInitFirebase) {
  this._trackingService.firebaseService;
}
```
