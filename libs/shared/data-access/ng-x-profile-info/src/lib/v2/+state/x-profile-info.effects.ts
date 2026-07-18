import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap } from 'rxjs/operators';

import { V1BaseEffects } from '@x/shared-util-ng-bases';
import { V1XProfileInfo } from '@x/shared-map-ng-x-profile-info';

import { XProfileInfoActions } from './x-profile-info.actions';
import {
  v2XProfileInfoFeature,
  V2XProfileInfo_State,
} from './x-profile-info.reducer';
import { V2XProfileInfo_ResponseIsRelatedTo } from './x-profile-info.interfaces';

@Injectable()
export class V2XProfileInfoEffects extends V1BaseEffects {
  private readonly _actions$ = inject(Actions);
  private readonly _map = inject(V1XProfileInfo);

  /* Get data /////////////////////////////////////////////////////////////// */

  getData$ = createEffect(() =>
    this._actions$.pipe(
      ofType(XProfileInfoActions.getData),
      mergeMap((action) =>
        this._runEffectByCache<V2XProfileInfo_State, any>({
          relatedTo: 'data',
          cacheKeyPrefix: 'data',
          cacheKeyParams: { ...action },
          stateSelector: v2XProfileInfoFeature.selectV2XProfileInfoState,
          getCacheTimestamps: (s) => s.cacheTimestamps.data,
          getTtl: (s) => s.ttls.data,
          apiFn: () => this._map.getData(action.url, action.userId, action.lib),
          onSuccess: (data, cacheKey) =>
            XProfileInfoActions.success({
              relatedTo: 'data',
              cacheKey,
              data,
              // extra: { blahblah },
            }),
          onFailure: (error, cacheKey) =>
            XProfileInfoActions.failure({
              relatedTo: 'data',
              cacheKey,
              error,
            }),
          onCacheHit: (relatedTo, cacheKey) =>
            XProfileInfoActions.cacheHit({
              relatedTo: relatedTo as V2XProfileInfo_ResponseIsRelatedTo,
              cacheKey,
            }),
        }),
      ),
    ),
  );
}
