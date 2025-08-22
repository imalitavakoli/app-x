# shared-util-ng-services

v1.

## Implementation guide

It's a facade to work with the Firebase services across libs & apps.

```ts
import { V1FirebaseService } from '@x/shared-util-ng-services';
private readonly _firebaseService = inject(V1FirebaseService);

// Init the service.
const config = {
  "apiKey": "xxx",
  "authDomain": "xxx.firebaseapp.com",
  "projectId": "xxx",
  "storageBucket": "xxx.appspot.com",
  "messagingSenderId": "123",
  "appId": "xxx",
  "measurementId": "xxx"
};
this._firebaseService.init(config);

// Analytics: Log screens automatically when the page changes.
this._firebaseService.analyticsAutoScreenTracking();

// Analytics: After that user logs in, set the user ID.
this._firebaseService.analyticsSetUserId(123);

// Analytics: Log custom events.
//
// NOTE: 'feature' libs initialize this service and send events.
//
// NOTE: Event name schema for libs: `lib-name_event-name`.
// e.g., `advisory-card_init`, `advisory-card_clicked-advice`.
this._firebaseService.analyticsLogEvent('lib-name_init', {data: 'payload data'});
```
