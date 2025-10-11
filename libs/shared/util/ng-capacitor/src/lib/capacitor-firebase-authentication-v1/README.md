# shared-util-ng-capacitor

v1.

`V1CapacitorFirebaseAuthenticationService` gives access to the Firebase (Authentication) functionality.

**Note!** Unlike the web-specific Firebase service (in the services lib) which has `init` method that receives the Firebase config, the native-specific Firebase Capacitor plugins don't require that! Why? Because these plugins read the config from `google-services` file that is placed in our native projects.

## Implementation guide

```ts
import {
  V1CapacitorFirebaseAuthenticationService,
  V1CapacitorFirebaseAuthentication_SignInResult,
} from '@x/shared-util-ng-capacitor';

private readonly _capacitorFirebaseAuthService = inject(V1CapacitorFirebaseAuthenticationService);

/* Methods: sign-in ///////////////////////////////////////////////////////// */

let userA: V1CapacitorFirebaseAuthentication_SignInResult['user'] | null = null;
this._capacitorFirebaseAuthService.signInWithApple().then((u) => {
  userA = u;
});

let userG: V1CapacitorFirebaseAuthentication_SignInResult['user'] | null = null;
this._capacitorFirebaseAuthService.signInWithGoogle().then((u) => {
  userG = u;
});

/* Methods: other /////////////////////////////////////////////////////////// */

this._capacitorFirebaseAuthService.deleteUser();

this._capacitorFirebaseAuthService.setLanguageCode();
```
