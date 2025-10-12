# shared-util-ng-capacitor

v1.

`V1CapacitorFirebaseCrashlyticsService` gives access to the Firebase (Crashlytics) functionality.

**Note!** Unlike the web-specific Firebase service (in the services lib) which has `init` method that receives the Firebase config, the native-specific Firebase Capacitor plugins don't require that! Why? Because these plugins read the config from `google-services` file that is placed in our native projects.

## Implementation guide

```ts
import {
  V1CapacitorFirebaseCrashlyticsService,
} from '@x/shared-util-ng-capacitor';

private readonly _capacitorFirebaseCrashlyticsService = inject(V1CapacitorFirebaseCrashlyticsService);

/* Methods ////////////////////////////////////////////////////////////////// */

this._capacitorFirebaseCrashlyticsService.setEnabled(true);

let isEnabled = false;
this._capacitorFirebaseCrashlyticsService.isEnabled().then((e) => {
  isEnabled = e;
});

// this._capacitorFirebaseCrashlyticsService.crash('test');

this._capacitorFirebaseCrashlyticsService.setUserId(123);

this._capacitorFirebaseCrashlyticsService.log('user entered her email');

this._capacitorFirebaseCrashlyticsService.recordException('email could not be sent to server');
```
