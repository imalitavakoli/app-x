import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { RoutePaths } from '@x/ng-x-boilerplate-desktop-map-native-bridge';

import {
  NativeBridge_SuccessAction,
  NativeBridge_FailureAction,
} from './native-bridge.interfaces';
import { NativeBridge_State } from './native-bridge.reducer';

export const NativeBridgeActions = createActionGroup({
  source: 'NativeBridge',
  events: {
    getTest: props<{
      url: string;
    }>(),

    updateStateFromMainProcess: props<{
      updatedState: NativeBridge_State;
    }>(),

    doCloseWindow: props<{
      stateId: number;
      winId: string;
    }>(),

    doOpenWindow: props<{
      stateId: number;
      winId: string;
      windowConfigs: object;
      route: RoutePaths;
    }>(),

    getFileDialog: props<{
      stateId: number;
      fileTypes: { name: string; extensions: string[] }[];
      folderPath?: string;
    }>(),

    putFileDialog: props<{
      stateId: number;
      defaultPath: string | undefined;
      filterGroups: { name: string; extensions: string[] }[] | undefined;
      title: string | undefined;
    }>(),

    success: props<NativeBridge_SuccessAction>(),
    failure: props<NativeBridge_FailureAction>(),
  },
});
