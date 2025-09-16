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

// Prepare the service in `app.component.ts` of the app.
// NOTE: This method can be called multiple times! If it's called before user
// login, it only collects (prepares) DEP and Firebase configs. If it's called
// after user login, it also collects user's ID, which can be used by different
// tracking 3rd-party services, (such as Firebase Analytics) to collect more
// user-specific data.
this._trackingService.prepare(environment.version);

// Init tracking related services.
// NOTE: If you are collecting Consents from the end-user, then this method
// MUST be called, after that the user gives Consents to allow the app to track
// her activities.
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
