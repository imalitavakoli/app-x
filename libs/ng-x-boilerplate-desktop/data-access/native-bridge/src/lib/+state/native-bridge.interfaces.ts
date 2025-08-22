import {
  NativeBridge_MapCloseWindow,
  NativeBridge_MapTest,
  NativeBridge_MapOpenWindow,
  NativeBridge_MapGetFileDialog,
  NativeBridge_MapPutFileDialog,
} from '@x/ng-x-boilerplate-desktop-map-native-bridge';

export interface NativeBridge_Loadeds {
  test?: boolean;
  closeWindow?: boolean;
  openWindow?: boolean;
  getFileDialog?: boolean;
  putFileDialog?: boolean;
}

export interface NativeBridge_Errors {
  test?: string;
  closeWindow?: string;
  openWindow?: string;
  getFileDialog?: string;
  putFileDialog?: string;
}

export interface NativeBridge_Datas {
  test?: NativeBridge_MapTest;
  closeWindow?: NativeBridge_MapCloseWindow;
  openWindow?: NativeBridge_MapOpenWindow;
  getFileDialog?: NativeBridge_MapGetFileDialog;
  putFileDialog?: NativeBridge_MapPutFileDialog;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Interface of success/failure Actions                                       */
/* ////////////////////////////////////////////////////////////////////////// */

export interface NativeBridge_SuccessAction {
  relatedTo: NativeBridge_ResponseIsRelatedTo;
  data: NativeBridge_ResponseData;
  extra?: { [key: string]: any };
}

export interface NativeBridge_FailureAction {
  relatedTo: NativeBridge_ResponseIsRelatedTo;
  error: string;
  extra?: { [key: string]: any };
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Useful within success/failure Actions interfaces                           */
/* ////////////////////////////////////////////////////////////////////////// */

type NativeBridge_ResponseIsRelatedTo =
  | 'test'
  | 'closeWindow'
  | 'openWindow'
  | 'getFileDialog'
  | 'putFileDialog';

type NativeBridge_ResponseData =
  | NativeBridge_MapTest
  | NativeBridge_MapCloseWindow
  | NativeBridge_MapOpenWindow
  | NativeBridge_MapGetFileDialog
  | NativeBridge_MapPutFileDialog;
