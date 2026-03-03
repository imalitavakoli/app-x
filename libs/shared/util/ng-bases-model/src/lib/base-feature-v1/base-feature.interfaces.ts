import {
  InputSignal,
  ModelSignal,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { V2Config_MapDep } from '@x/shared-map-ng-config';

export interface V1BaseFeature_HasIt {
  showErrors: InputSignal<boolean>;
  ready: OutputEmitterRef<void>;
  allDataIsReady: OutputEmitterRef<void>;
  hasError: OutputEmitterRef<{
    key: string;
    value: string;
  }>;

  xOnError(
    error: { key: string; value: string },
    libName: string,
    instanceName?: string,
  ): void;
}

export interface V2BaseFeature_ExtHasIt extends V1BaseFeature_HasIt {
  $dataConfigDep: Signal<V2Config_MapDep | undefined>;
  $lastLoadedLang: Signal<string>;
}
