import { Routes } from '@angular/router';
import { AppShellComponent } from './app-shell/app-shell.component';
import {
  v1AuthActivateIfLoggedin,
  v1AuthActivateIfNotLoggedin,
} from '@x/shared-data-access-ng-auth';
import { environment } from '../environments/environment';

export const appRoutes: Routes = [
  /* //////////////////////////////////////////////////////////////////////// */
  /* Shell page & default route                                               */
  /* //////////////////////////////////////////////////////////////////////// */

  { path: 'shell', component: AppShellComponent },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },

  /* //////////////////////////////////////////////////////////////////////// */
  /* Shared pages                                                             */
  /* //////////////////////////////////////////////////////////////////////// */

  {
    path: 'auth',
    loadChildren: () =>
      import('@x/shared-page-ng-auth').then((m) => m.V2AuthRoutes),
    canActivate: [v1AuthActivateIfNotLoggedin],
    data: {
      protectedInitialPath: environment.protected_initial_path, // Required for the guard.
      appVersion: environment.version, // Required for the 'Trouble logging in' popup.
    },
  },
  {
    path: '',
    loadComponent: () =>
      import('@x/shared-page-ng-base').then((m) => m.V1BasePageComponent),
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('@x/shared-page-ng-dashboard').then(
            (m) => m.V1DashboardRoutes,
          ),
        canActivate: [v1AuthActivateIfLoggedin],
      },
      {
        path: 'account',
        loadChildren: () =>
          import('@x/shared-page-ng-account').then((m) => m.V1AccountRoutes),
        canActivate: [v1AuthActivateIfLoggedin],
        data: {
          appVersion: environment.version, // Required for the app-version nav item.
        },
      },
      {
        path: 'x-users',
        loadChildren: () =>
          import('@x/shared-page-ng-x-users').then((m) => m.V1XUsersRoutes),
        canActivate: [v1AuthActivateIfLoggedin],
      },
    ],
  },
  {
    path: 'test',
    loadChildren: () =>
      import('@x/shared-page-ng-test').then((m) => m.V1TestRoutes),
  },
  {
    path: 'not-found',
    loadChildren: () =>
      import('@x/shared-page-ng-not-found').then((m) => m.V1NotFoundRoutes),
  },

  /* //////////////////////////////////////////////////////////////////////// */
  /* App-specific pages                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  // ...

  /* //////////////////////////////////////////////////////////////////////// */
  /* Wild-card route (MUST be defined as the last route)                      */
  /* //////////////////////////////////////////////////////////////////////// */

  { path: '**', redirectTo: '/not-found' },
];
