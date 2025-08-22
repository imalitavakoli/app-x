/**
 * This module is responsible for handling all the inter-process communications
 * between the frontend and the electron/Node.js backend.
 */

import { app } from 'electron';
import { environment } from '../../environments/environment';
import { registerAppEvents } from './electron/app.events';
import { registerDialogEvents } from './electron/dialog.events';
import { registerGitEvents } from './electron/git.events';
import { registerWindowEvents } from './electron/window.events';
import { registerDbEvents } from './electron/db.events';
import { registerStoreEvents } from './electron/store.events';
import App from '../app';

if (App.isDevelopmentMode()) {
  // when running in debug mode, app.name is using default value, 'Electron'
  // I am making sure that it has the same value as set in maker.options.json
  // and the package.json in the root.
  app.name = `${environment.name}`
}

export default class IpcEvents {
  static bootstrapElectronEvents(): void {
    registerAppEvents();
    registerDialogEvents();
    registerGitEvents();
    registerWindowEvents();
    registerDbEvents();
    registerStoreEvents();
  }
}
