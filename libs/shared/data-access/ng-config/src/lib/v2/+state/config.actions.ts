/**
 * @file Actions will be dispached by our components, whenever we like to change
 * one of the options of our feature state.
 * Each single action in our app MUST have a unique name.
 */

import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  V2Config_MapDataBuild,
  V2Config_MapDep,
  V2Config_MapFirebase,
} from '@x/shared-map-ng-config';

export const ConfigActions = createActionGroup({
  source: 'V2Config',
  events: {
    /* Enable/Disable the effects /////////////////////////////////////////// */

    appInitStart: emptyProps(),
    appInitFinish: emptyProps(),

    /* Load Config: DEP ///////////////////////////////////////////////////// */

    loadConfigDep: props<{
      url: string;
      extraMapFun?: <T, U, V>(d: T, a: U) => V;
      assetsFolderName: string;
    }>(),
    loadConfigDepSuccess: props<{ data: V2Config_MapDep }>(),
    loadConfigDepFailure: props<{ error: string }>(),

    /* Load Config: Firebase //////////////////////////////////////////////// */

    loadConfigFirebase: props<{ url: string }>(),
    loadConfigFirebaseSuccess: props<{ data: V2Config_MapFirebase }>(),
    loadConfigFirebaseFailure: props<{ error: string }>(),

    /* Load data: Build ///////////////////////////////////////////////////// */

    loadDataBuild: props<{ url: string }>(),
    loadDataBuildSuccess: props<{ data: V2Config_MapDataBuild }>(),
    loadDataBuildFailure: props<{ error: string }>(),
  },
});
