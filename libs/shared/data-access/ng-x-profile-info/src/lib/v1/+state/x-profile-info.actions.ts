import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  V1XProfileInfo_SuccessAction,
  V1XProfileInfo_FailureAction,
} from './x-profile-info.interfaces';

export const XProfileInfoActions = createActionGroup({
  source: 'V1XProfileInfo',
  events: {
    /* Get data ///////////////////////////////////////////////////////////// */

    getData: props<{
      lib: string;
      url: string;
      userId: number;
    }>(),

    /* Other actions //////////////////////////////////////////////////////// */

    reset: emptyProps(),
    success: props<V1XProfileInfo_SuccessAction>(),
    failure: props<V1XProfileInfo_FailureAction>(),
  },
});
