# ng-x-boilerplate-desktop

This is our Angular Boilerplate (desktop) app.

Most of the times, when you like **to kick-start a new Angular app for desktop development, you may simply copy-paste this app**, its sister app E2E app, and the its libs (libs which are under this app's domain).

## UX edge decisions

**Messages** that we show according to a known server error or `null` server JSON property results:

_None_

**Actions** that we do according to a best-practice approach or a conclusion that we've came up with:

- Loading Ionic styles: In `project.json` file of the project, we are loading the Ionic styles, although this app is a web-base app only... That's because some of the shared UI libs (such as header & footer) are already using some Ionic styles.

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

- _Optional!_ Run `nx run ng-x-boilerplate-desktop:transloco-extract --input=libs/shared/TYPE/NAME` to extract the used translation keys in the provided lib (input) and store them in `apps/{app-name}/src/assets/i18n/extracted.json` file.

## Serve/Build

- Run `nx serve ng-x-boilerplate-desktop` to serve the app.
- Run `nx build ng-x-boilerplate-desktop` to build the app.
- Run `nx app-shell ng-x-boilerplate-desktop` to build the app + its app-shell.

## Electron (building native app)

- Run `nx run ng-x-boilerplate-desktop-desktop:sync-version` to sync version.
- Run `nx run ng-x-boilerplate-desktop-desktop:turn-signing-off` to turn signing off.
- Run `nx run ng-x-boilerplate-desktop-desktop:turn-signing-on` to turn signing on.

- Run `nx run ng-x-boilerplate-desktop-desktop:build` to build desktop native app.
- Run `nx run ng-x-boilerplate-desktop-desktop:serve` to serve desktop native app.
- Run `nx run ng-x-boilerplate-desktop-desktop:package` to package desktop native app.
- Run `nx run ng-x-boilerplate-desktop-desktop:make` to make desktop native app.

## Deployment notes

- PWA name: You can change the app's name (when it gets installed on a device as a PWA) from `src/manifest.webmanifest` file.

- Firebase services: For Firebase services (Analytics, or Remote-config), the `fun.configs.firebase_integration` flag in the DEP config must be set to true, and the `src/assets/firebase_config.json` file must also be present.
  **Tip!** Is the JSON file required for mobile apps as well? Well, although this JSON file is primarily used by web apps (since mobile apps read their Firebase configuration from the `google-services` file in the native Android/iOS project), it's still required and should be created manually. This is because your app can be compiled for both web and mobile platforms simultaneously, and the web build needs this configuration file to function correctly.
