import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.x.xxx',
  appName: 'X',
  webDir: '../../fin/apps/ng-x-boilerplate-mobile/browser',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },

  plugins: {
    /* Push Notifications /////////////////////////////////////////////////// */
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    /* Bypass Azure Cors //////////////////////////////////////////////////// */
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
