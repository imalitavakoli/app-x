export const rendererAppPort = 4200;
export const rendererAppName = 'ng-x-boilerplate-desktop-desktop'; // options.name.split('-')[0] + '-web'
export const electronAppName = 'ng-x-boilerplate-desktop-desktop';
export const updateServerUrl = 'https://deployment-server-url.com'; // TODO: insert your update server url here

export const IPC_CHANNELS = {
  WINDOW: {
    CREATE_WINDOW: 'window-manager:create-window',
    GET_ALL_WINDOWS_INFO: 'window-manager:get-all-windows-info',
    GET_WINDOW_INFO: 'window-manager:get-window-info',
    CLOSE_WINDOW: 'window-manager:close-window',
    CLOSE_ALL_WINDOWS: 'window-manager:close-all-windows',
  },
  APP: {
    GET_NATIVE_PATH: 'get-native-path',
    GET_APP_VERSION: 'get-app-version',
    GET_APP_NAME: 'get-app-name',
    POST_STATE: 'post-state',
    WRITE_TO_SHARED_RUNTIME_OBJ: 'write-to-shared-runtime-obj',
    READ_FROM_SHARED_RUNTIME_OBJ: 'read-from-shared-runtime-obj',
    GET_KEYS_FROM_SHARED_RUNTIME_OBJ: 'get-keys-from-shared-runtime-obj',
    LISTEN: {
      QUIT: 'quit',
      STATE: 'state',
    },
  },
  DIALOG: {
    SELECT_FILE: 'select-file',
    SAVE_FILE: 'save-file',
  },
  STORE: {
    GET: 'store-get',
    SET: 'store-set',
    DELETE: 'store-delete',
  },
};
