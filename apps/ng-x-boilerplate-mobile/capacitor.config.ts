import { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.x.xxx',
  appName: 'X',
  webDir: '../../dist/apps/ng-x-boilerplate-mobile/browser',
  server: {
    androidScheme: 'https',
  },

  plugins: {
    // https://capacitorjs.com/docs/apis/push-notifications
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },

    // https://github.com/capawesome-team/capacitor-plugins/tree/main/packages/android-edge-to-edge-support
    EdgeToEdge: {
      backgroundColor: '#ffffff',
    },

    // https://capacitorjs.com/docs/apis/keyboard
    Keyboard: {
      resize: KeyboardResize.Native,
      style: KeyboardStyle.Default,
      resizeOnFullScreen: false, // Why false? To make it work smoothly with `EdgeToEdge`. Otherwise, the web view will be resized to fit the screen.
    },

    // https://github.com/capawesome-team/capacitor-firebase/tree/main/packages/authentication
    FirebaseAuthentication: {
      authDomain: undefined,
      skipNativeAuth: false,
      providers: ['apple.com', 'google.com'],
    },

    // Bypass Azure Cors
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
