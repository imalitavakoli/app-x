/**
 * @file Here's a facade (proxy layer) that lets other libs to work with this
 * lib! Actually, here our facade class itself straightly uses the NgRx Store,
 * so other libs don't have to!
 */

import { Injectable, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { TranslationsActions } from './translations.actions';
import { translationsFeature } from './translations.reducer';
import * as selectors from './translations.selectors';

@Injectable({
  providedIn: 'root',
})
export class V1TranslationsFacade {
  private readonly _store = inject(Store);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Let's select one option from our feature state object.        */
  /* //////////////////////////////////////////////////////////////////////// */

  translationsState$ = this._store.pipe(
    select(translationsFeature.selectV1TranslationsState),
  );

  lastLoadedLangCultureCode$ = this._store.pipe(
    select(translationsFeature.selectLastLoadedLangCultureCode),
  );

  loadedLatest$ = this._store.pipe(
    select(translationsFeature.selectLoadedLatest),
  );
  loadeds$ = this._store.pipe(select(translationsFeature.selectLoadeds));
  errors$ = this._store.pipe(select(translationsFeature.selectErrors));
  datas$ = this._store.pipe(select(translationsFeature.selectDatas));

  hasError$ = this._store.pipe(select(selectors.selectHasError));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Actions: Let's modify the state by dispatching actions.                  */
  /* //////////////////////////////////////////////////////////////////////// */

  getTranslations(
    url: string,
    clientId: number,
    cultureCode = 'en-GB',
    modules: string[] = [],
  ) {
    this._store.dispatch(
      TranslationsActions.getTranslations({
        url,
        clientId,
        cultureCode,
        modules,
      }),
    );
  }

  getAllLangs(url: string) {
    this._store.dispatch(TranslationsActions.getAllLangs({ url }));
  }

  getSelectedLang(url: string, userId: number) {
    this._store.dispatch(TranslationsActions.getSelectedLang({ url, userId }));
  }

  patchSelectedLang(url: string, userId: number, cultureCode: string) {
    this._store.dispatch(
      TranslationsActions.patchSelectedLang({ url, userId, cultureCode }),
    );
  }
}
