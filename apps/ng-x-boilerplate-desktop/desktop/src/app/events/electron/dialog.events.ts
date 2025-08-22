import { dialog, ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../constants';

export const registerDialogEvents = () => {
  ipcMain.handle(IPC_CHANNELS.DIALOG.SELECT_FILE, async (event, filterGroups: { name: string; extensions: string[] }[], defaultPath?: string) => {
    const filters = filterGroups.length
      ? filterGroups.map(group => ({
        name: group.name,
        extensions: group.extensions
      }))
      : [{ name: 'All Files', extensions: ['*'] }];

    const filePaths = dialog.showOpenDialogSync({
      properties: ['openFile'],
      filters,
      defaultPath,
    });

    if (!filePaths || filePaths.length === 0) {
      return { status: false, msg: 'filePaths is empty' };
    }
    return { status: true, path: filePaths[0] };
  });

  ipcMain.handle(IPC_CHANNELS.DIALOG.SAVE_FILE, async (event, defaultPath?: string, filters?: { name: string; extensions: string[] }[], title?: string ) => {
    const filePath = dialog.showSaveDialogSync({
      title: title || 'Save File',
      defaultPath,
      filters: filters || [{ name: 'All Files', extensions: ['*'] }],
    });

    if (!filePath) {
      return { status: false, msg: 'filePath is empty' };
    }
    return { status: true, path: filePath };

  });

};
