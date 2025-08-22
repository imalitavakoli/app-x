# ng-x-boilerplate-component

This is our Angular Boilerplate (web-component) app.

Most of the times, when you like **to kick-start a new Angular app for web-component development, you may simply copy-paste this app**, its sister app E2E app, and the its libs (libs which are under this app's domain).

Here's the home of our individual components which can be offered as iframe or web-component.  
Clients need to load the app with different URL Query Parameters to lazy-load the components with their default input values.

**Tip!** App's 'web-component build command' generates web-components, and app's 'normal build command' compiles a normal Angular app that can be used as an iframe window in sites/apps.

**This app is a special app!** i.e., unlike a regular app (such as our Boilerplate app) which is an independent app that is going to log the user in, show her some data, and log the user out... **Here, this app, is just acting as a wrapper!** It's actually a mini-app that can auto-login the user, and lazy-load different components based on the received URL Query Params. Here's an example URL that the app can be loaded with: `{url}/?com=initializer-v1,x-full-dashboard-v1&ticket-id=xxx&user-id=123`.

## Config

**Important!** We modified some of this app's configuration which are important to note. In the following we explain them.

- `project.json`: In `targets.build.executor` node, we used `@angular-builders/custom-webpack:browser` instead of the Angular's default builder which is `@angular-devkit/build-angular:browser`. Why? Because we needed to add `targets-build.options.customWebpackConfig` config in order to control where the JS chunk files (Specially Ionic lazy-loaded files) can be generated while the app gets compiled.  
  **Tip!** In this app, because we're using 'custom-webpack' builder, then whenever we update the Angular version of our workspace to a newer version, we MUST make sure that `@angular-builders/custom-webpack` package is also upgraded to a newer version to match the Angular version. The following command can be run to upgrade the package: `pnpm add -D @angular-builders/custom-webpack@x.x.x`.

- `webpack.custom.js`: This file is used by `@angular-builders/custom-webpack` package (the app builder package). Here we define where the JS lazy-loaded chunk files of the app should be generated when we run `nx build ng-x-boilerplate-component`.

- `web-component-prepare.js`: This file contains some NodeJS codes to edit the generated compiled files after running `nx build ng-x-boilerplate-component --configuration=webcom-v1` command. It's useful for packaging the web-components product.

## UX edge decisions

**Messages** that we show according to a known server error or `null` server JSON property results:

_None_

**Actions** that we do according to a best-practice approach or a conclusion that we've came up with:

_None_

## Designers related

Here's the list of unique **brand-specific images** that this app has:

- Animations: `./src/assets/images/anims/`.
- Libs' images/icons: `./src/x-assets/images/libs/`.

Here's the list of unique **brand-specific color & style variables** that this app has:

- `shared-ui-ng-x-profile-image` lib: Read the `README.md` file's `css` codes of the lib.
- `shared-ui-ng-x-profile-info` lib: Read the `README.md` file's `css` codes of the lib.

## More

- _Optional!_ Run `nx run ng-x-boilerplate-component:transloco-extract --input=libs/shared/TYPE/NAME` to extract the used translation keys in the provided lib (input) and store them in `apps/ng-x-boilerplate-component/src/x-assets/i18n/extracted.json` file.

## Serve/Build

- Run `nx serve ng-x-boilerplate-component` to serve the app.
- Run `nx build ng-x-boilerplate-component` to build the app.

- Run `nx build ng-x-boilerplate-component --configuration=webcom-v1` to build V1 of all web-components.
- Run `nx run ng-x-boilerplate-component:webcom webcom-v1` to concat JS files and edit the html file to prepare V1 of all web-components for an easy use.

## Deployment notes

- Local language files: `i18n` folder in assets will be removed by `web-component-prepare.js` file, when you're going to prepare web-components files. Because we're loading language JSON files from server by default based on `app/transloco-loader.ts` logic. If you changed the language loading logic and like to load the app's language files locally, then update `web-component-prepare.js` to NOT delete `i18n` folder.
