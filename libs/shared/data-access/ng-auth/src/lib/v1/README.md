# shared-data-access-ng-auth

auth v1.

Here's the user flow:

- User enters her reference data (depending on the app that is using our lib, this data can be vary). Most of the times, she enters her email address.
- App sends user's reference data + app's client ID (which the app has already received from DEP) to the Magic Link service API.
- Server sends user an email with a magic link which lets her to login to the app.
- App starts constantly connecting to API and checking whether user checked her email or not.
- When app understands that user has clicked the magic link in her email... Then it receives a token that can log the user in.

## Implementation guide

Let's do some preparation to start using the lib.

### Preparation

First things first! Create `apps/appname/src/app/+state/index.ts` file.  
**Important!** The lib's feature key in our app's state object MUST BE `auth`.

```ts
import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import {
  V1Auth_State,
  v1AuthReducer,
  V1AuthEffects,
} from '@x/shared-data-access-ng-auth';

export interface V1Auth_State {
  v1Auth: V1Auth_State;
}

export const reducers: ActionReducerMap<V1Auth_State> = {
  v1Auth: v1AuthReducer,
};

export const metaReducers: MetaReducer<V1Auth_State>[] = isDevMode() ? [] : [];
export const effects = [V1AuthEffects];
```

Provide the lib's interceptor in `app.config.ts` file as `HTTP_INTERCEPTORS`.

```ts
import { ApplicationConfig } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { environment } from '../environments/environment';
import { metaReducers, reducers, effects } from './+state';
import { V1AuthInterceptor } from '@x/shared-data-access-ng-auth';

export const appConfig: ApplicationConfig = {
  providers: [
    environment.providers,
    provideEffects(effects),
    provideStore(reducers, { metaReducers }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: V1AuthInterceptor,
      multi: true,
    },
  ],
};
```

Import it in the components that we like to use.

```ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { V1AuthFacade } from '@x/shared-data-access-ng-auth';

@Component({
  selector: 'sth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sth.component.html',
  styleUrls: ['./sth.component.scss'],
})
export class CoreComponent {
  readonly authFacade = inject(V1AuthFacade);
}
```

In our component initialization, subscribe to the lib's state to be notified about each property change.

```ts
this.authFacade.authState$.subscribe((state) => {
  console.log('authState$:', state);
});
```

### Usage

- We receive user's reference data in a form and we already have the app's client ID from DEP.  
  **Note!** we can see the user's reference data interface (`V1Auth_ApiPayloadMagicSendLoginLink`) in 'shared-map-ng-auth' lib.

- Then we dispatch `magicSendLoginLink` action to call http request and let the effect class to connect to the API. `success` or `failure` actions will be dispatched. If `errors.magicSendLoginLink` property was not `undefined` anymore, then we know that `failure` action was dispatched. So we simply show an error and ask user to enter her data and try again. If `datas.magicSendLoginLink` property was truthy, then we know that `success` action was dispatched. So it means that user has received an email from the server.

- So we then dispatch `checkIfLinkSeen` action to see whether user has seen her email or not. Then we check if `datas.checkIfLinkSeen.ticket_status` property is `completed`... If not, we again dispatch `checkIfLinkSeen` action.

- We repeat the previous step every 5 seconds for 30 minutes, and ONLY break it when the `datas.checkIfLinkSeen.ticket_status` is `completed`! Because only by that time, we can be sure that user has already seen her email!

- Then we dispatch `getTokenViaTicket` action to get the token data.  
  **Note!** This lib stores the token in LocalStorage (by `eAuth_token` key).

- Then we have the token to keep user authenticated, so redirect her to another page in the app (e.g., 'Dashboard' page).

**Note!** Whenever user opens the app, remember to do the following in `app.component.ts` file:

```ts
// Set public URLs of the app.
this._authFacade.setPublicUrls(this.apiPublicUrls); // Default: []

// Set the default protected path of the app.
this._authFacade.setProtectedInitialPath(); // Default: '/dashboard'

// Here right at the beginning, check if user's token is already in LocalStorage
// or not to update the Auth state of the app. Based on this decision, user will
// be redirected to the appropriate page in `app.routes.ts` file.
this._authFacade.checkIfAlreadyLoggedin();
```

**Tip!** How to log the user out? Well, just dispatch `logout` action. Then user's token will be deleted from LocalStorage and we can redirect her to another page in the app (e.g., 'Home' page).

## More functionalities

Well, this lib also offers the following stuff:

- `authInterceptor` interceptor: If user is logged in, it puts the token in the `Authorization` option of the 'Request Headers' object of all protected API requests that leave our app. It also watches for every request response that our app receives... If it was a `401 Unauthorized` error, it tries to handle it and fetch new access/refresh tokens from the server, and then try to send the protected request once again.

- `activateIfNotLoggedin` guard: It redirects user to the Dashboard page, if she's logged in.

- `activateIfLoggedin` guard: It redirects user to the default page, if she's NOT logged in.

## Important requirements

_None._

## Running unit tests

Run `nx test shared-data-access-ng-auth` to execute the unit tests.
