import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Params,
  Router,
} from '@angular/router';
import { map, take } from 'rxjs';

import { V1AuthFacade } from './+state/auth.facade';

export const v1AuthActivateIfNotLoggedin: CanActivateFn = (route, state) => {
  const authFacade = inject(V1AuthFacade);
  const router = inject(Router);

  // NOTE: Because of the Angular behaviour (Guards don't wait for
  // APP_INITIALIZER). So we need to call the required Auth Facade methods here
  // once gain, although we have already called them in the app's initialization
  // phase.
  authFacade.checkIfAlreadyLoggedin();
  authFacade.setProtectedInitialPath(route.data['protectedInitialPath']);

  return authFacade.authState$.pipe(
    take(1),
    map((state) => {
      if (!state.datas.getToken) return true;
      else {
        return router.createUrlTree([state.protectedInitialPath], {
          queryParams: route.queryParams,
        });
      }
    }),
  );
};

export const v1AuthActivateIfLoggedin: CanActivateFn = (route, state) => {
  const authFacade = inject(V1AuthFacade);
  const router = inject(Router);

  // NOTE: Because of the Angular behaviour (Guards don't wait for
  // APP_INITIALIZER). So we need to call the required Auth Facade methods here
  // once gain, although we have already called them in the app's initialization
  // phase.
  authFacade.checkIfAlreadyLoggedin();

  return authFacade.authState$.pipe(
    take(1),
    map((state) => {
      if (state.datas.getToken) {
        return true;
      } else
        return router.createUrlTree(['/'], { queryParams: route.queryParams });
    }),
  );
};
