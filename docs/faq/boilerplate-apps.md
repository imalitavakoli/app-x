[🔙](../../README.md#faq)

# Our Boilerplate app(s) 📦

Boilerplate apps are kick-starter apps which hold the latest standards in the workspace and initialize almost all of the shared libs. Most of the other apps can be a copy-paste of Boilerplate apps.

&nbsp;

[🔝](#our-boilerplate-apps-📦)

## How to have a new app

Well, most of the times, when you like **to kick-start a new app, you may simply copy-paste one of our Boilerplate apps** (and their sister E2E app), and then start modifying `apps/{app-name}/project.json` and `apps/{app-name}/src/index.html` files. Then open the `apps/{app-name}/src/app/app.routes.ts` file and setup your own app's routes too.

**Tip!** Of course you may need to modify some other files inside your newly created app based on your logic (such as `apps/{app-name}/src/app/+state/index.ts` file or `apps/{app-name}/src/assets/` directory files).

**Tip!** You may also like to copy-paste Our Boilerplate libs! Just go ahead and do that. But remember to (1) define a new name (based on the project's path) for each duplicated project in its `project.json` file, and (2) add the path alias name for each duplicated project in the `tsconfig.base.json` file.

**Note!** After copying the app and its libs and renaming their names, when you felt that everything is ready, there's still one more step left! And that's deleting the NX workspace caches from `node_modules/.cache` (and `.nx` if this directory exists)! Just delete the cache folder, and then try to serve or build the new app! Because without this step, NX may not recognize the relationships between your new app and its related libs and cannot be able to draw a correct graph for your project. And if you're using Tailwindcss for your app, as a result of a broken project graph, it cannot generate its CSS classes for different pages and the app looks broken, although that's not the case!

&nbsp;

[🔝](#our-boilerplate-apps-📦)

## How most of our Boilerplate apps are created

- Ran `nx g @nx/angular:app apps/ng-boilerplate --standalone` to generate the app.

- Ran `nx g @angular/pwa:ng-add --project=ng-boilerplate` to add PWA.

- Ran `nx g @nx/angular:app-shell --project=ng-boilerplate` to generate app-shell.

- Ran `nx g @nx/angular:environments --project=ng-boilerplate` to generate environments.

- Ran `nx g @nx/angular:setup-tailwind ng-boilerplate` to setup tailwindcss.

- Ran `nx g @nx/angular:ngrx-root-store ng-boilerplate` to add NgRx Root Store to our apps.

- Ran `nx g @ngneat/transloco:ng-add --project=ng-boilerplate` to add Transloco (the internationalization lib).

- Modified `src/index.html` to add more meta tags.

- Modified `src/main.server.ts` and created `proxy.conf.json` file.

- Modified `src/styles.scss` to import `src/base.scss` newly created file (it holds any public CSS codes across the whole app).

- Modified `src/main.ts` to import `src/scripts.ts` newly created file. Also created `src/base.ts` file (it holds any public JS codes across the whole app).

- Modified `project.json`. Edited `styles` option to load project's styles beside _bootstrap-icons_. Edited `scripts` option to load _jquery_. Added `allowedCommonJsDependencies` option to allow CommonJS modules.  
  **Tip!** `stylePreprocessorOptions.includePaths` option could also be added. It adds a prefix to the paths of stylesheets' (non-technology related '_ui_' libs) `@import` statements.

- Modified `src/app/app.config.ts` to provide the exported reducers & effects to our app from `src/app/+state/index.ts` newly created file (it holds our app's global store). We have also modified the app's `providers` array.

- Modified `src/app/app.routes.ts` to provide the app's pages.

**Tip!** Some asset files has been also added in the `assets` folder.

&nbsp;

[🔝](#our-boilerplate-apps-📦)

## How to integrate Ionic & Capacitor

Ionic & Capacitor help us to build iOS/Android (mobile) apps.

**Tip!** [Click here](https://ionicframework.com/docs/angular/build-options#usage-with-standalone-based-applications) to read more about integrating Ionic in Angular projects. From setting up app config in `bootstrapApplication`, to routing and using Ionic components.

**Tip!** For '_ui_' libs that use Ionic components, we need to add `"transformIgnorePatterns": ["<rootDir>/node_modules/.pnpm/(?!(@ionic/angular|@ionic/core|ionicons|@stencil/core|@angular/*)@)"]` to the lib's `jest.config.ts` file. [Click here](https://ionicframework.com/docs/angular/build-options#usage-with-standalone-based-applications) (Testing section) to read more.

Here's the step by step process to implement Ionic & Capacitor:

- Run `pnpm add -D @nxext/ionic-angular` to install [Nxext](https://nxext.dev/docs/ionic-angular/installation.html) which is a package that brings Ionic & Capacitor into the NX workspace.

- Run `nx g @nxext/ionic-angular:configuration ng-boilerplate` to configure the app. It adds `.gitignore`, `capacitor.config.ts`, `ionic.config.json`, and `package.json` in the app's folder. It also modifies `jest.config.ts`, `project.json`, and `src/index.html` files.  
  **Tip!** In `project.json` file, `assets` and `styles` options are updated to load Ionic-specific icons and styles. More 'targets' (build commands) also got added to take care of Capacitor commands.  
  **Tip!** In `project.json` file, we removed `"node_modules/@ionic/angular/css/normalize.css"` (because we're already using Tailwindcss normalize styles), `"node_modules/@ionic/angular/css/typography.css"` (because of our own typography styling rules), and `"node_modules/@ionic/angular/css/structure.css"` (because we don't use `<ion-app><ion-content> ... </ion-content></ion-app>` Ionic components that load the whole app's content in `app.component.html` file of the app, in the Ionic way) from the `styles` option. Also removed `{ "glob": "**/*.svg", "input": "node_modules/ionicons/dist/ionicons/svg", "output": "./assets/images/ion" }` from the `assets` option, because we don't need to use Ionic icons in our app (we use Bootstrap icons instead).

- Modify `capacitor.config.ts` to read the build web files from `fin` folder which is at the root of the workspace. [Click here](https://capacitorjs.com/docs/config) to read more about Capacitor configuration.

- Modify `src/app/app.config.ts` to add `{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }` and `provideIonicAngular()` providers.

&nbsp;

[🔝](#our-boilerplate-apps-📦)

## How to integrate Electron

Electron help us to build Windows/Mac/Linux (desktop) apps.

Here's the step by step process to implement Electron:

- Run `pnpm add -D nx-electron` to install [nx-electron](https://github.com/bennymeg/nx-electron) which is a package that brings Electron into the NX workspace.

- Run `nx g nx-electron:app desktop --frontendProject=ng-boilerplate --directory=ng-boilerplate` to generate the Electron app in `apps/ng-boilerplate/desktop/` directory. It also modifies `project.json` and root workspace `tsconfig.base.json`, `package.json`, `nx.json` files.  
  **Note!** To make our Frontend app work with Electron Backend app, in our Frontend app, we should (1) change the baseHref field to `./` in `src/index.html` (`<base href="./" />`); and (2) use router outlet hash strategy.  
  **Tip!** After running this command, `scripts.postinstall` will be added to the root workspace `package.json` file, to run the `electron-builder` package command to install Electron dependencies in the workspace.  
  **Tip!** We need to make sure that `electron-builder` is already installed on our machine (e.g., by running `npm install -g electron-builder`).  
  **Tip!** The root workspace `nx.json` file is modified to mention something like `"defaultProject": "ng-boilerplate-desktop"`. But we can discard this change, as we don't have any preferred default project in our workspace.

- Modify Frontend app's `project.json` to build, package, make in correct `outputPath`.

- Modify Electron (Backend) app's `src/app/options/maker.options.json` to configure packaging/making [options](https://www.electron.build/configuration). [Click here](https://github.com/bennymeg/nx-electron/blob/master/docs/packaging.md) to read more.

**Tip!** Electron (Backend) app is actually loading the Frontend app's URL in itself... So in order to successfully serve the Electron app, first we should serve the Frontend app (by running `nx serve ng-boilerplate`), and then serve the Electron app itself (by running `nx serve ng-boilerplate-desktop`).

&nbsp;

[🔝](#our-boilerplate-apps-📦)

## How to install Capacitor plugins

So far Capacitor Core, Android, iOS, and CLI have been installed (as if we have run `pnpm add @capacitor/core @capacitor/android @capacitor/ios` and `pnpm add -D @capacitor/cli` commands).  
**Tip!** The mentioned above commands can also run at anytime whenever we wanna [update Capacitor](https://capacitorjs.com/docs/basics/workflow#updating-capacitor) in the workspace.

Then we ran the following commands to install some Capacitor plugins:

- Ran `pnpm add @capacitor/app` to install [App](https://capacitorjs.com/docs/apis/app) plugin.
- Ran `pnpm add @capacitor/haptics` to install [Haptics](https://capacitorjs.com/docs/apis/haptics) plugin.
- Ran `pnpm add @capacitor/keyboard` to install [Keyboard](https://capacitorjs.com/docs/apis/keyboard) plugin.
- Ran `pnpm add @capacitor/status-bar` to install [Status-bar](https://capacitorjs.com/docs/apis/status-bar) plugin.

Above plugins are Capacitor Plugin Dependencies. i.e., we should make sure that they are installed, even if we don't import them in our app! Because Ionic itself makes use of them. [Click here](https://capacitorjs.com/docs/getting-started/with-ionic#install-capacitor-plugin-dependencies) to read more.

- Ran `pnpm add @capacitor/preferences` to install [preferences](https://capacitorjs.com/docs/apis/preferences) plugin.
- Ran `pnpm add @capacitor/push-notifications` to install [push-notifications](https://capacitorjs.com/docs/apis/push-notifications) plugin.
- Ran `pnpm add @capacitor/browser` to install [browser](https://capacitorjs.com/docs/apis/browser) plugin.
- Ran `pnpm add @capacitor/app-launcher` to install [app-launcher](https://capacitorjs.com/docs/apis/app-launcher) plugin.
- Ran `pnpm add @capacitor/filesystem` to install [filesystem](https://capacitorjs.com/docs/apis/filesystem) plugin.
- Ran `pnpm add @capacitor/share` to install [share](https://capacitorjs.com/docs/apis/share) plugin.
- Ran `pnpm add @capacitor-firebase/analytics` to install [firebase-analytics](https://github.com/capawesome-team/capacitor-firebase/tree/main/packages/analytics) plugin.
- Ran `pnpm add @capacitor-firebase/remote-config` to install [firebase-remote-config](https://github.com/capawesome-team/capacitor-firebase/tree/main/packages/remote-config) plugin.
- Ran `pnpm add capacitor-plugin-app-tracking-transparency` to install [iOS-att](https://github.com/mahnuh/capacitor-plugin-app-tracking-transparency) plugin.
- Ran `pnpm add @capawesome/capacitor-android-edge-to-edge-support` to install [android-edge-to-edge](https://capawesome.io/plugins/android-edge-to-edge-support/) plugin
- Ran `pnpm add @capawesome/capacitor-live-update` to install [live-update](https://capawesome.io/plugins/live-update/) plugin

After installing the plugins, we modified `package.json` file inside of the app's folder to mention each one those plugins in it by referring to their installed global package at the root of the workspace. Basically Capacitor temporarily installs these plugins in the app folder to start its sync process, and then deletes them as soon as it finishes.

**Note!** Of course after installing each plugin, we also have updated some files in the Android or iOS native projects (if required) according to the plugins docs.

Then we ran the following commands:

- Ran `nx run ng-boilerplate:add:ios` to add iOS native project.
- Ran `nx run ng-boilerplate:add:android` to add Android native project.
- Ran `nx run ng-boilerplate:sync:ios` to sync iOS native project.
- Ran `nx run ng-boilerplate:sync:android` to sync Android native project.
- _Optional!_ We can also run `nx run ng-boilerplate:cap-build:ios` to build iOS native project.
- _Optional!_ We can also run `nx run ng-boilerplate:cap-build:android` to build Android native project.

**Note!** We ourselves modified `project.json` file and added `cap-build` target to be able to [build native projects by Capacitor](https://capacitorjs.com/docs/basics/workflow#compiling-your-native-binary). [Click here](https://capacitorjs.com/docs/cli/commands/build) to read more.

What Capacitor sync process does basically? It puts the latest build web files (in `fin` folder at the root of the workspace) in its place (inside of the native projects), and also update the native projects dependencies (if `package.json` file which is inside of the app's folder is updated).

&nbsp;

[🔝](#our-boilerplate-apps-📦)

## Ionic tips & tricks

**Lifecycle hooks:** We can utilize Ionic lifecycle hooks on components which directly mapped by a router. This means if `/pageOne` maps to `PageOneComponent`, then Ionic lifecycles will be called on `PageOneComponent` but will not be called on any child components that `PageOneComponent` may render. [Click here](https://ionicframework.com/docs/angular/lifecycle#ionic-page-events) to read more.

**Native-like modal (Ionic nav):** If we like to have a modal (a popup which looks like a page) which needs its own sub-navigation (without the need of making it tied to the apps URL), then we can leverage Ionic `<ion-nav>` and `<ion-nav-link>` components. These components provide iOS & Android native-like page navigation. Here's an example of how to use them: An empty component can have `<ion-nav [root]="rootComponent"></ion-nav>` to load the first page (root) component in itself. Then all of the buttons in the root component that need to navigate to another component can be written like this: `<ion-nav-link router-direction="forward" [component]="childComponent"><ion-button>Go to child page</ion-button></ion-nav-link>`. The child component can also have `<ion-nav-link router-direction="root" [component]="rootComponent"><ion-button>Go back</ion-button></ion-nav-link>` button (or `<ion-nav-link router-direction="back"><ion-button>Go back</ion-button></ion-nav-link>` button), so it can let the user to navigate back. [Click here](https://ionicframework.com/docs/api/nav) to read more.

**Basic components:** In order to have native-like app structure (i.e., fixed header & footer with a scrollable content), we should use some of the Ionic components. These components will mostly be used ONLY in some major components in our apps & libs! e.g., `<ion-app>` & `<ion-router-outlet>` are used in `app.component.html`, `<ion-header>` is used in `app-header-mobile.component.html`, `<ion-footer>` is used in `app-footer-mobile.component.html`, and `<ion-content>` is used in `base.component.html` and some other pages which are not child of the Base page (such as Auth) and all native-like modal components (i.e., Root & Child components of `<ion-nav>`).

**Safe area:** The safe area of a display is the section that is not covered by the device's notch, status bar, or other elements that are part of the device's UI and not the app's. So it is required to consider having some space (by padding or margin) for our mobile app's header/footer '_ui_' components, so that their content can be visible in all devices. To do so, we can take advantage of Ionic's CSS variables: `var(--ion-safe-area-top)`, `var(--ion-safe-area-bottom)`. We can also use them to build our own Tailwindcss classes: `pt-[calc(var(--ion-safe-area-top)+1rem)]`. [Click here](https://ionicframework.com/docs/theming/advanced#safe-area-padding) to read more.

&nbsp;

[🔝](#our-boilerplate-apps-📦)

## Capacitor tips & tricks

**iOS Pod install:** When syncing the iOS native project, we may need to (re)init our `ios/App/Podfile`. To do so, we should run `cd apps/ng-boilerplate/ios/App` and then `pod install`.  
 **Tip!** Of course if 'cocoapods' is not already installed on our MacOS, first we should install it via [Homebrew](https://formulae.brew.sh/formula/cocoapods) by running `brew install cocoapods`, and then running `brew link --overwrite cocoapods`.

**iOS `Podfile`:** Some plugins require us to manually add their Pods in our `ios/App/Podfile`. If the installed plugin's package version (folder) is updated at the root of our workspace, and we also have already manually added its Pod in `ios/App/Podfile` (such as `CapacitorFirebaseAnalytics` Pod), then we need to update our Pod's path to refer to the correct installed package... Otherwise, we might get duplication error, when syncing the iOS native project.

**Utilize `ngZone`:** When dealing with Capacitor plugins (in '_util_' libs most of the times), it's recommended to utilize `ngZone` when listening to plugin's events. [Click here](https://capacitorjs.com/docs/guides/angular) to read more.

**Firebase-Analytics:** If we like to implement firebase-analytics for our app to track user's activities (log events when user is interacting with the UI in different libs), in our [Firebase Console](https://console.firebase.google.com/), we should (1) add a project and add iOS/Android app, (2) enter app's package name ('_Android package name_' or '_iOS bundle ID_' that is mentioned in in `apps/{app-name}/capacitor.config.ts` file) or optionally more info about our app, (3) register our app. Eventually, `google-services` file should be created and placed somewhere in our native projects. [Click here](https://github.com/capawesome-team/capacitor-firebase/tree/main/packages/analytics) to read more.

- **In Android, disable 'Analytics data collection' & 'Advertising ID collection':** In `apps/{app-name}/android/app/src/main/AndroidManifest.xml` file, define `firebase_analytics_collection_enabled` & `google_analytics_adid_collection_enabled` to false. In this way, you're disabling 'Analytics collection' & 'personalized advertising behavior' by default in the native Android app. Then whenever you collect the end-user consent, you can enable them in the app codes.
- **In iOS, disable 'Analytics data collection':** In `apps/{app-name}/ios/App/App/Info.plist` file, define `FIREBASE_ANALYTICS_COLLECTION_ENABLED` to false. In this way, you're disabling 'Analytics collection' by default in the native iOS app. Then whenever you collect the end-user consent, you can enable them in the app codes.

**Firebase-Analytics testing:** To test and make sure that Firebase events are successfully being logged into Firebase console, you should introduce the app that for Firebase while you're running it in 'Android Studio' & 'Xcode' simulators:

- For Android, run `adb shell setprop debug.firebase.analytics.app {APP ID}` and then run the app in simulator.
- For iOS, in Xcode: Product > Scheme > Edit Scheme… > Run > Arguments. Under "Arguments Passed On Launch" add: `-FIRAnalyticsDebugEnabled` and then run the app in simulator.

**Deep-linking:** If we like to implement deep-linking for our app to let `app.component.ts` understand where to route the user, when the native app is opened after a deep link is clicked... We should listen for the `appUrlOpen` event. [Click here](https://capacitorjs.com/docs/guides/deep-links#deep-link-routing-using-the-capacitor-app-api) to read more.

&nbsp;

**Some common native configurations:**

As we have also mentioned above, after installing some plugins, we need to modify some files in native projects as well. Here we like to specifically mention some of the most common modifications, plus some other things that we need to consider for adding a specific functionality to our native apps (e.g., deep-linking):

- [Firebase](https://capacitorjs.com/docs/guides/push-notifications-firebase#creating-a-project-for-your-app-on-firebase): If we like to have Firebase related plugins (Push-notification, Analytics, or Remote-config), `google-services` file should be created and placed somewhere in our native projects.

- [Push-notification](https://capacitorjs.com/docs/apis/push-notifications#ios): For this plugin, on iOS 'push notification capability' should be enabled in Xcode.

- [Deep-linking](https://capacitorjs.com/docs/guides/deep-links#creating-site-association-files): If we like our website to have some URLs that refer to a specific page in the app, `app-site-association` file ([`.well-known` file](https://capacitorjs.com/docs/guides/deep-links#website-configuration)) should be created and uploaded on the website.

- [Orientation](https://capacitorjs.com/docs/guides/screen-orientation): If we like to lock screen-orientation for our native app, some modifications should be applied to native projects.

**Tip!** There's also a good article about [how to deploy native apps for Angular](https://ionicframework.com/docs/angular/your-first-app/deploying-mobile) web projects. It may worth to have a look at it.

&nbsp;

[🔝](#our-boilerplate-apps-📦)

## Icons & Splash-Screen

In `project.json` file, we added `cap-assets` target for generating Icons & Splash-Screen of native projects and put them in their place (inside of the native projects).

And yes, we already added `src/assets/native` folder to contain sample Icons & Splash-Screen for the target to read from them. [Click here](https://capacitorjs.com/docs/guides/splash-screens-and-icons) to read more.

We also modified `android/.gitignore` and `ios/.gitignore` files to add generated Icons & Splash-Screen to the ignore list.

[🔙](../../README.md#faq)
