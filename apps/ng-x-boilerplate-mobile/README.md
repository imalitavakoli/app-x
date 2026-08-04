# ng-x-boilerplate-mobile

This is our Angular Boilerplate (mobile) app.

Most of the times, when you like **to kick-start a new Angular app for mobile development, you may simply copy-paste this app**, its sister app E2E app, and the its libs (libs which are under this app's domain).

## UX edge decisions

**Messages** that we show according to a known server error or `null` server JSON property results:

_None_

**Actions** that we do according to a best-practice approach or a conclusion that we've came up with:

_None_

## Designers related

Here's the list of unique **brand-specific images** that this app has:

- Animations: `./src/assets/images/anims/`.
- Libs' images/icons: `./src/assets/images/libs/`.
- Only this app images/icons: `./src/assets/images/this/`.

Here's the list of unique **brand-specific color & style variables** that this app has:

- `shared-page-ng-auth` lib: Read the `README.md` file's `css` codes of the lib.

- `shared-ui-ng-app-acc-sidebar` lib: Read the `README.md` file's `css` codes of the lib.
- `shared-ui-ng-app-footer` lib: Read the `README.md` file's `css` codes of the lib.
- `shared-ui-ng-app-header` lib: Read the `README.md` file's `css` codes of the lib.

## More

- _Optional!_ Run `nx run ng-x-boilerplate-mobile:transloco-extract --input=libs/shared/TYPE/NAME` to extract the used translation keys in the provided lib (input) and store them in `apps/{app-name}/src/assets/i18n/extracted.json` file.

## Serve/Build

- Run `nx serve ng-x-boilerplate-mobile` to serve the app.
- Run `nx build ng-x-boilerplate-mobile` to build the app.
- Run `nx app-shell ng-x-boilerplate-mobile` to build the app + its app-shell.
- Run `nx run ng-x-boilerplate-mobile:auto-build-fin --handleGit=true` to build the app + its app-shell + FIN process (`CHANGELOG.md` should be updated first).

## Capacitor (building native apps)

### Production

- Run `nx run ng-x-boilerplate-mobile:cap-assets-android` to generate native app's **Icons & Splash-Screens** (ONLY for **Android**).
- Run `nx run ng-x-boilerplate-mobile:cap-assets-ios` to generate native app's **Icons & Splash-Screens** (ONLY for **iOS**).

&nbsp;

- Run `nx run ng-x-boilerplate-mobile:sync:ios` to **sync iOS** (the WebView loads the bundled `webDir`).
- Run `nx run ng-x-boilerplate-mobile:sync:android` to **sync Android** (the WebView loads the bundled `webDir`).

&nbsp;

- Run `nx run ng-x-boilerplate-mobile:cap-release:ios` to app-shell (web) + sync + build native **iOS** (**release**; no live-reload; ready for signing/uploading).
- Run `nx run ng-x-boilerplate-mobile:cap-release:android` to app-shell (web) + sync + build native **Android** (**release**; no live-reload; ready for signing/uploading).

&nbsp;

- _Optional!_ Run `nx run ng-x-boilerplate-mobile:cap-assets` to generate native app's Icons & Splash-Screens.
- _Optional!_ Run `nx run ng-x-boilerplate-mobile:cap-build:ios` to build native iOS.
- _Optional!_ Run `nx run ng-x-boilerplate-mobile:cap-build:android` to build native Android.

### Development

- Run `nx run ng-x-boilerplate-mobile:cap-sync-live:ios` to **sync iOS with live-reload** (points the native WebView at the local dev server).
- Run `nx run ng-x-boilerplate-mobile:cap-sync-live:android` to **sync Android with live-reload**.

### live-reload the native app

While developing and working with native plugins in app, you may need to quickly see results on native devices. i.e., instead of bundling the web-app into the native project, the native WebView can load the running dev server over your local network (LAN IP is auto-detected in `capacitor.config.ts`), so every code change is reflected on the device immediately. In order to do that, use `cap-sync-live`:

1. Terminal A — start (and leave running): `nx serve ng-x-boilerplate-mobile --host 0.0.0.0` (listen on all interfaces so a phone on the same LAN can reach the PC).
2. Terminal B — sync once: `nx run ng-x-boilerplate-mobile:cap-sync-live:android` (or `:ios`).
3. Run the app on a real device/emulator/simulator (from AndroidStudio/XCode, or via `pnpm nx run ng-x-boilerplate-mobile:run:android`). A native rebuild is needed, because the synced assets have changed.

**Live-reload manually:**

- Find out about your machine's IP address (on Mac, run: `ifconfig | grep inet`; on Windows, run: `ipconfig`).
- Mention your IP address in `capacitor.config.ts` file, by adding the following _temporarily_ code in `config.server` → `url: 'http://192.168.1.xxx:4200', cleartext: true,`.
- Run the sync command for iOS or Android.
- Run the serve command with `--host 0.0.0.0` option (to tell Angular to listen on all network interfaces, not just `localhost`).

### Environment variables

- `CAP_LIVE_RELOAD` — set by `cap-sync-live` targets (so you normally never set it yourself); enables live-reload (do not set for release/production sync). see comments in `capacitor.config.ts`.
- `CAP_LIVE_RELOAD_HOST` — optional; use when auto-detect picks a wrong IP, or a special host is needed (e.g. `localhost` for iOS Simulator, or a fixed LAN IP).
- `CAP_LIVE_RELOAD_PORT` — optional; use when serve isn’t on `4200` (default).

Examples:

- `CAP_LIVE_RELOAD_HOST=localhost nx run ng-x-boilerplate-mobile:cap-sync-live:ios`
- `CAP_LIVE_RELOAD_HOST=192.168.1.42 CAP_LIVE_RELOAD_PORT=4200 nx run ng-x-boilerplate-mobile:cap-sync-live:android`

(On PowerShell: `$env:CAP_LIVE_RELOAD_HOST = "localhost"; nx run ng-x-boilerplate-mobile:cap-sync-live:ios`.)

### Debugging

**Check live-reload vs production mode**  
Open the generated config: `apps/ng-x-boilerplate-mobile/android/app/src/main/assets/capacitor.config.json`. Live-reload mode has `server.url` and `"cleartext": true`; production mode has neither.

**Plain `sync` turns off live-reload**  
`nx run ng-x-boilerplate-mobile:sync` (or `:sync:android` / `:sync:ios`) resets the native project to the bundled/`webDir` form and kills live-reload — intentional, so `cap-release` stays safe. Use `cap-sync-live` for development, `cap-release` for shipping, and plain `sync` as “reset to production”.

**Device can’t reach the dev server**  
Almost always the machine firewall: on Windows, accept the Defender prompt that allows Node on private networks; on Ubuntu with `ufw` enabled, run `sudo ufw allow 4200/tcp`.

**Cleartext / ATS — no manual manifest edits**  
You no longer need `android:usesCleartextTraffic="true"` in `AndroidManifest.xml`. Android uses `server.cleartext` from the live-reload config; iOS allows plain http in debug via Capacitor’s template (App Transport Security). If iOS shows a blank screen, check that Info.plist ATS setting first — and never relax it in a release build.

## Deployment notes

- PWA name: You can change the app's name (when it gets installed on a device as a PWA) from `src/manifest.webmanifest` file.

- DEP config: Some dynamic configurations in the app's DEP config JSON files are disabled by prefixing their property names with the letter `X` (e.g., `Xapptentive`). We've chosen not to remove these disabled properties, so we can keep them for reference. This way, we can easily re-enable them at any time by simply removing the `X` prefix.

- Firebase services: For Firebase services (Analytics, or Remote-config), the `fun.configs.firebase_integration` flag in the DEP config must be set to true, and the `src/assets/firebase_config.json` file must also be present.
  **Tip!** Is the JSON file required for mobile apps as well? Well, although this JSON file is primarily used by web apps (since mobile apps read their Firebase configuration from the `google-services` file in the native Android/iOS project), it's still required and should be created manually. This is because your app can be compiled for both web and mobile platforms simultaneously, and the web build needs this configuration file to function correctly.

- Mobile apps, Firebase plugins: For Firebase Capacitor plugins (Push-notification, Analytics, or Remote-config), `google-services` file should be created and placed in native Android (`android/app/google-services.json`) & iOS (`ios/App/App/GoogleService-Info.plist`) projects.

- Mobile apps, placeholders: To prepare the native Android/iOS projects for a specific app ID & name, remember to replace the probable `X`, `com.x`, and `com.x.xxx` placeholders in the project files. For the Android project, remember to have a correct path to the `MainActivity.java` file (`android/app/src/main/java/com/x/nativeApp`).

- iOS mobile, syncing: The iOS sync command (i.e. `nx run ng-x-boilerplate-mobile:sync:ios`) MUST be run on MacOS only, because PNPM folders are named and structured differently in Windows & MacOS.
