import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { exhaustMap, map, of, skip, take, asapScheduler, filter } from 'rxjs';
import { Translation, TranslocoLoader } from '@jsverse/transloco';

import { v1LanguageGetCode } from '@x/shared-util-formatters';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import {
  V1Translations_State,
  V1TranslationsFacade,
} from '@x/shared-data-access-ng-translations';

import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly _http = inject(HttpClient);
  private readonly _configFacade = inject(V2ConfigFacade);
  private readonly _translationsFacade = inject(V1TranslationsFacade);
  private _langPrevData: Translation | undefined = undefined;

  /**
   * Use translations 'data-access' lib, to load translations from server.
   *
   * NOTE: By default, this method will be called automatically by
   * TranslocoService, as soon as the service's `load` method is called.
   * So it also can be called right at the app's initialization (i.e., when app
   * initialization promise is resolved in `app-initializer.service.ts` file).
   * It also may not be called right at the app's initialization! Because it
   * gets called ONLY IF the `load` method of the TranslocoService is
   * going to load a NEW lang, that is NOT already the active lang (new lang
   * gets defined by `setActiveLang` method). Based on our logic, we always call
   * `setActiveLang` method, before calling `load` method... So if our app is
   * going to load any other language rather than `en-GB` (which is the
   * TranslocoService initial default lang), we are actually letting the
   * app to load the new lang before it is resolved.
   *
   * NOTE: We are filtering out returning undefined translations data! So if
   * user tries to change the lang of the app at any time (e.g., via using
   * Translations 'feature' lib), if here in this method, app couldn't fetch the
   * new translations data from server, it won't show the newly selected
   * language to the user... So it's us ourselves responsibility to check
   * out whether `(translationsFacade.errors$ | async).translations` is
   * truthy or not and show an error message to the user that her new desired
   * lang couldn't get loaded, and she can try again... Where we can do that?
   * Maybe right in the Translations 'feature' lib!
   *
   * @param {string} lang
   * @returns {Observable<Translation>}
   */
  getTranslation(lang: string) {
    // Set required variables.
    let baseUrl!: string;
    let clientId!: number;
    const langCode = v1LanguageGetCode(lang);

    // Start the Observable from `_configFacade` to save required data for the
    // rest of our operations.
    return this._configFacade.configState$.pipe(
      take(1),
      exhaustMap((state) => {
        // If data was NOT truthy, just return.
        if (!state.dataConfigDep) {
          return of(false);
        }

        // Save some of its properties for later use.
        baseUrl = state.dataConfigDep.general.baseUrl as string;
        clientId = state.dataConfigDep.general.clientId as number;

        // Switch to the `translationsState$` Observable.
        return this._translationsFacade.translationsState$;
      }),
      take(1),
      filter((state) => {
        // Don't continue, if the above `exhaustMap` operation was halted.
        return state !== false;
      }),
      exhaustMap((state) => {
        // Check if translations data is already loaded in the store, then save
        // it, as we're going to use it later at the end...
        if ((state as V1Translations_State).datas.translations) {
          this._langPrevData = (
            state as V1Translations_State
          ).datas.translations;
        }

        // Now use translations to fetch the desired language (`lang` argument).
        asapScheduler.schedule(() => {
          // MOCK TEMP CODE: Replace this with the actual response that is loaded.
          this._translationsFacade.getTranslations(
            `./assets/i18n/${langCode}.json`,
            clientId,
            lang,
            environment.translations_components,
          );
          // this._translationsFacade.getTranslations(
          //   baseUrl,
          //   clientId,
          //   lang,
          //   environment.translations_components,
          // );
        });

        // Switch to the `translationsState$` Observable again.
        return this._translationsFacade.translationsState$;
      }),
      skip(2),
      take(1),
      map((state) => {
        // Finally if the NEW loaded JSON file is truthy, return that as an
        // Observable, otherwise return `_langPrevData` as an Observable.
        if (state.datas.translations) {
          return state.datas.translations as Translation;
        } else {
          return this._langPrevData as Translation;
        }
      }),
    );
  }
}
