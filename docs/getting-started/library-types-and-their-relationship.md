[🔙](../../README.md#getting-started)

# Library types & their relationship 📚

With the help of `.eslintrc.json` and NX `@nx/enforce-module-boundaries` rule inside of it, we can define which lib can depend on which other one. We can actually set the lib's tags in `project.json` file of each lib (e.g., `["type:feature", "domain:shared"]`) to define the lib's boundary. In our workspace, we've defined boundary rules in 2 dimensions, that is '_type_' & '_domain_'.

- '_domain_' dimension: It's for horizontal slicing. It specifies to what app the lib belongs to. So basically we have 1 domain per app + a 'shared' domain. Libs with 'shared' domain, can be imported in any other domains.
- '_type_' dimension: It's for vertical slicing. It specifies the libs responsibility. In the following we explain what each type means.

**Tip!** We have inspired our libs categorization from NX [Library Types](https://nx.dev/concepts/more-concepts/library-types) and [Using Nx at Enterprises](<https://nx.dev/concepts/more-concepts/monorepo-nx-enterprise#type-(what-is-in-the-library)>) articles.

&nbsp;

[🔝](#library-types--their-relationship-📚)

## Types

In overall we have 8 library types which can be categorized into 3 groups:

- **Abstract**: '_util_', '_map_', and '_data-access_' types fall into this group; because their responsibility is to hold logic mostly.
- **Visual**: '_ui_', '_feature_', and '_page_' types fall into this group; because their responsibility is to represent something visually mostly.
- **Root**: '_api_', and '_app_' types fall into this group; because their responsibility is to connect or bootstrap everything.

&nbsp;

### 'api' type

**What are they?** These are libs that does not contain anything and instead only acts a proxy that exposes just a few things! Each type of lib can only import some limited lib types, but with '_api_' libs, we can open up a very small door to workaround such limitation whenever required.

**What other lib types they can import?** They can import ALL type of libs, except '_util_', and '_api_' types.

&nbsp;

### 'util' type

**What are they?** These are libs that contain low-level utilities used by many libs and apps. They can contain services or non-technology related vanilla JavaScript utility functions that are not specifically related to UI. e.g., encapsulate functions that format dates or detect user's device.

**What other lib types they can import?** They can import '_util_', '_map_', and '_api_' types.

**Tip!** This lib can contain components/services that don't need '_data-access_' typed libs, and if such libs are (slightly) needed, they can be accepted as an input, method argument, or imported from '_api_' typed libs.

&nbsp;

### 'map' type

Maps will load external resources (e.g., JSON files), and if required, map the object structure that they have fetched (sometimes by the help of '_util_' libs)! In simple terms, they prepare object structures in a way that satisfies '_ui_' libs inputs.

**What are they?** These are libs that contain codes for interacting with back-end or external resources.

**What other lib types they can import?** They can import '_util_', and '_map_' types.

**Tip!** '_map_' libs hold interfaces (e.g., `lib-name.interfaces.ts`) files. They can be used by '_ui_' and '_data-access_' libs later.

&nbsp;

### 'data-access' type

They initialize '_map_' libs to call their methods and fetch data from server (or external resources).

**What are they?** These are the libs that hold state management codes of the app, '_page_', or '_feature_' lib (NgRx-related code). They can also hold some data-access related services such as '_guards_' and '_interceptors_'.

**What other lib types they can import?** They can import '_util_', '_map_', and '_data-access_' types.

**Note!** Generate '_guards_' and '_interceptors_' (or similar files) inside of the '_data-access_' libs (their code can sit beside the `+state` folder of the lib), because these services may (heavily) need data access, and it makes sense to hold them in such libs.

&nbsp;

### 'ui' type

UIs import '_map_' lib interfaces (if required) for their own input types, and represent an UI in their HTML template.

**What are they?** These are stupid libs! They only contain stylesheets, presentational components, directives, and pipes. If they are components (such as Angular components), they don't have access to data sources! Instead they receive some inputs, and present UI as an output. And yes! They can also be some non-technology related libs that just hold `.css` or `.scss` files.

**What other lib types they can import?** They can import '_util_', '_map_', and '_ui_' types.

**Tip!** They can also hold some mock-data objects (e.g., in files such as `lib-name.mocks.ts`) to make their own testing phase easily.

&nbsp;

### 'feature' type

Features initialize '_ui_' libs in their HTML template, and initialize '_data-access_' libs in their TypeScript code. They fetch real data from server and provide it as an input to the '_ui_' libs.

**What are they?** These are smart (with access to data sources) libs! They are some smart components (which present an independent functionality) that can also access data sources through '_data-access_' libs.

**What other lib types they can import?** They can import ALL type of libs except '_page_', and '_api_' types.

**Tip!** These libs can simply import and use _data-access_ libs inside themselves, while those libs' state object already has been provided as the app's _Root Store_, or one page's _Feature Store_.

&nbsp;

### 'page' type

Pages initialize multiple '_feature_' libs to bring up a much bigger functionality.

**What are they?** They are basically pages of an app! They can also access data sources through '_data-access_' libs. These libs are app specific (most of the times) and live inside of an app's specific path. e.g., `libs/ng-boilerplate/page/home/`.

**What other lib types they can import?** They can import ALL type of libs, except '_api_' types.

**Note!** Pages are the ONLY lib types that can navigate to different app routes! How they can understand when to navigate? Well, the initialized '_feature_' libs may output an event (e.g., based on user interactions), pages listen to those outputs, and handle them.

**Tip!** Pages (usually) don't need to import other pages (other '_page_' libs) into themselves! If they have child pages, they can simply hold them inside themselves (i.e., there's no need to create separated libs for each page of an app).

&nbsp;

### 'app' type

**What are they?** These are actually our apps and not libs! Technically, apps are also considered as libs since they are buildable libraries within the workspace.

**What other lib types they can import?** They can import ALL type of libs, except '_api_' types.

&nbsp;

[🔝](#library-types--their-relationship-📚)

## Versioning shared libs

Always keep all the codes for shared libraries in folders that have version numbers. For example, the path to the shared library codes should be like this: `libs/shared/util/{lib-name}/src/lib/{version}`.

**Note!** When you like to export your shared library codes (in the `libs/shared/util/{lib-name}/src/index.ts` file of the shared library), you can also export the codes from different version folders using alias names like this: `export * as V1NAME from './lib/v1/lib-name';`. But, this approach is not recommended, because (1) codes (such as constants, functions, interfaces, and etc.) cannot be imported individually; (2) the codes imported under an alias name, cannot be used in HTML templates directly; (3) You cannot export components, directives, and pipes under an alias name, so this forces you to use two different ways of importing codes, rather than having one single unique way of doing this. That's why we just simply include the version number directly in the TypeScript code that is going to be exported. For instance, `V1PopupComponent`, or `V1ToggleMeDirective` (and for components, directives, and pipes, of course in their selectors/names as well, for example `x-popup-v1`, or `xToggleMeV1`).

**Important!** If for any reason you decided to export a specific code under an alias name (although it's not recommended), search for your alias name across the entire workspace to ensure it has NOT been used previously! New alias names MUST be unique to prevent accidental conflicts in the projects.

The versioning folder names can be something like `v1`, `v2`, etc. They can also be something like `name-v1`, `my-thing-v2`, etc. Choosing the right versioning folder names depends on what your library is going to hold. For example, the `shared-ui-ng-directives` library is going to hold a variety of directives for different purposes. So, each directive can be inside its own versioning folder, such as `toggle-me-v1` folder name. But the `ng-popup` library is holding only one type of utility, which is the popup component. So, the versioning folder inside this library should be `v1`, `v2`, etc.

**Versioning the shared libraries reduces unexpected behaviors and conflicts** significantly! Updating pnpm dependencies or our NX workspace itself usually goes smoothly most of the time; they are on auto-pilot! However, shared libraries developed by different developers or gathered from various resources may not receive updates regularly. And when they do, their new behaviors could break multiple apps and libraries depending on them! But by versioning them, everything will keep working smoothly while allowing new apps and libraries to use newer versions.

**Note!** When you want to update an existing shared library, start by examining the library in the NX Graph ('focus' on the library) to see how many projects depend on it. If there are no more than 3 projects depending on it, you can update the library with breaking changes if needed, and then proceed to update those dependent projects. Otherwise, there's no need to bother yourself! Simply create a new version of the library.

**What criteria should we use to version a shared library?** The library's version doesn't necessarily refer to the library's version number itself! Let's clarify this further. For example, if we name a library `v1`, we're not necessarily referring to the library's version number (as some libraries from different resources might not have a version number at all). Instead, we mean that this is the first time we're using such a library with a specific behavior in our workspace, so this is the first version of the library that we know.

**Tip!** What about versioning app-specific libraries? They don't require the versioning folder structure! Since they belong to an app (domain), and apps themselves have versions. When a new version of an app is going to be released, those libraries must also be updated one way or another, especially if they need to change anything in their behaviour.

&nbsp;

[🔝](#library-types--their-relationship-📚)

## Useful shared libs

Shared libs are the libraries that will be utilized across multiple apps and other libraries. Some of these libs will be used more commonly than others. Here are some important notes to keep in mind about such libs.

- `libs/shared/ui/tailwindcss/` lib: In this lib, you can find the following CSS classes, which can be used in special occasions:

  - In `components-general.scss` `e-h-usual`: To show any heading in `1.875rem = 30px` size (`<h4>` size). Our apps use this heading font size a lot... So for example, to have a page heading, we can semantically use `<h1>` HTML tag, but set `e-h-usual` CSS class for it.
  - In `components-general.scss` `e-ecode`: To show the app's UX edge decisions codes. It adds some styles to the code.
  - In `components-general.scss` `e-notrans`: To show the texts that are not being read from the translations lib, and are hard-coded instead. It makes finding such texts easier across the app to plan for adding their translations later.  
    **Tip!** If you just want to mark such texts in your code (without adding any css styles), you can just simply write `TODO:TRANS` comment above your text, whether it's in HTML or TS.

- `libs/shared/ui/base/` lib: In this lib, you can find the following CSS classes, which can be used in special occasions:

  - In `mains.scss` `e-svg`: To define some default styles for the direct `<svg>` element that is loaded in `<inline-svg>` components that have `e-svg` CSS class.

[🔙](../../README.md#getting-started)
