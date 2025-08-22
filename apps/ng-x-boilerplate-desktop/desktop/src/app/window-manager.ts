import { BrowserWindow } from 'electron';
import { IPC_CHANNELS, rendererAppName, rendererAppPort } from './constants';
import { join } from 'path';
import { format } from 'url';

export class WindowManager {
  private windowsList: Map<string, BrowserWindow>;
  private electronApp: Electron.App;
  private isDevelopmentMode: boolean;

  constructor(electronApp:Electron.App, isDevelopmentMode:boolean) {
    this.windowsList = new Map<string, BrowserWindow>();
    this.electronApp = electronApp;
    this.isDevelopmentMode = isDevelopmentMode;
  }

  // Create a new window
  createWindow(manualWinId: string, config: Electron.BrowserWindowConstructorOptions, route: string) {
    if (this.windowsList.has(manualWinId)) {
      const existingWindow = this.windowsList.get(manualWinId);
      if (existingWindow) {
        if (existingWindow.isMinimized()) {
          existingWindow.restore();
        }
        existingWindow.focus();
      }
      return {new_win_created: false, existing_win_focused: true, win_id: manualWinId, native_id: existingWindow.id};
    }

    const browserWindow = new BrowserWindow({
      ...config,
      webPreferences: {
        contextIsolation: true,
        preload: join(__dirname, 'main.preload.js'),
        ...config.webPreferences,
      },
    });
    browserWindow.setMenu(null);
    browserWindow.center();

    if (!this.electronApp.isPackaged) {
      const url = route ? `http://localhost:${rendererAppPort}/#/${route}` : `http://localhost:${rendererAppPort}`;
      browserWindow.loadURL(url);
    } else {
      const baseUrl = format({
        pathname: join(__dirname, '..', 'browser/index.html'),
        protocol: 'file:',
        slashes: true,
      });
      const url = route ? `${baseUrl}#/${route}` : baseUrl;
      browserWindow.loadURL(url);
    }

    browserWindow.once('ready-to-show', () => {
      browserWindow.show();
      if (config.title) {
        browserWindow.setTitle(config.title);
      }
    });

    if (this.isDevelopmentMode) {
      browserWindow.webContents.openDevTools();
      browserWindow.webContents.once('did-finish-load', () => {
        browserWindow.webContents.executeJavaScript(
          `console.log('Development mode is enabled.');`
        );
      });
    }

    browserWindow.on('closed', () => {
      this.windowsList.delete(manualWinId);
    });

    this.windowsList.set(manualWinId, browserWindow);

    return { new_win_created: true, existing_win_focused: false, win_id: manualWinId, native_id: browserWindow.id}
  }

  /**
   * Retrieves the manual id that has been specified to the window when it was
   * being created.
   *
   * @param {number} nativeWinId - The native identifier of the window.
   * @return {string | undefined} The window ID if a matching window is found, otherwise undefined.
   */
  private getWindowId(nativeWinId: number): string | undefined {
    for (const [id, window] of this.windowsList) {
      if (window.id === nativeWinId) {
        return id;
      }
    }

    return undefined;
  }

  /**
   * Get window metadata by its native window id or the manual one that we
   * specify when creating the window
   * @param manualWinId
   * @param nativeWinId
   */
  getWindowInfo(manualWinId?: string, nativeWinId?:number) {
    let window: BrowserWindow | undefined;

    // Try to get the window by manual ID first
    if (manualWinId) {
      window = this.windowsList.get(manualWinId);
    }

    // If not found, search for the window by native ID
    if (!window) {
      for (const win of this.windowsList.values()) {
        if (win.id === nativeWinId) {
          window = win;
          break;
        }
      }
    }

    // If still not found, return null
    if (!window) return null;

    // Return the window metadata
    return {
      manualWinId: this.getWindowId(window.id) || manualWinId,
      nativeWinId: window.id,
      title: window.getTitle(),
      width: window.getBounds().width,
      height: window.getBounds().height,
      isVisible: window.isVisible(),
      isFocused: window.isFocused(),
    };
  }

  getAllWindowsInfo() {
    return Array.from(this.windowsList.keys()).map((id) => this.getWindowInfo(id));
  }


  // Close a window by its ID
  closeWindow(id: string) {
    const window = this.windowsList.get(id);

    if (window) {
      window.close();
      this.windowsList.delete(id);
      return { status: true, win_id: id };
    }
    return { status: false, win_id: id, msg: "Window not found" };
  }

  // Close all windowsList
  closeAllWindows() {
    const results: { status: boolean; win_id: string; msg?: string }[] = [];

    this.windowsList.forEach((window, id) => {
      if (window) {
        window.close();
        results.push({ status: true, win_id: id });
      } else {
        results.push({ status: false, win_id: id, msg: "Window not found" });
      }
    });

    this.windowsList.clear();
    return results;
  }

  /**
   * Loop through all windows in windowsList and post the state object for
   * 'stateFeatureKey' to all the windows but exclude the window with its native
   * id equal to 'nativeWinToExclude'.
   *
   * @param stateFeatureKey
   * @param stateObjStr
   * @param nativeWinToExclude
   */
  postState(stateFeatureKey: string, stateObjStr: string, nativeWinToExclude: number) {
    console.log(`Posting state for '${stateFeatureKey}' to all windows except window with native ID: ${nativeWinToExclude}`);

    this.windowsList.forEach((window, id) => {
      if (window.id === nativeWinToExclude) {
        console.log(`Skipping window with native ID: ${nativeWinToExclude}`);
        return;
      }

      try {
        window.webContents.send(IPC_CHANNELS.APP.LISTEN.STATE, stateFeatureKey, stateObjStr);
        console.log(`State posted to window with manual ID: ${id}, native ID: ${window.id}`);
      } catch (error) {
        // Handle errors if the window is no longer available or other issues occur
        console.error(`Failed to send state to window with manual ID: ${id}, native ID: ${window.id}. Error:`, error);
      }
    });
  }
}

export function createWindowManager(electronApp: Electron.App, isDevelopmentMode:boolean): WindowManager {
  return new WindowManager(electronApp, isDevelopmentMode);
}
