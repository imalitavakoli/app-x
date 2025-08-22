```
................................................................................
................................................................................
....,*%%%%%%%%%%%%%%%%;..................,:;+*??%%%%??*+;,,.....................
.....,%@@@@@@@@@@@@@@@@*.............:+?S#@@@@@@@@@@@@@@@@#%*;,.................
.......+@@@@@@@@@@@@@@@@%,........:*S@@@@@@@@@@@@@@@@@@@@@@@@@#%+,..............
........:#@@@@@@@@@@@@@@@S:.....;%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#?:............
.........,%@@@@@@@@@@@@@@@@+..:%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@?,..........
...........*@@@@@@@@@@@@@@@@??@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#+.........
............;#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@S%??????%S@@@@@@@@@@@@@@@@?,.......
.............,%@@@@@@@@@@@@@@@@@@@@@@@@@@@%**?%S####S%?+*#@@@@@@@@@@@@@@%,......
...............*@@@@@@@@@@@@@@@@@@@@@@@@?+*%%???**?%S@@@S;?@@@@@@@@@@@@@@?......
................;#@@@@@@@@@@@@@@@@@@@@#;;**?%SS####S?**S@@*+S@@@@@@@@@@@@@;.....
.................,%@@@@@@@@@@@@@@@@@@@;,+**;:,,,:;*%##S+;#@S**?%S#@@@@@@@@%.....
...................*@@@@@@@@@@@@@@@@@%.::............,,,.,%@@@#S?*+%@@@@@@@,....
....................+@@@@@@@@@@@@@@@@*.....................,;;:;%#@;%@@@@@@:....
...................;#@@@@@@@@@@@@@@@@#;..........................,;:;@@@@@%,....
..................*@@@@@@@@@@@@@@@@@@@@*.............................:+*+::,....
................,%@@@@@@@@@@@@@@@@@@@@@@%,.............................,*S#:....
...............;#@@@@@@@@@@@@@@@@@@@@@@@@#;............................+#S;.....
..............*@@@@@@@@@@@@@@@@@@@@@@@@@@@@*....................................
............,%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%,..................................
...........;#@@@@@@@@@@@@@@@%%@@@@@@@@@@@@@@@#:.................................
..........+@@@@@@@@@@@@@@@@+..*@@@@@@@@@@@@@@@@+................................
........,%@@@@@@@@@@@@@@@S:....;#@@@@@@@@@@@@@@@?,..............................
.......:S@@@@@@@@@@@@@@@?,......,%@@@@@@@@@@@@@@@S:.............................
......+@@@@@@@@@@@@@@@@+..........+@@@@@@@@@@@@@@@@+............................
.....;%%%%%%%%%%%%%%%%:............:%%%%%%%%%%%%%%%%;...........................
................................................................................
................................................................................
```

&nbsp;

# Welcome 🙌

We are a monorepo! It's like a Lego puzzle game – we plug in the libs to the apps, and boom!

&nbsp;

# Introduction 🧠

Recently, I worked on an awesome project that taught me a lot! 🎉  
My main responsibility was to **architect and build a brand-new workspace from the ground up** — a monorepo containing a variety of apps and libraries.

- The apps are independent from one another.
- The libs (libraries) can depend on each other and be shared across apps.
- And the best part: the apps are cross-platform! 🚀 Code once and deliver everywhere — 🕸️ Web, 🍎 iOS, 🤖 Android, 🪟 Windows, 🐧 Linux, and 🙂 Mac.

In this repository, I'm sharing my overall experience through boilerplate/sample code, standards, and patterns that I developed to make such a workspace possible. These resources can be applied to almost any front-end project.

I'd like to thank my family, friends, and colleagues for their motivation and for giving me the chance to keep learning and growing as I developed. You are truly the best ❤️

**Tip!** Most of the apps & libs in the workspace are Angular based at the moment.

## How to get started

If you'd like to learn about the workspace as a whole, you're in the right place — just start reading this documentation.

