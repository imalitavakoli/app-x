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

  // If user is already logged in, redirect her to the Dashboard page.
  authFacade.checkIfAlreadyLoggedin();

  // NOTE: Because of Angular bug (Guards don't wait for APP_INITIALIZER) we
  // need to set the dashboard path here again, although we already set it in
  // the app's initialization phase.
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

  // If user is NOT logged in, redirect her to the default page.
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
