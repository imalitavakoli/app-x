# shared-util-ng-capacitor

v1.

`V1CapacitorFirebaseAnalyticsService` gives access to the Firebase (Analytics) functionality.

**Note!** Unlike the web-specific Firebase service (in the services lib) which has `init` method that receives the Firebase config, the native-specific Firebase Capacitor plugins don't require that! Why? Because these plugins read the config from `google-services` file that is placed in our native projects.

## Implementation guide

```ts
import { V1CapacitorFirebaseAnalyticsService } from '@x/shared-util-ng-capacitor';

private readonly _capacitorFirebaseAnalyticsService = inject(V1CapacitorFirebaseAnalyticsService);

/* Methods ////////////////////////////////////////////////////////////////// */

// Log screens automatically when the page changes.
this._capacitorFirebaseAnalyticsService.autoScreenTracking();

// Log custom events.
//
// NOTE: 'feature' libs initialize this service and send events.
//
// NOTE: Event name should follow 'GA4' naming rules. schema is: `libName_eventName`.
// e.g., `advisoryCard_init`, `advisoryCard_clickedAdvice`.
//
// TIP: For page (screen) navigaion events, schema is: `navTo_pageName`.
// e.g., `navTo_dashboard`.
this._capacitorFirebaseAnalyticsService.logEvent('libName_init', {data: 'something'});

// After that user logs in, set the user ID.
//
// NOTE: If you're going to collect Consent from the logged in user, this method
// MUST be called after that user allows the Consent.
this._capacitorFirebaseAnalyticsService.setUserId(123);
```