If you're interested in what each Boilerplate app or Sample library does, and how to use them, simply open the corresponding project folder and check its `README.md` file.

## Files

- **Boilerplate apps**: Apps that have `x` prefix are Boilerplates. You don't need to touch them! They just exist as a source of inspiration. You can copy-paste them and start working on your newly generated files.

  - **ng-x-boilerplate-component**: Angular app that builds web-components. It can also be used as a web-app that lazy-loads its components and can be embedded in an iframe window.
  - **ng-x-boilerplate-desktop**: Angular app that builds desktop apps by using _Electron_.
  - **ng-x-boilerplate-mobile**: Angular app that builds mobile apps by using _Ionic/Capacitor_.
  - **ng-x-boilerplate-web**: Angular app that builds web apps.

&nbsp;

- **Sample libs**: Libs that have `x` prefix are Samples. You don't need to touch them! They just exist as a source of inspiration. You can copy-paste them and start working on your newly generated files.  
  **Tip!** Libs are collections of code with a predefined responsibility. They work together to provide larger functionality. In this workspace, I've included different sample functionalities that you can get inspired from. Some of these functionalities are built using all lib types. e.g., '_ui_' libs exist only to represent the user interface. They are 'dumb' libs that simply display data. '_feature_' libs are 'smart' libraries that fetch data and pass it to the UI.

  - **ng-x-credit**: This functionality is **built using abstract lib types**. Its '_data-access_' lib has 'multi-instance' state object structure which is suitable for storing multiple variation of data at the same time. e.g., you call a single API endpoint with different URL query parameters to fetch different responses, you would use a 'multi-instance' state object to store each response in a separate instance of the same state object. This kind of state structure is especially useful for '_data-access_' libs that are initialized by multiple '_feature_' libs at the same time.
  - **ng-x-profile-image**: This functionality is **built using visual lib types**. i.e., it is built by only 2 type of libs: '_ui_' to present its visual UI, and '_feature_' to initialize the UI and feed it with some data that is fetched from other shared '_data-access_' libs. So the lib itself didn't specifically need to have its own '_data-access_' lib.
  - **ng-x-profile-info**: This functionality is **built using all lib types**. Its '_data-access_' lib has 'single-instance' state object structure which is suitable for storing one single data at the same time.
  - **ng-x-users**: This functionality is **built using all lib types**. Its '_data-access_' lib has 'entity' state object structure which is suitable for CRUD operations.

&nbsp;

