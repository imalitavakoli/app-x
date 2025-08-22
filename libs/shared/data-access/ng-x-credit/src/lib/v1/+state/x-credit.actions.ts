import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { V1XCredit_Style } from '@x/shared-map-ng-x-credit';

import {
  V1XCredit_InstancePropsSuccess,
  V1XCredit_InstancePropsFailure,
} from './x-credit.interfaces';

export const XCreditActions = createActionGroup({
  source: 'V1XCredit',
  events: {
    /* ////////////////////////////////////////////////////////////////////// */
    /* Select a style                                                         */
    /* ////////////////////////////////////////////////////////////////////// */

    setStyle: props<{
      style: V1XCredit_Style;
    }>(),

    checkIfAlreadySetStyle: emptyProps(), // Check if the user has already set a preferred style (in her last app visit).

    /* ////////////////////////////////////////////////////////////////////// */
    /* Get summary data                                                       */
    /* ////////////////////////////////////////////////////////////////////// */

    getSummary: props<{
      id: string;
      url: string;
      userId: number;
    }>(),

    /* ////////////////////////////////////////////////////////////////////// */
    /* Get detail data                                                        */
    /* ////////////////////////////////////////////////////////////////////// */

    getDetail: props<{
      id: string;
      url: string;
      userId: number;
    }>(),

    /* ////////////////////////////////////////////////////////////////////// */
    /* Other actions                                                          */
    /* ////////////////////////////////////////////////////////////////////// */

    createIfNotExists: props<{ id: string }>(),
    reset: props<{ id: string }>(),
    resetAll: emptyProps(),
    success: props<{ id: string; props: V1XCredit_InstancePropsSuccess }>(),
    failure: props<{ id: string; props: V1XCredit_InstancePropsFailure }>(),
  },
});
