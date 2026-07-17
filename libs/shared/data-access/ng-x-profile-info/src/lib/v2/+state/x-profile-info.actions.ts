import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  V2XProfileInfo_SuccessAction,
  V2XProfileInfo_FailureAction,
} from './x-profile-info.interfaces';

export const XProfileInfoActions = createActionGroup({
  source: 'V2XProfileInfo',
  events: {
    /* Get data ///////////////////////////////////////////////////////////// */

    getData: props<{
      lib: string;
      url: string;
      userId: number;
    }>(),

    /* Other actions //////////////////////////////////////////////////////// */

    reset: emptyProps(),
    success: props<V2XProfileInfo_SuccessAction>(),
    failure: props<V2XProfileInfo_FailureAction>(),
  },
});
