# shared-util-ng-services

v1.

## Implementation guide

It's a facade to work with the Firebase services for web across libs & apps.

**Important!** This service is ONLY useful for Firebase implementation in Web-apps! So if you're looking for Firebase native SDKs implementation (such as Firebase native Analytics for iOS or Android), then consider using the Firebase Capacitor plugin service in the Capacitor lib.

```ts
import { isDevMode } from '@angular/core';
import { V1FirebaseService } from '@x/shared-util-ng-services';

private readonly _firebaseService = inject(V1FirebaseService);

// Init the whole Firebase service right at the initialization phase your app,
// then later you can call different methods of the service to use a specific
// feature of Firebase, such as Analytics.
const config = {
  "apiKey": "xxx",
  "authDomain": "xxx.firebaseapp.com",
  "projectId": "xxx",
  "storageBucket": "xxx.appspot.com",
  "messagingSenderId": "123",
  "appId": "xxx",
  "measurementId": "xxx"
};
this._firebaseService.init(config, isDevMode());

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

/* Realtime Database //////////////////////////////////////////////////////// */

this._firebaseService.dbGet('users/user1')
  .then(data => {
   console.log(data);
  })
  .catch(error => {
   console.error(error);
  });

this._firebaseService.dbSet('users/user1', { name: 'John', age: 30 })
  .then(() => {
   console.log('Data set successfully');
  })
  .catch(error => {
   console.error(error);
  });
```
