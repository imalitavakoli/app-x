import { BrowserWindow, ipcMain } from 'electron';
import App from '../../app';
import { IPC_CHANNELS } from '../../constants';

export const registerWindowEvents = () => {
  const windowManager = App.WIN_MANAGER;

  ipcMain.handle(IPC_CHANNELS.WINDOW.CREATE_WINDOW, async (event, id:string, options:Electron.BrowserWindowConstructorOptions, route:string) => {
    return windowManager.createWindow(id, options, route);
  });

  ipcMain.handle(IPC_CHANNELS.WINDOW.GET_ALL_WINDOWS_INFO, async (event) => {
    return windowManager.getAllWindowsInfo();
  });

  ipcMain.handle(IPC_CHANNELS.WINDOW.GET_WINDOW_INFO, async (event, manualWinId:string, nativeWinId:number) => {
    if (manualWinId !== null && manualWinId !== undefined) {
      return windowManager.getWindowInfo(manualWinId, null);
    } else if (nativeWinId !== null && nativeWinId !== undefined) {
      return windowManager.getWindowInfo(null, nativeWinId);
    } else {
      const webContents = event.sender;
      const browserWindow = BrowserWindow.fromWebContents(webContents);
      return windowManager.getWindowInfo(null, browserWindow.id);
    }
  });

  ipcMain.handle(IPC_CHANNELS.WINDOW.CLOSE_WINDOW, async (event, id:string) => {
    return windowManager.closeWindow(id);
  });

  ipcMain.handle(IPC_CHANNELS.WINDOW.CLOSE_ALL_WINDOWS, async (event) => {
    return windowManager.closeAllWindows();
  });
};
