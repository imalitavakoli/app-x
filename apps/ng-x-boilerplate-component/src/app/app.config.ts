import { APP_INITIALIZER, ApplicationConfig, isDevMode } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideTransloco } from '@jsverse/transloco';
import { Store, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideIonicAngular } from '@ionic/angular/standalone';
import {
  provideCacheableAnimationLoader,
  provideLottieOptions,
} from 'ngx-lottie';
import player from 'lottie-web/build/player/lottie_svg';
import { provideAngularSvgIcon } from 'angular-svg-icon';

import { V1AuthInterceptor } from '@x/shared-data-access-ng-auth';

import { environment } from '../environments/environment';
import { metaReducers, reducers, effects, State } from './+state';
import { TranslocoHttpLoader } from './transloco-loader';
import { AppInitializerService } from './app-initializer.service';

export const appConfig: ApplicationConfig = {
  providers: [
    environment.providers,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideEffects(effects),
    provideStore(reducers, { metaReducers }),
    provideIonicAngular(),
    provideRouter([]),
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
        // fallbackLang: 'en-GB',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideCacheableAnimationLoader(),
    provideLottieOptions({
      player: () => player,
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
