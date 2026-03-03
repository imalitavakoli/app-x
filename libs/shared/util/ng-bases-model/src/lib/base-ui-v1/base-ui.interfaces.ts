import { InputSignal, ModelSignal } from '@angular/core';

export type V1BaseUi_State =
  | 'loading'
  | 'empty'
  | 'data'
  | 'success'
  | 'failure';

export type V1BaseUi_DataType = 'all' | 'one' | 'new' | 'edit';

export interface V1BaseUi_HasIt {
  state: ModelSignal<V1BaseUi_State>;
  dataType: ModelSignal<V1BaseUi_DataType>;
}
