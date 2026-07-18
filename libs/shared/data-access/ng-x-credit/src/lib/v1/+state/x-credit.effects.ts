import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, tap, mergeMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import { V1BaseEffects } from '@x/shared-util-ng-bases';
import { v1LocalPrefGet, v1LocalPrefSet } from '@x/shared-util-local-storage';
import { V1XCredit } from '@x/shared-map-ng-x-credit';

import { XCreditActions } from './x-credit.actions';
import * as selectors from './x-credit.selectors';
import { V1XCredit_State, V1_X_CREDIT_DEFAULT_TTL } from './x-credit.reducer';
import { V1XCredit_ResponseIsRelatedTo } from './x-credit.interfaces';

@Injectable()
export class V1XCreditEffects extends V1BaseEffects {
  private readonly _actions$ = inject(Actions);
  private readonly _map = inject(V1XCredit);

  /* //////////////////////////////////////////////////////////////////////// */
  /*  Select a style                                                          */
  /* //////////////////////////////////////////////////////////////////////// */

  setStyle$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(XCreditActions.setStyle),
        tap(({ style }) => {
          v1LocalPrefSet('xCredit_lastSetStyle', style);
        }),
      ),
    { dispatch: false },
  );

  checkIfAlreadySetStyle$ = createEffect(() =>
    this._actions$.pipe(
      ofType(XCreditActions.checkIfAlreadySetStyle),
      switchMap(() => {
        // Get the last stored param from local storage.
        const storedParam = v1LocalPrefGet('xCredit_lastSetStyle');

        // If `storedParam` is truthy, dispatch the action to set it in our state.
        if (storedParam) {
          return of(XCreditActions.setStyle({ style: storedParam }));
        }
        // If `storedParam` is falsy, do not dispatch any action.
        return EMPTY;
      }),
    ),
  );

  /* //////////////////////////////////////////////////////////////////////// */
  /* Get summary data                                                         */
  /* //////////////////////////////////////////////////////////////////////// */

  getSummary$ = createEffect(() =>
    this._actions$.pipe(
      ofType(XCreditActions.getSummary),
      mergeMap((action) =>
        this._runEffectByCache<V1XCredit_State, any>({
          relatedTo: 'summary',
          cacheKeyPrefix: 'summary',
          cacheKeyParams: { ...action },
          cacheKeyExcludes: ['id'],
          stateSelector: selectors.selectState,
          getCacheTimestamps: (s) =>
            s.entities[action.id]?.cacheTimestamps?.summary ?? {},
          getTtl: (s) =>
            s.entities[action.id]?.ttls?.summary ?? V1_X_CREDIT_DEFAULT_TTL,
          apiFn: () =>
            this._map.getSummary(action.url, action.userId, action.lib),
          onSuccess: (data, cacheKey) =>
            XCreditActions.success({
              id: action.id,
              props: { relatedTo: 'summary', cacheKey, data },
            }),
          onFailure: (error, cacheKey) =>
            XCreditActions.failure({
              id: action.id,
              props: { relatedTo: 'summary', cacheKey, error },
            }),
          onCacheHit: (relatedTo, cacheKey) =>
            XCreditActions.cacheHit({
              id: action.id,
              props: {
                relatedTo: relatedTo as V1XCredit_ResponseIsRelatedTo,
                cacheKey,
              },
            }),
        }),
      ),
    ),
  );

  /* //////////////////////////////////////////////////////////////////////// */
  /* Get detail data                                                          */
  /* //////////////////////////////////////////////////////////////////////// */

  getDetail$ = createEffect(() =>
    this._actions$.pipe(
      ofType(XCreditActions.getDetail),
      mergeMap((action) =>
        this._runEffectByCache<V1XCredit_State, any>({
          relatedTo: 'detail',
          cacheKeyPrefix: 'detail',
          cacheKeyParams: { ...action },
          cacheKeyExcludes: ['id'],
          stateSelector: selectors.selectState,
          getCacheTimestamps: (s) =>
            s.entities[action.id]?.cacheTimestamps?.detail ?? {},
          getTtl: (s) =>
            s.entities[action.id]?.ttls?.detail ?? V1_X_CREDIT_DEFAULT_TTL,
          apiFn: () =>
            this._map.getDetail(action.url, action.userId, action.lib),
          onSuccess: (data, cacheKey) =>
            XCreditActions.success({
              id: action.id,
              props: { relatedTo: 'detail', cacheKey, data },
            }),
          onFailure: (error, cacheKey) =>
            XCreditActions.failure({
              id: action.id,
              props: { relatedTo: 'detail', cacheKey, error },
            }),
          onCacheHit: (relatedTo, cacheKey) =>
            XCreditActions.cacheHit({
              id: action.id,
              props: {
                relatedTo: relatedTo as V1XCredit_ResponseIsRelatedTo,
                cacheKey,
              },
            }),
        }),
      ),
    ),
  );
}
