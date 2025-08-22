import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  RouteReuseStrategy,
  PreloadAllModules,
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withPreloading,
  withViewTransitions,
  withInMemoryScrolling,
} from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideTransloco } from '@jsverse/transloco';
import { Store, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import {
  provideCacheableAnimationLoader,
  provideLottieOptions,
} from 'ngx-lottie';
import player from 'lottie-web/build/player/lottie_svg';

import { V1AuthInterceptor } from '@x/shared-data-access-ng-auth';

import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { TranslocoHttpLoader } from './transloco-loader';
import { metaReducers, reducers, effects, State } from './+state';
import { AppInitializerService } from './app-initializer.service';

export const appConfig: ApplicationConfig = {
  providers: [
    environment.providers,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideEffects(effects),
    provideStore(reducers, { metaReducers }),
    provideRouter(
      appRoutes,
      withEnabledBlockingInitialNavigation(),
      withHashLocation(),
      withPreloading(PreloadAllModules),
      withViewTransitions(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
    provideTransloco({
      config: {
        availableLangs: [{ id: 'en-GB', label: 'en' }],
        defaultLang: 'en-GB',
        // NOTE: We don't recommend using the `fallbackLang` option (as the
        // Transloco team also didn't recemmend it as the default setting)!
        // Because via `APP_INITIALIZER` we wanna make sure that the user's
        // desired lang is available before loading the app... But setting a
        // fallback simply prevents this! And worse thing about setting a
        // fallback is that we also cannot understand that the user's desired
        // lang is not availalbe! As the lang service's `load()` method doesn't
        // throw an error, when we subscribe to it in our `initAppFactoryLang()`
        // function.
        // fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideCacheableAnimationLoader(),
    provideLottieOptions({
      player: () => import('lottie-web/build/player/lottie_svg'),
    }),
    provideAngularSvgIcon(),
    {
      provide: APP_INITIALIZER,
      useFactory: (service: AppInitializerService) => service.init(),
      deps: [AppInitializerService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: V1AuthInterceptor,
      multi: true,
    },
  ],
};
