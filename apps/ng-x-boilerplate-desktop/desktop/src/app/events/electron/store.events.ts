import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../constants';
// import Store from 'electron-store';

// Initialize electron-store
// const store = new Store();

export const registerStoreEvents = () => {
  ipcMain.handle(IPC_CHANNELS.STORE.GET, async (event, key: string) => {
    // return store.get(key);
    return '';
  });

  ipcMain.on(IPC_CHANNELS.STORE.SET, async (event, key: string, value: any) => {
    // store.set(key, value);
  });

  ipcMain.on(IPC_CHANNELS.STORE.DELETE, async (event, key: string) => {
    // store.delete(key);
  });
};