- **Other libs**: Libs that don't have `x` prefix are just here to do some generic works! They don't need to be kept as a source of inspiration, so feel free to modify them in any way that suites your project needs. Here I mention some of the important ones:

  - **ng-auth**: It's an abstract functionality. It takes care of the user's authentication process to log in to the app.
  - **ng-config**: It's an abstract functionality. It takes care of loading the DEP (Dependency) config file right at the initialization phase of the app. And then later, app or any other lib can access it to read its the loaded JSON file's data. It basically lets your apps & libs to have some dynamic configurations which are stored in a JSON file which is loaded at the run-time.
  - **ng-translations**: It takes care of loading your apps language JSON file. By default the language files are in the app's assets folder locally, but it can be loaded from anywhere else (by for example calling an API endpoint).
  - **ng-test**: It is an Angular '_page_' typed lib. It's a blank page that provides an isolated real-working play-ground for you right inside of your apps to do your tests in it! It is mostly useful when you wanna build a new lib. According to the workspace standards, the DoD (Definition of Done) for a lib is to have a ready-to-use copy-paste code in its `README.md` file which can be copied and pasted in the 'test' page and we can immediately see its results. Feel free to take a look at any of the shared libs `README.md` and copy-paste their HTML or TS codes into the 'test' page to see the lib's results.
  - **base**: It is a non-tech related '_ui_' typed lib. It holds the most generic CSS styles in it. Such as root variables, `html` or `body` styles, and 3rd-party CSS rules overrides as necessary.
  - **tailwindcss**: It is a non-tech related '_ui_' typed lib. It holds the TailwindCSS configurations and styles.
  - **framework8**: It is a non-tech related '_ui_' typed lib. It holds the Framework 8 (another side-project that is developed by me) styles and jQuery codes. Yes! Framework 8 was initially developed back in 2017 and I developed different functionalities for it (e.g., navigations, dropdowns, etc.) by using jQuery.
  - **ng-ionic**: It is an Angular '_util_' typed lib. It's suppose to hold all Ionic component wrappers in it. So we don't use Ionic components directly in our workspace... We use them in a wrapper, and then use the wrapper any where else.
  - **ng-directives**: It is an Angular '_ui_' typed lib. It's suppose to hold all Angular directives.
  - **ng-pipes**: It is an Angular '_ui_' typed lib. It's suppose to hold all Angular pipes.
  - **ng-bases**: It is an Angular '_util_' typed lib. It's suppose to hold all Angular base classes.
  - **ng-bases-model**: It is an Angular '_util_' typed lib. It's suppose to hold all Angular base interfaces that base classes use.
  - **ng-capacitor**: It is an Angular '_util_' typed lib. It's suppose to hold all Capacitor plugin wrappers in it. So we don't use Capacitor plugins directly in our workspace... We use them in a wrapper, and then use the wrapper any where else.
  - **ng-services**: It is an Angular '_util_' typed lib. It's suppose to hold all Angular services.

## Comments as keywords

In the workspace, I've added specific comments as keywords. These make it easier to find certain sections later and adjust the code beneath them according to your project requirements.

- `MOCK TEMP CODE:` — used to mock data. You can replace these with the actual implementation later.
- `shared-ui-framework8` — used for any code related to Framework 8, which requires jQuery. If you don't need this library and want to remove jQuery-related code, just search for this keyword and delete the corresponding code sections.

## Licenses

- **Code**: Licensed under the [MIT License](./LICENSE).
- **Documentation and other non-code content**: Licensed under [CC BY 4.0](./LICENSE-docs).

&nbsp;

# Mindset

- ## `1` [Monorepo](./docs/mindset/monorepo.md)
  - ### `— a` [What's a monorepo?](./docs/mindset/monorepo.md#whats-a-monorepo)
  - ### `— b` [Why choose an Integrated Monorepo?](./docs/mindset/monorepo.md#why-choose-an-integrated-monorepo)
  - ### `— c` [Advantages of an Integrated Monorepo?](./docs/mindset/monorepo.md#advantages-of-an-integrated-monorepo)
  - ### `— d` [Mindset behind an Integrated Monorepo?](./docs/mindset/monorepo.md#mindset-behind-an-integrated-monorepo)
  - ### `— e` [How do we address the downsides of using a technology?](./docs/mindset/monorepo.md#how-do-we-address-the-downsides-of-using-a-technology)

&nbsp;

# Introduction

- ## `1` [Folder structure](./docs/introduction/folder-structure.md)

- ## `2` [NX Console extension](./docs/introduction/nx-console-extension.md)

- ## `3` [WebNative extension](./docs/introduction/webnative-extension.md)

- ## `4` [Other extensions](./docs/introduction/other-extensions.md)

&nbsp;

# Getting Started

- ## `1` [Setting up the repository on a new machine](./docs/getting-started/setting-up-the-repository.md)

  - ### `— a` [Installing global dependencies](./docs/getting-started/setting-up-the-repository.md#installing-global-dependencies)
  - ### `— b` [Installing local dependencies](./docs/getting-started/setting-up-the-repository.md#installing-local-dependencies)
  - ### `— c` [Serve/build the Projects](./docs/getting-started/setting-up-the-repository.md#servebuild-the-projects)
  - ### `— d` [Opening the workspace (monorepo) in VSCode](./docs/getting-started/setting-up-the-repository.md#opening-the-workspace-monorepo-in-vscode)

