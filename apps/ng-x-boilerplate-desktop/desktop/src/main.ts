import SquirrelEvents from './app/events/squirrel.events';
import IpcEvents from './app/events/ipc.events';
import UpdateEvents from './app/events/update.events';
import { app } from 'electron';
import App from './app/app';

export default class Main {
  static initialize() {
    if (SquirrelEvents.handleEvents()) {
      // squirrel event handled (except first run event) and app will exit in 1000ms, so don't do anything else
      app.quit();
    }
  }

  static bootstrapApp() {
    App.main(app);
  }

  static bootstrapAppEvents() {
    IpcEvents.bootstrapElectronEvents();

    // initialize auto updater service
    if (!App.isDevelopmentMode()) {
      // UpdateEvents.initAutoUpdateService();
    }
  }
}

// handle setup events as quickly as possible
Main.initialize();

// bootstrap app
Main.bootstrapApp();
Main.bootstrapAppEvents();
