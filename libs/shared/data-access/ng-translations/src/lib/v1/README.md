# shared-data-access-ng-translations

translations v1.

Here's what this lib can do:

- Fetch the translations JSON file in a specific language.
- Fetch client all available languages on the server.
- Fetch the logged in user already selected language.
- Change the logged in user selected language.

**Note!** We can use this lib with the help of [Transloco](https://jsverse.github.io/transloco/) library to make our app multi-language.

## Implementation guide

1. First, register the data-access state in the app.

```ts
// apps/appname/src/app/+state/index.ts

import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import {
  V1Translations_State,
  v1TranslationsReducer,
  V1TranslationsEffects,
} from '@x/shared-data-access-ng-translations';

export interface State {
  v1Translations: V1Translations_State;
}

export const reducers: ActionReducerMap<State> = {
  v1Translations: v1TranslationsReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
export const effects = [V1TranslationsEffects];
```

2. Import the facade in an initializer service.

- Use Angular's `APP_INITIALIZER` token and create a factory function to load translations before the app gets initialized.
- Provide Transloco library in our app and setup its loader.

**Note!** The ONLY responsibility of `getTranslation` method in `transloco-loader.ts` file is to JUST return the JSON file of the desired language. That's it... So in there, we should not check if that JSON file do exists or not... Such logic should happen somehwere else... Such as where we are going to call the Transloco `load` method in our components.

```ts
// app.config.ts

import { APP_INITIALIZER, ApplicationConfig, isDevMode } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { environment } from '../environments/environment';
import { metaReducers, reducers, effects } from './+state';
import { AppInitializerService } from './app-initializer.service';
import { provideTransloco } from '@jsverse/transloco';

export const appConfig: ApplicationConfig = {
  providers: [
    environment.providers,
    provideEffects(effects),
    provideStore(reducers, { metaReducers }),
    provideTransloco({
      config: {
        availableLangs: [{ id: 'en-GB', label: 'en' }],
        defaultLang: 'en-GB',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: (service: AppInitializerService) => service.init(),
      deps: [AppInitializerService],
      multi: true,
    },
  ],
};
```

```ts
// transloco-loader.ts

import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';
import { exhaustMap, map, of, skip, take, asapScheduler, filter } from 'rxjs';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1TranslationsFacade } from '@x/shared-data-access-ng-translations';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private _http = inject(HttpClient);
  private _configFacade = inject(V2ConfigFacade);
  private _translationsFacade = inject(V1TranslationsFacade);
  private _langPrevData: Translation | undefined = undefined;

  getTranslation(lang: string) {
    let baseUrl!: string;
    let clientId!: number;

    return this._configFacade.configState$.pipe(
      take(1),
      exhaustMap((state) => {
        if (!state.dataConfigDep) {
          return of(false);
        }

        baseUrl = state.dataConfigDep.general.baseUrl as string;
        clientId = state.dataConfigDep.general.clientId as number;

        return this._translationsFacade.translationsState$;
      }),
      take(1),
      filter((state) => {
        return state !== false;
      }),
      exhaustMap((state) => {
        if ((state as V1Translations_State).datas.translations) {
          this._langPrevData = (
            state as V1Translations_State
          ).datas.translations;
        }

        asapScheduler.schedule(() => {
          this._translationsFacade.getTranslations(baseUrl, clientId, lang);
        });

        return this._translationsFacade.translationsState$;
      }),
      skip(2),
      take(1),
      map((state) => {
        if (state.datas.translations) {
          return state.datas.translations as Translation;
        } else {
          return this._langPrevData as Translation;
        }
      }),
    );

    // This is also how we can use Transloco loader to just simply load a local
    // translations JSON file.
    // return this._http.get<Translation>('./insights-assets/i18n/en.json');
  }
}
```

```ts
// app.interfaces.ts

export interface HaltedState {
  haltedStep: string;
}
```

```ts
// app-initializer.service.ts

import { Injectable, inject } from '@angular/core';
import {
  TranslocoService,
  AvailableLangs,
  Translation,
} from '@jsverse/transloco';
import { proxifyConfigExtra } from '@x/ng-insights-map-config';
import { exhaustMap, of, skip, take } from 'rxjs';
import { environment } from '../environments/environment';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V2Config_MapDep } from '@x/shared-map-ng-config';
import { V1AuthFacade } from '@x/shared-data-access-ng-auth';
import { V1TranslationsFacade } from '@x/shared-data-access-ng-translations';
import { v1LanguageGetCode } from '@x/shared-util-formatters';
import { HaltedState } from './app.interfaces';

@Injectable({ providedIn: 'root' })
export class AppInitializerService {
  private _configFacade = inject(V2ConfigFacade);
  private _authFacade = inject(V1AuthFacade);
  private _translationsFacade = inject(V1TranslationsFacade);
  private _langService = inject(TranslocoService);

  init() {
    return () =>
      new Promise((resolve, reject) => {
        this._configFacade.appInitStart();
        this._configFacade.loadConfigDep(
          environment.dep_config,
          proxifyConfigExtra as <T, U, V>(d: T, a: U) => V,
        );

        let baseUrl!: string;
        let clientId!: number;
        let defaultLang!: string;

        this._configFacade.configState$
          .pipe(
            skip(1),
            take(1),
            exhaustMap((state) => {
              this._configFacade.appInitFinish();

              if (!state.dataConfigDep) {
                return of({ haltedStep: 'config' } as HaltedState);
              }

              baseUrl = state.dataConfigDep.general.baseUrl;
              clientId = state.dataConfigDep.general.clientId;
              defaultLang =
                state.dataConfigDep.fun.configs.defaultLang || 'en-GB';
              this._moreConfigSettings(state.dataConfigDep);

              this._authFacade.checkIfAlreadyLoggedin();

              return this._authFacade.authState$;
            }),
            take(1),
            exhaustMap((state) => {
              if ('haltedStep' in state) return of(state);

              if (!state?.datas.getToken) {
                return of({ haltedStep: 'auth' } as HaltedState).pipe(take(1));
              }
              this._translationsFacade.getAllLangs(baseUrl);
              this._translationsFacade.getSelectedLang(
                baseUrl,
                state.datas.getToken.userId,
              );

              return this._translationsFacade.translationsState$.pipe(
                skip(4),
                take(1),
              );
            }),
          )
          .subscribe((state) => {
            if ('haltedStep' in state) {
              switch (state.haltedStep) {
                case 'config':
                  this._initFailed(resolve);
                  break;
                case 'auth':
                  this._setLangSettings(defaultLang);
                  this._loadLang(resolve, defaultLang);
                  break;
              }

              return;
            }

            if (!state.datas.allLangs || !state.datas.selectedLang) {
              this._setLangSettings(defaultLang);
              this._loadLang(resolve, defaultLang);
              return;
            }

            const langs = state.datas.allLangs.codes as AvailableLangs;
            const lang = state.datas.selectedLang;
            this._setLangSettings(lang.id, langs);
            this._loadLang(resolve, lang.id);
          });
      });
  }

  /**
   * Use `setAvailableLangs` & `setActiveLang` methods of the `TranslocoService`
   * to set the available langs and the active lang in the app.
   *
   * @private
   * @param {string} lang
   * @param {?AvailableLangs} [langs]
   */
  private _setLangSettings(lang: string, langs?: AvailableLangs) {
    if (!langs) {
      this._langService.setAvailableLangs([
        {
          id: lang,
          label: v1LanguageGetCode(lang),
        },
      ]);
    } else {
      this._langService.setAvailableLangs(langs);
    }

    this._langService.setActiveLang(lang);
  }

  /**
   * Use `load` method of the `TranslocoService` to load the desired lang.
   * If the lang couldn't be loaded, fail the app initialization.
   *
   * @private
   * @param {(value: unknown) => void} resolve
   * @param {string} [lang='en-GB']
   * @returns {void}
   */
  private _loadLang(resolve: (value: unknown) => void, lang = 'en-GB') {
    let loadedLangData: Translation | undefined;
    this._langService
      .load(lang)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          loadedLangData = data;
        },
        error: (e) => {
          this._initFailed(resolve);
        },
        complete: () => {
          if (loadedLangData) resolve(true);
          else this._initFailed(resolve);
        },
      });
  }

  private _initFailed(resolve: (value: unknown) => void) {
    resolve(true);
    // this._router.navigate(['/shell']);
  }

  private _moreConfigSettings(data: V2Config_MapDep) {
    // Do more settings now that config is loaded. e.g., edit the HTML page.
  }
}
```

3. Import the facade in the components where you want to use it.

- Import the translations facade.
- Import the Transloco service.

```ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  TranslocoPipe,
  TranslocoDirective,
  TranslocoService,
} from '@jsverse/transloco';

import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1TranslationsFacade } from '@x/shared-data-access-ng-translations';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoPipe, TranslocoDirective],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  readonly configFacade = inject(V2ConfigFacade);
  private readonly _translationsFacade = inject(V1TranslationsFacade);
  private _translationsSub!: Subscription;

  private readonly _baseUrl = '/v1/';

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit() {
    // Start listening to the state changes.
    this._translationsSub =
      this._translationsFacade.translationsState$.subscribe((state) => {
        if (state.loadedLatest.translations && state.datas.translations) {
          console.log('translations:', state.datas.translations);
        }
        if (state.loadedLatest.allLangs && state.datas.allLangs) {
          console.log('allLangs:', state.datas.allLangs);
        }
        if (state.loadedLatest.selectedLang && state.datas.selectedLang) {
          console.log('selectedLang:', state.datas.selectedLang);
        }
      });

    // Get translations
    this._translationsFacade.getTranslations(
      this._baseUrl,
      1234567890,
      'en-GB',
      ['generic_errors'],
    );

    // Get all logged user's available languages
    this._translationsFacade.getAllLangs(this._baseUrl);

    // Get currently logged in user's selected language
    this._translationsFacade.getSelectedLang(this._baseUrl, 11318242);

    // Set a new language for the logged in user
    // this._translationsFacade.patchSelectedLang(
    //   this._baseUrl, 11318242, 'en-GB',
    // );
  }
}
```

```html
<ng-container *transloco="let t; prefix: 'greetings'">
  <p class="p">{{ t('greetings_name', { name: 'Ali' }) }}</p>
</ng-container>

<p class="p">{{ 'greetings.greetings_name' | transloco: { name: 'Ali' } }}</p>
```

&nbsp;

- When user is login, call `getAllLangs` to fetch all of the user's available languages on the server. When we receive the response in `translationsState$`, let's update the Transloco service as well: `this._langService.setAvailableLangs([{id: 'en-GB', label: 'en' }]);`.

- When user is login, call `getSelectedLang` to fetch user's already desired language. When we receive the response in `translationsState$`, let's update the Transloco service as well: `this._langService.setActiveLang('en-GB');`.

- When user is login, call `patchSelectedLang` to set user's newly desired language. When we receive the response in `translationsState$`, let's update the Transloco service as well: `this._langService.setActiveLang('en-GB');`. Then load the newly selected lang: `this._langService.load('en-GB').pipe(take(1)).subscribe();`.

&nbsp;

**Tip!** Some other libs may need to know, what is the current (aka last successfully loaded) translations in the app... That's why that there's also a selector called `lastLoadedLangCultureCode$`. This selector will be updated each time a new language gets loaded (via `this._langService.load` method) successfully.

**Note!** When we call the `load` method of the Transloco service, according to the logic that we've wrote in the Transloco loader (`transloco-loader.ts` file), if the newly translocation JSON couldn't be loaded, we still show the texts of the previously successful loaded translations JSON file... So it's our own responsibility to show an error message if app couldn't load the new translations from server...

```html
<ng-container *ngIf="(translationsFacade.errors$ | async)?.translations">
  <div class="text-center">
    <h1 class="h1 text-lg">Oops! Something went wrong.</h1>
    <p class="p">
      Data could not be loaded
      <small class="e-ecode">V1TranslationsFacade.translations</small>
    </p>
  </div>
</ng-container>
```

## Important requirements

- `"@jsverse/transloco": "^6.0.0"`.

## Running unit tests

Run `nx test shared-data-access-ng-translations` to execute the unit tests.