- ## `2` [Library types & their relationship](./docs/getting-started/library-types-and-their-relationship.md)

  - ### `— a` [Types](./docs/getting-started/library-types-and-their-relationship.md#types)
    - `—— A` ['api' type](./docs/getting-started/library-types-and-their-relationship.md#api-type)
    - `—— B` ['util' type](./docs/getting-started/library-types-and-their-relationship.md#util-type)
    - `—— C` ['map' type](./docs/getting-started/library-types-and-their-relationship.md#map-type)
    - `—— D` ['data-access' type](./docs/getting-started/library-types-and-their-relationship.md#data-access-type)
    - `—— E` ['ui' type](./docs/getting-started/library-types-and-their-relationship.md#ui-type)
    - `—— F` ['feature' type](./docs/getting-started/library-types-and-their-relationship.md#feature-type)
    - `—— G` ['page' type](./docs/getting-started/library-types-and-their-relationship.md#page-type)
    - `—— H` ['app' type](./docs/getting-started/library-types-and-their-relationship.md#app-type)
  - ### `— b` [Versioning shared libs](./docs/getting-started/library-types-and-their-relationship.md#versioning-shared-libs)
  - ### `— c` [Useful shared libs](./docs/getting-started/library-types-and-their-relationship.md#useful-shared-libs)

- ## `3` [Designers related](./docs/getting-started/designers-related.md)
  - ### `— a` [Exporting brand-specific images](./docs/getting-started/designers-related.md#exporting-brand-specific-images)
  - ### `— b` [Defining brand-specific colors & styles](./docs/getting-started/designers-related.md#defining-brand-specific-colors--styles)
    - `—— A` [General color variables](./docs/getting-started/designers-related.md#general-color-variables)
    - `—— B` [Specific elements color variables](./docs/getting-started/designers-related.md#specific-elements-color-variables)
  - ### `— c` [UX edge decisions](./docs/getting-started/designers-related.md#ux-edge-decisions)

&nbsp;

# Guidelines

- ## `1` [PR (Pull Request) rules](./docs/guidelines/pr-rules.md)

  - ### `— a` [Code Modification PRs](./docs/guidelines/pr-rules.md#code-modification-prs)
  - ### `— b` [FIN PRs](./docs/guidelines/pr-rules.md#fin-prs)
  - ### `— c` [More best practices about PRs](./docs/guidelines/pr-rules.md#more-best-practices-about-prs)

- ## `2` [Lib backward compatibility](./docs/guidelines/lib-backward-compatibility.md)

- ## `3` [Available commands](./docs/guidelines/available-commands.md)

  - ### `— a` [Updating the whole workspace](./docs/guidelines/available-commands.md#updating-the-whole-workspace)
  - ### `— b` [Commands schema](./docs/guidelines/available-commands.md#commands-schema)
  - ### `— c` [Useful](./docs/guidelines/available-commands.md#useful)
  - ### `— d` [Angular related](./docs/guidelines/available-commands.md#angular-related)
    - `—— A` [General](./docs/guidelines/available-commands.md#general)
    - `—— B` [Generating apps](./docs/guidelines/available-commands.md#generating-apps)
    - `—— C` [Generating libs](./docs/guidelines/available-commands.md#generating-libs)
    - `—— D` [Generating components, services, directives, pipes, and other stuff in apps or libs](./docs/guidelines/available-commands.md#generating-components-services-directives-pipes-and-other-stuff-in-apps-or-libs)
    - `—— E` [Generating NgRx (our apps' root store & state feature) related files](./docs/guidelines/available-commands.md#generating-ngrx-our-apps-root-store--state-feature-related-files)
    - `—— F` [Schema](./docs/guidelines/available-commands.md#schema)
  - ### `— e` [Generating non-technology related libs](./docs/guidelines/available-commands.md#generating-non-technology-related-libs)
  - ### `— f` [_Optional!_ Installing & connecting to NX Cloud](./docs/guidelines/available-commands.md#optional-installing--connecting-to-nx-cloud)

- ## `4` [Common tasks](./docs/guidelines/common-tasks.md)

  - ### `— a` [Generate & build a whole new functionality](./docs/guidelines/common-tasks.md#generate--build-a-whole-new-functionality)
  - ### `— b` [Consider an API error as an exception](./docs/guidelines/common-tasks.md#consider-an-api-error-as-an-exception)
  - ### `— c` [API response schema changes](./docs/guidelines/common-tasks.md#api-response-schema-changes)
  - ### `— d` [A property is added/removed in API response schema](./docs/guidelines/common-tasks.md#a-property-is-addedremoved-in-api-response-schema)
  - ### `— e` [UI/UX changes](./docs/guidelines/common-tasks.md#uiux-changes)
  - ### `— f` [Add new image/icon asset for a lib](./docs/guidelines/common-tasks.md#add-new-imageicon-asset-for-a-lib)
  - ### `— g` [Add new DEP config for a lib](./docs/guidelines/common-tasks.md#add-new-dep-config-for-a-lib)
  - ### `— h` [Add new communication interface for a lib](./docs/guidelines/common-tasks.md#add-new-communication-interface-for-a-lib)
  - ### `— i` [Generate & build a web-component](./docs/guidelines/common-tasks.md#generate--build-a-web-component)
  - ### `— j` [Update a web-component](./docs/guidelines/common-tasks.md#update-a-web-component)
  - ### `— k` [Update the workspace](./docs/guidelines/common-tasks.md#update-the-workspace)

- ## `5` [Naming conventions](./docs/guidelines/naming-conventions.md)

  - ### `— a` [Folders](./docs/guidelines/naming-conventions.md#folders)
  - ### `— b` [Coding](./docs/guidelines/naming-conventions.md#coding)
  - ### `— c` [Styling](./docs/guidelines/naming-conventions.md#styling)

- ## `6` [Best practices](./docs/guidelines/best-practices.md)
  - ### `— a` [Mindset](./docs/guidelines/best-practices.md#mindset)
  - ### `— b` [Documenting](./docs/guidelines/best-practices.md#documenting)
  - ### `— c` [Organizing](./docs/guidelines/best-practices.md#organizing)
  - ### `— d` [State management](./docs/guidelines/best-practices.md#state-management)
  - ### `— e` [Error handling](./docs/guidelines/best-practices.md#error-handling)

&nbsp;

# FAQ

- ## `1` [Directories & files](./docs/faq/directories-and-files.md)

  - ### `— a` [Directories](./docs/faq/directories-and-files.md#directories)
  - ### `— b` [Files](./docs/faq/directories-and-files.md#files)

- ## `2` [Our Boilerplate app(s)](./docs/faq/boilerplate-apps.md)

  - ### `— a` [How to have a new app](./docs/faq/boilerplate-apps.md#how-to-have-a-new-app)
  - ### `— b` [How most of our Boilerplate apps got created](./docs/faq/boilerplate-apps.md#how-most-of-our-boilerplate-apps-got-created)
  - ### `— c` [How to integrate Ionic & Capacitor](./docs/faq/boilerplate-apps.md#how-to-integrate-ionic--capacitor)
  - ### `— d` [How to integrate Electron](./docs/faq/boilerplate-apps.md#how-to-integrate-electron)
  - ### `— e` [How to install Capacitor plugins](./docs/faq/boilerplate-apps.md#how-to-install-capacitor-plugins)
  - ### `— f` [Ionic tips & tricks](./docs/faq/boilerplate-apps.md#ionic-tips--tricks)
  - ### `— g` [Capacitor tips & tricks](./docs/faq/boilerplate-apps.md#capacitor-tips--tricks)
  - ### `— h` [Icons & Splash-Screen](./docs/faq/boilerplate-apps.md#icons--splash-screen)
