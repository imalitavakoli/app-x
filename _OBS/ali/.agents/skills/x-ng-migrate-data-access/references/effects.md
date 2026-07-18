# Effects Migration Reference

This reference shows the before/after for `*.effects.ts` for both lib types.

---

## Single-Instance Example: `ng-translations`

### BEFORE (legacy)

```ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import {
  V1Translations,
  V1Translations_MapSelectedLang,
} from '@eliq/shared-map-ng-translations';

import { TranslationsActions } from './translations.actions';

@Injectable()
export class V1TranslationsEffects {
  private actions$ = inject(Actions);
  private _map = inject(V1Translations);

  getTranslations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TranslationsActions.getTranslations),
      concatMap(({ lib, url, clientId, cultureCode, modules }) => {
        return this._map
          .getTranslations(url, clientId, cultureCode, modules, lib)
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

  // ... similar for getAllLangs, getSelectedLang ...

  patchSelectedLang$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TranslationsActions.patchSelectedLang),
      concatMap(({ lib, url, userId, cultureCode }) => {
        return this._map.patchSelectedLang(url, userId, cultureCode, lib).pipe(
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
```

### AFTER (cache-aware)

```ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import {
  V1Translations,
  V1Translations_MapSelectedLang,
} from '@eliq/shared-map-ng-translations';
import { V1BaseEffects } from '@eliq/shared-util-ng-bases';

import { TranslationsActions } from './translations.actions';
import {
  translationsFeature,
  V1Translations_State,
} from './translations.reducer';
import { V1Translations_ResponseIsRelatedTo } from './translations.interfaces';

@Injectable()
export class V1TranslationsEffects extends V1BaseEffects {
  private actions$ = inject(Actions);
  private _map = inject(V1Translations);

  getTranslations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TranslationsActions.getTranslations),
      mergeMap((action) =>
        this._runEffectByCache<V1Translations_State, any>({
          relatedTo: 'translations',
          cacheKeyPrefix: 'translations',
          cacheKeyParams: { ...action },
          stateSelector: translationsFeature.selectV1TranslationsState,
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

  // ... similar for getAllLangs, getSelectedLang ...

  /* Mutation effect — does NOT use cache */

  patchSelectedLang$ = createEffect(() =>
    this.actions$.pipe(
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
```

---

## Multi-Instance Example: `ng-insights`

For multi-instance, the `_runEffectByCache` call looks the same, but you need an entity selector function:

```ts
mergeMap((action) =>
  this._runEffectByCacheEntity<V3Insights_State, V3Insights_Entity, any>({
    relatedTo: 'consumption',
    entityId: action.id,
    cacheKeyPrefix: 'consumption',
    cacheKeyParams: { ...action },
    stateSelector: selectState,
    getEntity: (state) => state.entities[action.id]!,
    getCacheTimestamps: (entity) => entity.cacheTimestamps.consumption,
    getTtl: (entity) => entity.ttls.consumption,
    apiFn: () => this._map.getConsumption(...),
    onSuccess: (data, cacheKey) =>
      InsightsActions.success({
        id: action.id,
        props: { relatedTo: 'consumption', cacheKey, data },
      }),
    onFailure: (error, cacheKey) =>
      InsightsActions.failure({
        id: action.id,
        props: { relatedTo: 'consumption', cacheKey, error },
      }),
    onCacheHit: (relatedTo, cacheKey) =>
      InsightsActions.cacheHit({
        id: action.id,
        props: { relatedTo, cacheKey },
      }),
  }),
),
```

### Key changes vs legacy

1. **Extends** `V1BaseEffects` (instead of bare `@Injectable()` class).
2. **GET effects** use `this._runEffectByCache()` (single-instance) or `this._runEffectByCacheEntity()` (multi-instance) instead of direct API calls.
3. **`_runEffectByCache`** params include: `relatedTo`, `cacheKeyPrefix`, `cacheKeyParams`, `stateSelector`, `getCacheTimestamps`, `getTtl`, `apiFn`, `onSuccess`, `onFailure`, `onCacheHit`.
4. **`onSuccess`/`onFailure`** now include `cacheKey` in the action props.
5. **New**: `onCacheHit` callback that dispatches the `cacheHit` action.
6. **Mutation effects** (e.g., `patchSelectedLang$`) do NOT use `_runEffectByCache` — they call the API directly and pass `cacheKey: ''`. They **keep `concatMap`** to preserve sequential ordering.
7. **`concatMap` → `mergeMap`** for **GET effects only**. The cache layer handles deduplication, so `mergeMap` allows parallel in-flight requests for different cache keys. **Do NOT change mutation effects** — they must stay `concatMap` to guarantee sequential execution.
