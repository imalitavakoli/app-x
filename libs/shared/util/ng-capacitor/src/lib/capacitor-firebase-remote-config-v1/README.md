# shared-util-ng-capacitor

v1.

`V1CapacitorFirebaseRemoteConfigService` gives access to the Firebase (RemoteConfig) functionality.

**Note!** Unlike the web-specific Firebase service (in the services lib) which has `init` method that receives the Firebase config, the native-specific Firebase Capacitor plugins don't require that! Why? Because these plugins read the config from `google-services` file that is placed in our native projects.

## Implementation guide

```ts
import { DestroyRef } from '@angular/core';
import {
  V1CapacitorFirebaseRemoteConfigService,
} from '@x/shared-util-ng-capacitor';

protected readonly _destroyRef = inject(DestroyRef);
private readonly _capacitorFirebaseRemoteConfigService = inject(V1CapacitorFirebaseRemoteConfigService);

/* Methods ////////////////////////////////////////////////////////////////// */

this._capacitorFirebaseRemoteConfigService.fetchAndActivate();

let isPremiumUser = false;
this._capacitorFirebaseRemoteConfigService.getBoolean('is_premium_user').then((e) => {
  isPremiumUser = e;
});

let packagePrice = 10;
this._capacitorFirebaseRemoteConfigService.getNumber('package_price').then((e) => {
  packagePrice = e;
});

let welcomeMessage = 'Hello World!';
this._capacitorFirebaseRemoteConfigService.getString('welcome_message').then((e) => {
  welcomeMessage = e;
});

/* Listeners //////////////////////////////////////////////////////////////// */

this._capacitorFirebaseRemoteConfigService.onConfigUpdate
  .pipe(takeUntilDestroyed(this._destroyRef))
  .subscribe({
    next: (event) => console.log('Remote Config updated:', event),
    error: (err) => console.error('Config listener error:', err),
  });
```
