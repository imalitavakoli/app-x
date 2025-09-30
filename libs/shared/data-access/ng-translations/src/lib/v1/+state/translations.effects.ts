import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import {
  V1Translations,
  V1Translations_MapSelectedLang,
} from '@x/shared-map-ng-translations';

import { TranslationsActions } from './translations.actions';

@Injectable()
export class V1TranslationsEffects {
  private actions$ = inject(Actions);
  private _map = inject(V1Translations);

  /* Get translations in a specific language //////////////////////////////// */

  getTranslations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TranslationsActions.getTranslations),
      concatMap(({ url, clientId, cultureCode, modules }) => {
        return this._map
          .getTranslations(url, clientId, cultureCode, modules)
          .pipe(
            map((data) =>
              TranslationsActions.success({
                relatedTo: 'translations',
                data,
                extra: { cultureCode },
              }),
            ),
            catchError((error) =>
              of(
                TranslationsActions.failure({
                  relatedTo: 'translations',
                  error,
                }),
              ),
            ),
          );
      }),
    ),
  );

  /* Get client all available langs & user selected lang //////////////////// */

  getAllLangs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TranslationsActions.getAllLangs),
      concatMap(({ url }) => {
        return this._map.getAllLangs(url).pipe(
          map((data) =>
            TranslationsActions.success({ relatedTo: 'allLangs', data }),
          ),
          catchError((error) =>
            of(
              TranslationsActions.failure({
                relatedTo: 'allLangs',
                error,
              }),
            ),
          ),
        );
      }),
    ),
  );

  getSelectedLang$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TranslationsActions.getSelectedLang),
      concatMap(({ url, userId }) => {
        return this._map.getSelectedLang(url, userId).pipe(
          map((data) =>
            TranslationsActions.success({
              relatedTo: 'selectedLang',
              data,
              extra: {
                cultureCode: (data as V1Translations_MapSelectedLang)?.id,
              },
            }),
          ),
          catchError((error) =>
            of(
              TranslationsActions.failure({ relatedTo: 'selectedLang', error }),
            ),
          ),
        );
      }),
    ),
  );

  /* Set user selected lang ///////////////////////////////////////////////// */

  patchSelectedLang$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TranslationsActions.patchSelectedLang),
      concatMap(({ url, userId, cultureCode }) => {
        return this._map.patchSelectedLang(url, userId, cultureCode).pipe(
          map((data) =>
            TranslationsActions.success({
              relatedTo: 'selectedLang',
              data,
              extra: { cultureCode },
            }),
          ),
          catchError((error) =>
            of(
              TranslationsActions.failure({
                relatedTo: 'selectedLang',
                error,
              }),
            ),
          ),
        );
      }),
    ),
  );
}
