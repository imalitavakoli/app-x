export enum NativePathType {
  HOME = 'home',
  APP_DATA = 'appData',
  USER_DATA = 'userData',
  SESSION_DATA = 'sessionData',
  TEMP = 'temp',
  EXE = 'exe',
  MODULE = 'module',
  DESKTOP = 'desktop',
  DOCUMENTS = 'documents',
  DOWNLOADS = 'downloads',
  MUSIC = 'music',
  PICTURES = 'pictures',
  VIDEOS = 'videos',
  RECENT = 'recent',
  LOGS = 'logs',
  CRASH_DUMPS = 'crashDumps',
}

export enum RoutePaths {
  SOMETHING = 'something',
}

export interface WindowMetadata {
  manualWinId: string;
  nativeWinId: number;
  title: string;
  width: number;
  height: number;
  isVisible: boolean;
  isFocused: boolean;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Get test                                                                   */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Exact API response object interface.
 *
 * @export
 * @interface NativeBridge_ApiTest
 * @typedef {NativeBridge_ApiTest}
 */
export interface NativeBridge_ApiTest {
  [key: string]: string;
}

/**
 * Simplified version of API response object interface.
 *
 * @export
 * @interface NativeBridge_MapTest
 * @typedef {NativeBridge_MapTest}
 */
export interface NativeBridge_MapTest {
  [key: string]: string;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Native window                                                              */
/* ////////////////////////////////////////////////////////////////////////// */

export interface NativeBridge_ApiCloseWindow {
  status: boolean;
  win_id: string;
  msg?: string;
}
export interface NativeBridge_MapCloseWindow {
  stateId: number;
  status: boolean;
  win_id: string;
  msg?: string;
}

export interface NativeBridge_ApiOpenWindow {
  new_win_created: boolean;
  existing_win_focused: boolean;
  win_id: string;
  native_id: number;
}
export interface NativeBridge_MapOpenWindow {
  stateId: number;
  new_win_created: boolean;
  existing_win_focused: boolean;
  win_id: string;
  native_id: number;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* File dialog                                                                */
/* ////////////////////////////////////////////////////////////////////////// */

export interface NativeBridge_ApiGetFileDialog {
  status: boolean;
  path?: string;
  msg?: string;
}
export interface NativeBridge_MapGetFileDialog {
  stateId: number;
  status: boolean;
  path?: string;
  msg?: string;
}

export interface NativeBridge_ApiPutFileDialog {
  status: boolean;
  path?: string;
  msg?: string;
}
export interface NativeBridge_MapPutFileDialog {
  stateId: number;
  status: boolean;
  path?: string;
  msg?: string;
}
