import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../constants';

const appAPI = {
  getNativePath: (pathType: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.APP.GET_NATIVE_PATH, pathType),
  getElectronAppVersion: () =>
    ipcRenderer.invoke(IPC_CHANNELS.APP.GET_APP_VERSION),
  getElectronAppName: () => ipcRenderer.invoke(IPC_CHANNELS.APP.GET_APP_NAME),
  platform: process.platform,
  arch: process.arch,
  postStateToMainProcess: (stateFeatureKey: string, stateObjStr: string) =>
    ipcRenderer.invoke(
      IPC_CHANNELS.APP.POST_STATE,
      stateFeatureKey,
      stateObjStr,
    ),
  writeToSharedRuntimeObj: (key: string, value: number | string | boolean) =>
    ipcRenderer.send(IPC_CHANNELS.APP.WRITE_TO_SHARED_RUNTIME_OBJ, key, value),
  readFromSharedRuntimeObj: (key: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.APP.READ_FROM_SHARED_RUNTIME_OBJ, key),
  getKeysFromSharedRuntimeObj: () =>
    ipcRenderer.invoke(IPC_CHANNELS.APP.GET_KEYS_FROM_SHARED_RUNTIME_OBJ),

  onStateUpdate: (
    callback: (stateFeatureKey: string, stateObjStr: string) => void,
  ) => {
    ipcRenderer.on(
      IPC_CHANNELS.APP.LISTEN.STATE,
      (event, stateFeatureKey: string, stateObjStr: string) => {
        callback(stateFeatureKey, stateObjStr);
      },
    );
  },
};

const dialogAPI = {
  getFile: (
    fileTypes: { name: string; extensions: string[] }[],
    folderPath?: string,
  ) =>
    ipcRenderer.invoke(IPC_CHANNELS.DIALOG.SELECT_FILE, fileTypes, folderPath),
  putFile: (
    defaultPath?: string,
    filters?: { name: string; extensions: string[] }[],
    title?: string,
  ) =>
    ipcRenderer.invoke(
      IPC_CHANNELS.DIALOG.SAVE_FILE,
      defaultPath,
      filters,
      title,
    ),
};

const windowManagerAPI = {
  createWindow: (
    manualWinId: string,
    options: Electron.BrowserWindowConstructorOptions,
    route: string,
  ) =>
    ipcRenderer.invoke(
      IPC_CHANNELS.WINDOW.CREATE_WINDOW,
      manualWinId,
      options,
      route,
    ),
  getAllWindowsInfo: () =>
    ipcRenderer.invoke(IPC_CHANNELS.WINDOW.GET_ALL_WINDOWS_INFO),
  getWindowInfo: (manualWinId?: string, nativeWinId?: number) =>
    ipcRenderer.invoke(
      IPC_CHANNELS.WINDOW.GET_WINDOW_INFO,
      manualWinId,
      nativeWinId,
    ),
  closeWindow: (manualWinId: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.WINDOW.CLOSE_WINDOW, manualWinId),
  closeAllWindows: () =>
    ipcRenderer.invoke(IPC_CHANNELS.WINDOW.CLOSE_ALL_WINDOWS),
};

const storeAPI = {
  get: (key: string) => ipcRenderer.invoke(IPC_CHANNELS.STORE.GET, key),
  set: (key: string, value: any) =>
    ipcRenderer.send(IPC_CHANNELS.STORE.SET, key, value),
  delete: (key: string) => ipcRenderer.send(IPC_CHANNELS.STORE.DELETE, key),
};

contextBridge.exposeInMainWorld('electron_winManager', windowManagerAPI);
contextBridge.exposeInMainWorld('electron_app', appAPI);
contextBridge.exposeInMainWorld('electron_dialog', dialogAPI);
contextBridge.exposeInMainWorld('electron_store', storeAPI);
