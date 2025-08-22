import { app, BrowserWindow, ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../constants';
import App from '../../app';

export const registerAppEvents = () => {
  const windowManager = App.WIN_MANAGER;

  ipcMain.handle(IPC_CHANNELS.APP.GET_APP_VERSION, (event) => {
    return app.getVersion();
  });

  ipcMain.handle(IPC_CHANNELS.APP.GET_APP_NAME, async (event) => {
    return app.name;
  });

  ipcMain.handle(
    IPC_CHANNELS.APP.GET_NATIVE_PATH,
    async (
      event,
      pathType:
        | 'home'
        | 'desktop'
        | 'documents'
        | 'downloads'
        | 'music'
        | 'pictures'
        | 'videos'
        | 'appData'
        | 'userData'
        | 'temp'
        | 'logs'
        | 'crashDumps',
    ) => {
      return app.getPath(pathType);
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.APP.POST_STATE,
    async (event, stateFeatureKey: string, stateObjStr: string) => {
      const webContents = event.sender;
      const browserWindow = BrowserWindow.fromWebContents(webContents);
      const nativeWinId = browserWindow.id;

      windowManager.postState(stateFeatureKey, stateObjStr, nativeWinId);
    },
  );

  ipcMain.on(
    IPC_CHANNELS.APP.WRITE_TO_SHARED_RUNTIME_OBJ,
    (event, key: string, value: number | string | boolean) => {
      App.SHARED_RUNTIME_OBJ[key] = value;
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.APP.READ_FROM_SHARED_RUNTIME_OBJ,
    (event, key: string) => {
      return App.SHARED_RUNTIME_OBJ[key];
    },
  );

  ipcMain.handle(IPC_CHANNELS.APP.GET_KEYS_FROM_SHARED_RUNTIME_OBJ, (event) => {
    return Object.keys(App.SHARED_RUNTIME_OBJ);
  });

  ipcMain.on(IPC_CHANNELS.APP.LISTEN.QUIT, async (event, code) => {
    app.exit(code);
  });
};
