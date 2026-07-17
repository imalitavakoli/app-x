import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import {
  V1Translations,
  V1Translations_MapSelectedLang,
} from '@x/shared-map-ng-translations';
import { V1BaseEffects } from '@x/shared-util-ng-bases';

import { TranslationsActions } from './translations.actions';
import {
  v1TranslationsFeature,
  V1Translations_State,
} from './translations.reducer';
import { V1Translations_ResponseIsRelatedTo } from './translations.interfaces';

@Injectable()
export class V1TranslationsEffects extends V1BaseEffects {
  private readonly _actions$ = inject(Actions);
  private readonly _map = inject(V1Translations);

  /* Get translations in a specific language //////////////////////////////// */

  getTranslations$ = createEffect(() =>
    this._actions$.pipe(
      ofType(TranslationsActions.getTranslations),
      mergeMap((action) =>
        this._runEffectByCache<V1Translations_State, any>({
          relatedTo: 'translations',
          cacheKeyPrefix: 'translations',
          cacheKeyParams: { ...action },
          stateSelector: v1TranslationsFeature.selectV1TranslationsState,
          getCacheTimestamps: (s) => s.cacheTimestamps.translations,
          getTtl: (s) => s.ttls.translations,
          apiFn: () =>
            this._map.getTranslations(
              action.url,
              action.clientId,
              action.cultureCode,
              action.modules,
              action.lib,
            ),
          onSuccess: (data, cacheKey) =>
            TranslationsActions.success({
              relatedTo: 'translations',
              cacheKey,
              data,
              extra: { cultureCode: action.cultureCode },
            }),
          onFailure: (error, cacheKey) =>
            TranslationsActions.failure({
              relatedTo: 'translations',
              cacheKey,
              error,
            }),
          onCacheHit: (relatedTo, cacheKey) =>
            TranslationsActions.cacheHit({
              relatedTo: relatedTo as V1Translations_ResponseIsRelatedTo,
              cacheKey,
            }),
        }),
      ),
    ),
  );

  /* Get client all available langs & user selected lang //////////////////// */

  getAllLangs$ = createEffect(() =>
    this._actions$.pipe(
      ofType(TranslationsActions.getAllLangs),
      mergeMap((action) =>
        this._runEffectByCache<V1Translations_State, any>({
          relatedTo: 'allLangs',
          cacheKeyPrefix: 'allLangs',
          cacheKeyParams: { ...action },
          stateSelector: v1TranslationsFeature.selectV1TranslationsState,
          getCacheTimestamps: (s) => s.cacheTimestamps.allLangs,
          getTtl: (s) => s.ttls.allLangs,
          apiFn: () => this._map.getAllLangs(action.url, action.lib),
          onSuccess: (data, cacheKey) =>
            TranslationsActions.success({
              relatedTo: 'allLangs',
              cacheKey,
              data,
            }),
          onFailure: (error, cacheKey) =>
            TranslationsActions.failure({
              relatedTo: 'allLangs',
              cacheKey,
              error,
            }),
          onCacheHit: (relatedTo, cacheKey) =>
            TranslationsActions.cacheHit({
              relatedTo: relatedTo as V1Translations_ResponseIsRelatedTo,
              cacheKey,
            }),
        }),
      ),
    ),
  );

  getSelectedLang$ = createEffect(() =>
    this._actions$.pipe(
      ofType(TranslationsActions.getSelectedLang),
      mergeMap((action) =>
        this._runEffectByCache<V1Translations_State, any>({
          relatedTo: 'selectedLang',
          cacheKeyPrefix: 'selectedLang',
          cacheKeyParams: { ...action },
          stateSelector: v1TranslationsFeature.selectV1TranslationsState,
          getCacheTimestamps: (s) => s.cacheTimestamps.selectedLang,
          getTtl: (s) => s.ttls.selectedLang,
          apiFn: () =>
            this._map.getSelectedLang(action.url, action.userId, action.lib),
          onSuccess: (data, cacheKey) =>
            TranslationsActions.success({
              relatedTo: 'selectedLang',
              cacheKey,
              data,
              extra: {
                cultureCode: (data as V1Translations_MapSelectedLang)?.id,
              },
            }),
          onFailure: (error, cacheKey) =>
            TranslationsActions.failure({
              relatedTo: 'selectedLang',
              cacheKey,
              error,
            }),
          onCacheHit: (relatedTo, cacheKey) =>
            TranslationsActions.cacheHit({
              relatedTo: relatedTo as V1Translations_ResponseIsRelatedTo,
              cacheKey,
            }),
        }),
      ),
    ),
  );

  /* Set user selected lang ///////////////////////////////////////////////// */

  patchSelectedLang$ = createEffect(() =>
    this._actions$.pipe(
      ofType(TranslationsActions.patchSelectedLang),
      concatMap(({ lib, url, userId, cultureCode }) => {
        return this._map.patchSelectedLang(url, userId, cultureCode, lib).pipe(
          map((data) =>
            TranslationsActions.success({
              relatedTo: 'selectedLang',
              cacheKey: '', // Mutation — no cache key needed.
              data,
              extra: { cultureCode },
            }),
          ),
          catchError((error) =>
            of(
              TranslationsActions.failure({
                relatedTo: 'selectedLang',
                cacheKey: '', // Mutation — no cache key needed.
                error,
              }),
            ),
          ),
        );
      }),
    ),
  );
}
