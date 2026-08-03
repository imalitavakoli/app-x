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

**What are they?** These are our **final products** in the workspace — real applications, not reusable feature libs. They live under `apps/` (every other type lives under `libs/`), they are buildable/deployable, and they compose functionalities to deliver value to end users.

They still carry a `type:app` tag in `project.json` / `.eslintrc.json` so module-boundary rules can treat them like the other types — but that is a workspace convention only. Conceptually they are apps, not libs.

**What other lib types they can import?** They can import ALL type of libs, except '_api_' types.

&nbsp;

[🔝](#library-types--their-relationship-📚)

## Versioning shared libs

Always keep all the codes for shared libraries in folders that have version numbers. For example, the path to the shared library codes should be like this: `libs/shared/util/{lib-name}/src/lib/{version}`.

**Note!** When you like to export your shared library codes (in the `libs/shared/util/{lib-name}/src/index.ts` file of the shared library), you can also export the codes from different version folders using alias names like this: `export * as V1NAME from './lib/v1/{lib-name}';`. But, this approach is not recommended, because (1) codes (such as constants, functions, interfaces, and etc.) cannot be imported individually; (2) the codes imported under an alias name, cannot be used in HTML templates directly; (3) You cannot export components, directives, and pipes under an alias name, so this forces you to use two different ways of importing codes, rather than having one single unique way of doing this. That's why we just simply include the version number directly in the TypeScript code that is going to be exported. For instance, `V1PopupComponent`, or `V1ToggleMeDirective` (and for components, directives, and pipes, of course in their selectors/names as well, for example `x-popup-v1`, or `xToggleMeV1`).

**Important!** If for any reason you decided to export a specific code under an alias name (although it's not recommended), search for your alias name across the entire workspace to ensure it has NOT been used previously! New alias names MUST be unique to prevent accidental conflicts in the projects.

The versioning folder names can be something like `v1`, `v2`, etc. They can also be something like `name-v1`, `my-thing-v2`, etc. Choosing the right versioning folder names depends on what your library is going to hold. For example, the `shared-ui-ng-directives` library is going to hold a variety of directives for different purposes. So, each directive can be inside its own versioning folder, such as `toggle-me-v1` folder name. But the `ng-popup` library is holding only one type of utility, which is the popup component. So, the versioning folder inside this library should be `v1`, `v2`, etc.

**Versioning the shared libraries reduces unexpected behaviors and conflicts** significantly! Updating pnpm dependencies or our NX workspace itself usually goes smoothly most of the time; they are on auto-pilot! However, shared libraries developed by different developers or gathered from various resources may not receive updates regularly. And when they do, their new behaviors could break multiple apps and libraries depending on them! But by versioning them, everything will keep working smoothly while allowing new apps and libraries to use newer versions.

**Note!** When you want to update an existing shared library, start by examining the library in the NX Graph ('focus' on the library) to see how many projects depend on it. If there are no more than 3 projects depending on it, you can update the library with breaking changes if needed, and then proceed to update those dependent projects. Otherwise, there's no need to bother yourself! Simply create a new version of the library.

**What criteria should we use to version a shared library?** The library's version doesn't necessarily refer to the library's version number itself! Let's clarify this further. For example, if we name a library `v1`, we're not necessarily referring to the library's version number (as some libraries from different resources might not have a version number at all). Instead, we mean that this is the first time we're using such a library with a specific behavior in our workspace, so this is the first version of the library that we know.

**Tip!** What about versioning app-specific libraries? They don't require the versioning folder structure! Since they belong to an app (domain), and apps themselves have versions. When a new version of an app is going to be released, those libraries must also be updated one way or another, especially if they need to change anything in their behaviour.

&nbsp;

[🔝](#library-types--their-relationship-📚)

## Functionality types

A functionality is a feature that we build for our applications. It is classified into one of the types below, and is made of one or more lib types from the Abstract and/or Visual groups ('_map_', '_data-access_', '_ui_', '_feature_', '_page_').

For example, a `profile` functionality that fetches the user's profile from the server and displays it across multiple Angular apps belongs to the shared domain and may look like this:

- `shared-map-ng-profile`
- `shared-data-access-ng-profile`
- `shared-ui-ng-profile`
- `shared-feature-ng-profile`
- `shared-page-ng-profile`

> **Important! — Library vs functionality (when PRD / TFS apply)**
>
> A **library type** (`api`, `util`, `map`, `data-access`, `ui`, `feature`, `page`, `app`) describes what a single lib is allowed to do.
> A **functionality type** (`abstract`, `visual`, `visual+`, `mixed`, `mixed+`) describes a product feature that may be one lib or several libs working together.
>
> **PRD and TFS docs exist only for functionalities** (`docs/x/{name}/`). They do **not** exist for a bare library that is not a functionality.
>
> - '_util_', '_api_', and '_app_' **never** form a functionality — alone or as part of one. Generating or editing one of these does **not** call for a PRD or a TFS.
>   - '_util_' / '_api_' are supporting libs (shared utilities / proxy doors).
>   - '_app_' is different again: it is a final product under `apps/` (see the '_app_' type above), not a functionality and not a reusable lib.
> - '_data-access_', '_ui_', '_feature_', and '_page_' **can** each be a functionality on their own (see the types below), or be part of a larger one — then a PRD/TFS **does** apply.
> - '_map_' is never a functionality by itself: if present, it always sits under an '_abstract_' / '_mixed_' / '_mixed+_' functionality together with '_data-access_'.
>
> Before writing or updating a PRD/TFS, ask: _"Is this a functionality (a product feature), or just a lib?"_ If it is only a '_util_', '_api_', or '_app_' lib — stop; no functionality docs.

> **Note!**
> Functionalities must **not** have their own '_util_' libs. Instead, they should reuse existing '_util_' libs. These libs contain low-level utilities that can be shared across multiple functionalities.
>
> By "their own" we mean libs named after the functionality itself. For example, the `profile` functionality must **not** have a `shared-util-ng-profile` lib.
>
> Similarly, functionalities do **not** have their own '_api_' or '_app_' libs:
>
> - '_api_' libs act only as proxies.
> - '_app_' libs are the actual applications (products) that combine multiple functionalities to deliver value to end users.

> **Note!**
> In most cases, functionalities also don't have their own '_page_' lib, because pages are meant to compose multiple functionalities.
>
> However, if a functionality represents an entire page by itself — for example, a `profile` page that only displays the user's profile — it is perfectly fine to have a `shared-page-ng-profile` lib.

**Natural entry lib (for using the functionality as a whole)**

When another lib wants to _use_ a functionality (interact with it — dispatch actions, select state, render its smart component / page, etc.), it should import that functionality's **natural entry lib**. That is the lib type that represents the functionality as a whole for interaction purposes.

This does **not** mean other libs of that functionality are never imported. For example, a '_map_' lib may still be imported so other libs can read its Map interfaces (read-only typing). The entry lib is about _using_ the functionality, not about every possible import.

&nbsp;

### 'abstract' type

**What is it?** A functionality made of Abstract-group libs only — '_data-access_', and optionally '_map_'.

It can exist with **only** a '_data-access_' lib when that lib's effects do not need to call API endpoints or load external assets (e.g. DEP JSON files). Typical examples: async work against Local Storage, SQLite, or similar local/device sources — anything other than fetching from the outside world via an API or loading an asset.

If the functionality **does** have a '_map_' lib (to call an API endpoint or load an asset), it **must** also have a '_data-access_' lib to store the fetched data. So valid shapes are:

- '_data-access_' only
- '_map_' + '_data-access_'

**Natural entry lib:** '_data-access_'.

&nbsp;

### 'visual' type

**What is it?** A functionality made of Visual-group libs — '_ui_' and/or '_feature_' — and **without** a '_page_' lib.

It does **not** require both. Valid shapes include:

- '_ui_' only — a presentational piece reused by different '_feature_' libs
- '_feature_' only — a smart lib that uses one or more '_data-access_' libs (from other, typically abstract, functionalities) and renders via other '_ui_' libs
- '_ui_' + '_feature_'

**Natural entry lib:**

- If the functionality has a '_feature_' lib → '_feature_'
- If it is '_ui_' only → '_ui_'

&nbsp;

### 'visual+' type

**What is it?** Same idea as `'visual'`, but it **definitely includes a '_page_' lib**. The presence of '_page_' is what makes it `'visual+'` rather than `'visual'`.

It can consist of '_ui_' and/or '_feature_' together with '_page_', or even of a '_page_' lib alone. Valid shapes include:

- '_page_' only
- '_page_' + '_ui_'
- '_page_' + '_feature_'
- '_page_' + '_ui_' + '_feature_'

**Natural entry lib:** '_feature_' when the functionality has one; otherwise '_page_' (e.g. page-only).

&nbsp;

### 'mixed' type

**What is it?** A mix of `'visual'` and `'abstract'`: the functionality **owns** its data **and must represent it**, but it is **not** a full page (no '_page_' lib).

It **must** have:

- '_data-access_' (owns the data/state)
- '_feature_' (represents that data — the smart side)

It **may** skip:

- '_map_' — same rule as `'abstract'`: only needed when talking to an API or loading an external asset; local/async sources can live in '_data-access_' alone
- '_ui_' — the '_feature_' may reuse '_ui_' libs from other functionalities to present the data it fetches

So the required core is '_data-access_' + '_feature_'; optional '_map_' and/or '_ui_'.

**Natural entry lib:** '_feature_'.

&nbsp;

### 'mixed+' type

**What is it?** A mix of `'visual+'` and `'abstract'`: the functionality **owns** its data **and** exposes it as a **page**.

It **must** have:

- '_page_'
- '_data-access_'

It **may** also have '_map_', '_ui_', and/or '_feature_' (same optional rules as `'mixed'` / `'visual+'` for those). The presence of '_page_' + owned '_data-access_' is what makes it `'mixed+'` rather than `'mixed'` or `'visual+'`.

**Natural entry lib:** '_page_' (the functionality is consumed as a page; other libs of it may still be imported for partial reuse — e.g. '_feature_' or '_data-access_').

&nbsp;

[🔝](#library-types--their-relationship-📚)
