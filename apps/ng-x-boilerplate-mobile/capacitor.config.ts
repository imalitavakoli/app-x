import { networkInterfaces } from 'node:os';

import { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

const liveReloadUrl = resolveLiveReloadUrl();

const config: CapacitorConfig = {
  appId: 'com.x.xxx',
  appName: 'X',
  webDir: '../../fin/apps/ng-x-boilerplate-mobile/browser',
  server: {
    androidScheme: 'https',
    // `url` + `cleartext` are a dev-only relaxation (plain http from the
    // Android webview). Applied only when live reload is enabled — see below.
    ...(liveReloadUrl ? { url: liveReloadUrl, cleartext: true } : {}),
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

// =============================================================================
// Live reload (dev only)
// =============================================================================
// While developing with native plugins, point the Capacitor webview at the
// local Angular dev server so changes reload on a real device without a full
// rebuild. Enabled ONLY when `CAP_LIVE_RELOAD` is set — use the `cap-sync-live`
// Nx targets in `project.json` (do not set this for production / release sync).
//
// Typical workflow (two terminals):
//   1. Terminal A — leave running:
//      `nx serve ng-x-boilerplate-mobile --host 0.0.0.0`
//      (listen on all interfaces so a phone on the same LAN can reach the PC)
//   2. Terminal B — sync once:
//      `nx run ng-x-boilerplate-mobile:cap-sync-live:android` (or `:ios`)
//   3. Open/run the native project as usual
//
// Environment variables (optional; set on the sync-live command when needed):
//   CAP_LIVE_RELOAD      — set by `cap-sync-live` targets; enables live reload
//   CAP_LIVE_RELOAD_HOST — override host (e.g. `localhost` for iOS Simulator,
//                          or a fixed LAN IP when auto-detect picks wrong adapter)
//   CAP_LIVE_RELOAD_PORT — override port (default `4200`)
//
// Virtual/bridge/tunnel adapters (Docker & KVM on Linux, VirtualBox/VMware on
// Windows, VPN tunnels on macOS) are skipped — their IPs are not reachable
// from a phone.
function resolveLiveReloadUrl(): string | undefined {
  if (!process.env['CAP_LIVE_RELOAD']) {
    return undefined;
  }

  // Safety net: a release build must never carry the dev server URL.
  if (process.env['NODE_ENV'] === 'production') {
    throw new Error('CAP_LIVE_RELOAD must not be set for production builds');
  }

  const ignoredInterfaces = /^(docker|virbr|br-|veth|tun|tap|vbox|vmnet|utun)/;
  const port = process.env['CAP_LIVE_RELOAD_PORT'] ?? '4200';
  const host =
    process.env['CAP_LIVE_RELOAD_HOST'] ??
    Object.entries(networkInterfaces())
      .filter(([name]) => !ignoredInterfaces.test(name))
      .flatMap(([, addresses]) => addresses ?? [])
      .find((address) => address.family === 'IPv4' && !address.internal)
      ?.address;

  if (!host) {
    throw new Error(
      'Live reload: no LAN IPv4 address found. Set CAP_LIVE_RELOAD_HOST.',
    );
  }

  return `http://${host}:${port}`;
}
