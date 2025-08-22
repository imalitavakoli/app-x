import {
  NativeBridge_ApiCloseWindow,
  NativeBridge_ApiGetFileDialog,
  NativeBridge_ApiGitStatus,
  NativeBridge_ApiOpenWindow,
  NativeBridge_ApiPutFileDialog,
  NativePathType,
  WindowMetadata,
  TableWorkstation,
  TableUser,
  TableSettings,
} from './native-bridge.interfaces';

export {};

/**
 * Here we declare the global variables for 'Window' that we're going to use
 * in our app. Any communication with Electron API will be done through this
 * interface.
 *
 * It is possible to directly call and use Electron APIs like below:
 * window.electron_app.getNativePath(NativePathType.USER_DATA).then(...)
 *
 * Note: When not using Ngrx, the auto mapping is skipped. So, if the returned
 * promise is of type 'Promise<NativeBridge_Api***>', you have to map it
 * yourself manually.
 *
 * However, if it is important to save the state of operations in Ngrx, you
 * should use 'native-bridge.facade' to communicate with the Electron API:
 * this._nativeBridgeFacade.doSomeGitOperations(param1, param2, etc);
 *
 * Note: Not all the methods have the 'native-bridge.facade' equivalent.
 * For example, the job of 'window.electron_app.getNativePath' is simply to
 * return the path to the folder where the app is installed. We won't ever
 * need to save the state of this operation in Ngrx as it happens almost always
 * instantly. So, I didn't add support for this operation in Ngrx.
 */
declare global {
  interface Window {
    electron_app: {
      postStateToMainProcess: (
        stateFeatureKey: string,
        state: string,
      ) => Promise<string | null>;
      getNativePath: (pathType: NativePathType) => Promise<string>;
      getElectronAppVersion: () => Promise<string>;
      getElectronAppName: () => Promise<string>;
      platform: string;
      arch: string;
      writeToSharedRuntimeObj: (
        key: string,
        value: number | string | boolean,
      ) => void;
      readFromSharedRuntimeObj: (
        key: string,
      ) => Promise<number | string | boolean>;
      getKeysFromSharedRuntimeObj: () => Promise<string[]>;
      onStateUpdate: (
        callback: (stateFeatureKey: string, stateObjStr: string) => void,
      ) => void;
    };
    electron_dialog: {
      getFile: (
        allowedFileTypes: { name: string; extensions: string[] }[],
        folderPath?: string,
      ) => Promise<NativeBridge_ApiGetFileDialog>;
      putFile: (
        defaultPath?: string,
        filters?: { name: string; extensions: string[] }[],
        title?: string,
      ) => Promise<NativeBridge_ApiPutFileDialog>;
    };
    electron_winManager: {
      createWindow: (
        id: string,
        options: Electron.BrowserWindowConstructorOptions,
        route: string,
      ) => Promise<NativeBridge_ApiOpenWindow>;
      closeWindow: (id: string) => Promise<NativeBridge_ApiCloseWindow>;
      closeAllWindows: () => Promise<
        { status: boolean; win_id: string; msg?: string }[]
      >;

      /**
       * Retrieves information about a specific window. If no param is provided,
       * it will return the metadata of the current window which has requested.
       *
       * @param {string} [manualWinId] - The optional manual id of the window when it was first created.
       * @param {number} [nativeWinId] - The optional native system identifier of the window.
       * @returns {Promise<WindowMetadata | null>} A promise that resolves to the metadata of the requested window, or null if no window is found.
       */
      getWindowInfo: (
        manualWinId?: string,
        nativeWinId?: number,
      ) => Promise<WindowMetadata | null>;
      getAllWindowsInfo: () => Promise<WindowMetadata[]>;
    };
    electron_store: {
      get: (key: string) => Promise<any>;
      set: (key: string, value: any) => void;
      delete: (key: string) => void;
    };
  }
}
