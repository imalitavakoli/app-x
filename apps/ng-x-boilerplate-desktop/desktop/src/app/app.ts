import { environment } from '../environments/environment';
import { join } from 'path';
import { createWindowManager, WindowManager } from './window-manager';

export default class App {
  static ELECTRON_APP: Electron.App;
  static WIN_MANAGER: WindowManager;
  static SHARED_RUNTIME_OBJ: Record<string, number | string | boolean> = {};

  public static isDevelopmentMode() {
    const isEnvironmentSet: boolean = 'ELECTRON_IS_DEV' in process.env;
    const getFromEnvironment: boolean =
      parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;

    return isEnvironmentSet ? getFromEnvironment : !environment.production;
  }

  private static onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      App.ELECTRON_APP.quit();
    }
  }

  private static onReady() {
    App.initMainWindow();
  }

  private static onActivate() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (App.WIN_MANAGER.getWindowInfo('main') === null) {
      App.onReady();
    }
  }

  private static initMainWindow() {
    const windowConfigs: Electron.BrowserWindowConstructorOptions = {
      width: 800,
      height: 600,
      show: false,
      title: 'Main window',
      webPreferences: {
        backgroundThrottling: false,
      },
    };

    App.WIN_MANAGER.createWindow('main', windowConfigs, '');
  }

  static main(electronApp: Electron.App) {
    App.ELECTRON_APP = electronApp;
    App.WIN_MANAGER = createWindowManager(electronApp, App.isDevelopmentMode());
    App.SHARED_RUNTIME_OBJ = {};

    App.ELECTRON_APP.on('window-all-closed', App.onWindowAllClosed); // Quit when all windows are closed.
    App.ELECTRON_APP.on('ready', App.onReady); // App is ready to load data
    App.ELECTRON_APP.on('activate', App.onActivate); // App is activated
  }
}
