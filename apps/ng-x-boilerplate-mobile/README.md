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
- Run `nx run ng-x-boilerplate-mobile:echo-fin --handleGit=true` to build the app + its app-shell + FIN process (`CHANGELOG.md` should be updated first).

## Capacitor (building native apps)

- Run `nx run ng-x-boilerplate-mobile:cap-assets-android` to generate app's Icons & Splash-Screens (ONLY for Android).
- Run `nx run ng-x-boilerplate-mobile:cap-assets-ios` to generate app's Icons & Splash-Screens (ONLY for iOS).

- Run `nx run ng-x-boilerplate-mobile:sync:ios` to sync ios native app.
- Run `nx run ng-x-boilerplate-mobile:sync:android` to sync android native app.

- _Optional!_ Run `nx run ng-x-boilerplate-mobile:cap-assets` to generate app's Icons & Splash-Screens.
- _Optional!_ Run `nx run ng-x-boilerplate-mobile:cap-build:ios` to build ios native app.
- _Optional!_ Run `nx run ng-x-boilerplate-mobile:cap-build:android` to build android native app.

## Deployment notes

- PWA name: You can change the app's name (when it gets installed on a device as a PWA) from `src/manifest.webmanifest` file.

- DEP config: Some dynamic configurations in the app's DEP config JSON files are disabled by prefixing their property names with the letter `X` (e.g., `Xapptentive`). We've chosen not to remove these disabled properties, so we can keep them for reference. This way, we can easily re-enable them at any time by simply removing the `X` prefix.

- Firebase services: For Firebase services (Analytics, or Remote-config), the `fun.configs.firebase_integration` flag in the DEP config must be set to true, and the `src/assets/firebase_config.json` file must also be present.
  **Tip!** Is the JSON file required for mobile apps as well? Well, although this JSON file is primarily used by web apps (since mobile apps read their Firebase configuration from the `google-services` file in the native Android/iOS project), it's still required and should be created manually. This is because your app can be compiled for both web and mobile platforms simultaneously, and the web build needs this configuration file to function correctly.

- Mobile apps, Firebase plugins: For Firebase Capacitor plugins (Push-notification, Analytics, or Remote-config), `google-services` file should be created and placed in native Android (`android/app/google-services.json`) & iOS (`ios/App/App/GoogleService-Info.plist`) projects.

- Mobile apps, placeholders: To prepare the native Android/iOS projects for a specific app ID & name, remember to replace the probable `X`, `com.x`, and `com.x.xxx` placeholders in the project files. For the Android project, remember to have a correct path to the `MainActivity.java` file (`android/app/src/main/java/com/x/nativeApp`).
