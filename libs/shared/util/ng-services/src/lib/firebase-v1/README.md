# shared-util-ng-services

v1.

## Implementation guide

It's a facade to work with the Firebase services for web across libs & apps.

**Note!** This service is ONLY useful for Firebase implementation in Web-apps! So if you're looking for Firebase native SDKs implementation (such as Firebase native Analytics for iOS or Android), then consider using the Firebase Capacitor plugin service in the Capacitor lib.

```ts
import { V1FirebaseService } from '@eliq/shared-util-ng-services';
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

/* Analytics //////////////////////////////////////////////////////////////// */

// Log screens automatically when the page changes.
this._firebaseService.analyticsAutoScreenTracking();

// Log custom events.
//
// NOTE: 'feature' libs initialize this service and send events.
//
// NOTE: Event name should follow 'GA4' naming rules. schema is: `libName_eventName`.
// e.g., `advisoryCard_init`, `advisoryCard_clickedAdvice`.
//
// TIP: For page (screen) navigaion events, schema is: `navTo_pageName`.
// e.g., `navTo_dashboard`.
this._firebaseService.analyticsLogEvent('libName_init', {data: 'something'});

// After that user logs in, set the user ID.
//
// NOTE: If you're going to collect Consent from the logged in user, this method
// MUST be called after that user allows the Consent.
this._firebaseService.analyticsSetUserId(123);
```
