[🔙](../../README.md#guidelines)

# Best Practices 👌

To improve teamwork, we follow some best practices:

**Tip!** Feel free to get inspired from our Boilerplate app files (its pages, and its dependent libs) for writing `README.md` files or '_jsdoc_' comments, documenting, or doing other best practices.

&nbsp;

[🔝](#best-practices-👌)

## Mindset

- **Prioritize docs**. Before generating/updating a project (app or lib), always begin by writing or updating its `README.md` (for apps, it's also essential to update the `CHANGELOG.md` file).  
  **Note!** Immediately after generating a new app/lib, update `CODEOWNERS` file as well. This ensures that all developers are aware of who owns the code initially for the newly created app/lib. This helps the Product Manager (PM) identify who should be assigned future upgrade or bug fix tasks for a feature in the workspace.

&nbsp;

- **Prefer many files with fewer lines**. It's preferable to have numerous libs/files rather than having a single lib/file with an extensive amount of code lines.

&nbsp;

- **Lightweight front logic, heavy behind the scenes codes**. Aim to keep '_feature_'/'_page_' libs lightweight. Instead, prepare all necessary data for presentation within '_map_'/'_data-access_' libs as much as possible. In this way, whenever you like your components' HTML templates to get updated, as soon as a feature state's property changes (in the '_data-access_' lib), you don't have to subscribe to the whole feature state in your component's TS code, in order to extract its data! Instead, you can just directly use the '_data-access_' lib's state object properties right inside your component's HTML template (e.g., `(translationsFacade.datas$ | async)?.allLangs?.codes`).

&nbsp;

- **Always use 'Abstract' libs when fetching data from the outside world**. So if you want to load a JSON file or call API endpoints, NEVER use TS classes, services, or even creating a '_util_' lib! Fetching data from the outside world MUST always happen through this funnel: '_map_' lib → '_data-access_' lib. '_map_' lib fetches the data (and maps it, if necessary), then '_data-access_' lib stores the data and makes it available to other libs. In this way, updating/maintaining such behaviours would be consitant and easy across the workspace.

&nbsp;

- **Only '_page_' libs' inputs come as URL Query Params**. So NEVER read URL Query Params in '_feature_' or '_ui_' libs! If you need that, you read them in your '_page_' lib, and pass them to other libs through its inputs.

&nbsp;

[🔝](#best-practices-👌)

## Documenting

- **Write descriptive comments**. Add comments that explain why a variable or function exists and why it behaves the way it does. These comments not only assist other team members but also help developers understand their own code in the future when they revisit it.

- **Use self-explanatory variable and function names**.

- **Use '_jsdoc_' more frequently**.

- **For CSS rules, its HTML sample usage as a comment**, right before declaring the CSS rule.

- **Add '_JSDoc_' comments for internal extra files for a lib**. When creating an internal extra file (it can be a `.scss`, `.ts`, or any type of file) for your lib which is not usual for that lib type (e.g., having a `v1/_util/formatter.ts` for a '_ui_' typed lib is not a usual file that would exist in all '_ui_' libs), right at the top of the file, as a '_JSDoc_' comment, explain (1) why that file is created at the first place, and (2) what it's going to do in general.

&nbsp;

- **When creating an app, write its `README.md` file**. Try to explain (1) what is it about, (2) version, (3) user flow of the app, (4) UX edge decisions that have been made based on some special scenarios that may happen in the app to show a message or do an action according to a known server error or a conclusion that we've came up with, (5) designers related stuff which are listing '_unique brand-specific images_' and '_unique brand-specific color & style variables_' that the app has.  
  **Tip!** 'User flow' section of your description: If you have explained it somewhere else in an external resource/webpage (such as a Confluence page), it can be something like: _Click here to read more about the app's user-flow. Click here to read more about the app's back-API based on the user-flow._  
  **Tip!** Feel free to get inspired from our Boilerplate app for writing your app's `README.md` file.

&nbsp;

- **When creating a lib, write its `README.md` file**. Try to explain (1) what is it about, (2) instruction on how apps or other libs can use it step by step, (3) what are its important requirements (dependencies), and (4) write its ready-to-use copy-paste HTML/TS/CSS codes that can be pasted in our test page and let us see the results.  
  **Note!** We can see a lib's dependencies via the NX graph (by running `nx graph` command), so we don't need to write ALL of the dependencies in the lib's `README.md`! But it's a good practice to write the important ones, while explaining those important dependencies' purpose! i.e., it's a good idea to not only mention those dependencies names, but also explain why they have been used inside of the lib too! This helps team members to understand the libs' relationships even better.  
  **Tip!** If your '_ui_' lib has CSS variables, let's also have CSS copy-paste codes in the lib's `README.md` file. Apps will refer to your lib's docs in their own `README.md` file 'Designers related' section to list unique brand-specific color & style variables that the app offers.  
  **Tip!** For '_page_' libs also explain whether they are guarded or not (visibility). i.e., specify to whom they should be shown, and to whom they should be hidden.  
  **Tip!** If the lib that you're writing its `README.md` file, depends on another lib, then avoid detailing the implementation of the dependent lib. For example, don't include its variable names, action names, or other specifics. Instead, simply mention the dependent lib by name and explain how your library interacts with it in a general way. If possible, don't initialize the dependent lib in your copy-paste code, and just use a placeholder instead. Team members can always refer to the dependent lib's own docs for implementation details... This approach ensures your documentation stays focused on your own lib, while also reducing maintenance overhead. If the dependent lib changes in the future, you won’t need to update multiple README.md files across the workspace.

&nbsp;

[🔝](#best-practices-👌)

## Organizing

- **Decision about how to use 3rd-party frameworks**. When building UI, it's important to maintain consistency across different libraries created by multiple front-end developers. Here's the priority, from top to bottom, when using different 3rd-party frameworks:
  - Our own shared libs for building unique-designed UIs across our company. Such as simple inputs, cards, buttons, links, preloader, etc.
  - [daisyui](https://daisyui.com/) for building simple UIs, such as toggle, carousel, accordion, etc.
  - [ionicframework](https://ionicframework.com/) for building more common complex UIs, such as alert, menu, etc.
  - [material.angular](https://material.angular.io/) for building less common complex UIs, such as table, sort header, paginator, etc.
  - [primeng](https://primeng.org/) for building rare complex UIs, such as editor, color picker, drag & drop, etc.

&nbsp;

- **When you like to install & use a 3rd-party lib, ideally first contact the Workspace Specialist** and ask their ideas about it, then install it on the workspace.  
  **Tip!** Make sure that the lib you wanna use is popular and gets updated frequently before starting to use it. Because unpopular libs may get deprecated soon and slow down our development process in the long run.

&nbsp;

- **When defining routes in an app, define them in order of user flow**. e.g., first define `home`, then `auth`, then `dashboard` (because users first visit Home, then they click to login and visit Auth, and eventually they will be redirected to Dashboard). This helps team members to understand the app's user flow easier by just looking out the routes.

&nbsp;

- **Import component/service dependencies in a consistent order from top to bottom**. This practice not only makes it easier for a new developer to read & understand the logic of an older component/service, but it also helps unify the structure of components/services across the workspace.

  The following order is recommended:
  - Lib's technology related dependencies (e.g., Angular core, common, router, rxjs, etc.).
  - Our workspace libs.
  - Lib's internal files.

  Regarding our workspace libs, the following order is recommended, based on the types of libs:
  - '_util_'
  - '_map_'
  - '_ui_'
  - '_data-access_'
  - '_feature_'

  Why this order? '_util_' libs are usually the lightest and most broadly used across the workspace, so they come first. Then '_map_' libs come, because they often provide interfaces that are utilized in UIs & Features. Then '_ui_' libs come, because they are primarily consumed by Pages, Features, or other UIs. Then '_data-access_' libs come, because they supply the data of Features. And finally '_feature_' libs come, because they are the last piece of the puzzle and rely on almost any other type of libs.

&nbsp;

- **Decision about which version of shared libs to import**. When building different types of libraries, you may need to import other shared libraries that already exist in the workspace. If multiple versions of a library are available, you should generally use the latest version, unless there is a clear and justified reason not to do so.

&nbsp;

- **Component's HTML template is the one who makes the decisions to what to render & how to style**. So decisions to (1) show a content by `@if` blocks, (2) use some CSS classes or styles by `[ngClass]` or `[ngStyle]`, and (3) DEP config reading (e.g., `(configFacade.dataConfigDep$ | async)?.assets?.thisAuthImgBg`), all should happen in your component templates. But some other stuff, like calculating two values and returning a new value, should happen in your component logic itself.

&nbsp;

- **When writing styles, use TailwindCSS directly in HTML**. If the styles are repetitive, define a CSS class for the component's HTML element and use TailwindCSS `@apply`. If you need to define custom CSS variables (for example, when requested by a designer), only then use vanilla CSS where necessary.

&nbsp;

- **Have consistent folder/file structure for globally exposed files in '_ui_' or '_feature_' libs**. If the lib needs to expose more than one main component, each component should have its own folder directly in the version folder (e.g., v1). So basically there's no component files (`.ts`, `.html`, `.scss`, etc.) directly inside of the version folder. This structure keeps internal component files organized and makes it clear how many components the lib is exposing globally right at the first glance. And if the lib also exposes other files (e.g., interfaces, mocks, or utility functions), they can rest in either the version folder or a `util` sub-folder.  
  **Tip!** If your lib has technology related prefix (e.g., `ng-`), then you don't need to repeat the prefix for the inner folders. So the lib's main folder (which hold all of the lib files including `project.json` and others) can be `ng-chart`, but inner folder names (which hold the globally exposed components) can be `chart-wizard` or `chart-popup`.  
  For example:
  - `v1/libname-wizard/libname-wizard.component.ts`
  - `v1/libname-popup/libname-popup.component.ts`
  - `v1/util/funcs/libname-formatters.func.ts`
  - `v1/util/funcs/libname-validators.func.ts`
  - `v1/util/mocks/libname-something1.mocks.ts`
  - `v1/util/mocks/libname-something2.mocks.ts`
  - `v1/libname.interfaces.ts`

&nbsp;

- **Have consistent folder/file structure for private internal files in '_ui_' or '_feature_' libs**. If the lib needs to be broken down into smaller components (or has lots of TS code files to hold different interfaces, mocks, or utility functions), but all of those files are meant to be for internal usage of the lib itself (i.e., they are NOT useful to be exposed globally across the workspace), then the ones which exist directly in the version folder of the lib should have '\_' prefix for their file name (e.g., `_libname.interfaces.ts`), and the ones which rest in their own respective folder should have '\_' prefix for their folder name (e.g., `_feature`).  
  **Tip!** If your lib has technology related prefix (e.g., `ng-`), then you don't need to repeat the prefix for the inner folders. So the lib's main folder (which hold all of the lib files including `project.json` and others) can be `ng-chart`, but inner folder names (which hold the globally or internally exposed components) can be `chart` or `wizard`.  
  For example:
  - `v1/libname/libname.component.ts` (this is the lib's main component that is exposed globally)
  - `v1/_feature/wizard/wizard.component.ts` (this component is a '_feature_' one)
  - `v1/_feature/popup/popup.component.ts`
  - `v1/_ui/button/button.component.ts` (this component is a '_ui_' one)
  - `v1/_ui/button/button.interfaces.ts` (this interface is being used by the 'button' component only)
  - `v1/_util/formatter.ts` (this TS file is a '_util_' one, which contains some capsulated utility functions)
  - `v1/_libname.interfaces.ts` (this interface is being used by multiple internal components, utilities, or services)
  - `v1/_util/mocks/something1.mocks.ts`
  - `v1/_util/mocks/something2.mocks.ts`

&nbsp;

- **If texts, numbers, or dates should get manipulated, it's better to do that inside of '_ui_' libs**, rather than '_feature_' libs! Most of the times '_feature_' libs would get complicated as they're dealing with data... So it's always better to simplify their job as much as possible and put any kind of UI related logic right inside of '_ui_' libs.

&nbsp;

- **Use String, Number, and Boolean types for inputs of '_feature_' libs** as much as possible, and NOT Arrays or Objects, unlike '_ui_' libs' inputs! ! Because it simplifies building their web-component Core '_feature_' lib (if the lib is going to be a web-component).

&nbsp;

- **In mobile app development, use our own '_ui_' Ionic lib** (`shared-ui-ng-ionic`) as a wrapper to use the original Ionic components. This approach reduces other lib's dependencies to Ionic and eases updating Ionic components.

&nbsp;

- **In mobile app development, use our own '_util_' Capacitor lib** (`shared-util-ng-capacitor`) as a wrapper to use the original Capacitor classes. This approach reduces other lib's dependencies to Capacitor and eases updating Capacitor classes.

&nbsp;

[🔝](#best-practices-👌)

## State management

Here's the data-flow, when you wanna show real (NOT mock) data in your '_ui_' components' HTML templates:  
'_map_' lib > '_data-access_' lib > '_feature_'/'_page_' lib > '_ui_' lib.

&nbsp;

### When should we include certain mapped API response properties in '_map_' libs?

You should do this when the values of those properties directly originate from the API response. In simpler terms, in '_map_' libraries, you retrieve data from the API and then map (proxy) that data. This involves: (1) Removing any unnecessary properties; (2) renaming certain properties for clarity, if necessary; (3) adding new properties by extracting data from the fetched information, making it easier to use them in the components' HTML templates later.

&nbsp;

### When should we incorporate selectors in '_data-access_' libs?

You should do this when you require computed selectors based on the available feature state object. e.g., In Angular '_data-access_' libraries, you primarily integrate NgRx codes, such as reducers, actions, selectors, and effects.

&nbsp;

### Handling multiple API endpoints

If you need to make calls to multiple API endpoints (for example, if these calls are related, like various authentication API endpoints residing in a single '_map_' library), then you should define multiple mapped interfaces within that single '_map_' library. Subsequently, in your '_data-access_' lib, you save each received data from these API calls as a new property in the 'reducer' file.

&nbsp;

### Sync/async jobs

In your '_data-access_' lib, if you need to modify additional properties in your state object (**synchronous job**) when success/failure actions related to another property are dispatched, you should handle this in the **'reducer' file**.

In your '_data-access_' lib, if you need to call other actions or store something in Local Storage (**asynchronous job**) when success/failure actions related to a property are dispatched, you should handle this in the **'effect' file**.

&nbsp;

### How to use the state object properties?

You can update different parts of your component's HTML template easier, by using some simple `@if` blocks. As an example, for showing `data1` in your '_page_' lib, here's what you can do:

- If you're dealing with multi-instance '_data-access_' lib:
  - To show a loading graphic, set `(libNameFacade.entityLoadedLatest$('g') | async)?.data1 === false` or `!(libNameFacade.entityLoadeds$('g') | async)?.data1` condition.
  - To show the loaded data, set `(libNameFacade.entityDatas$('g') | async)?.data1` condition.  
    **Tip!** In '_feature_' libs, you can do this, to pass real data to the initialized '_ui_' lib as its input value.
  - To show an error graphic, set `(libNameFacade.entityErrors$('g') | async)?.data1` condition.  
    **Tip!** In '_feature_' libs, you can do this, to show an error message to the user, if the lib's `showErrors` input was true.
- If you're dealing with single-instance '_data-access_' lib:
  - To show a loading graphic, set `(libNameFacade.loadedLatest$ | async)?.data1 === false` or `!(libNameFacade.loadeds$ | async)?.data1` condition.
  - To show the loaded data, set `(libNameFacade.datas$ | async)?.data1` condition.  
    **Tip!** In '_feature_' libs, you can do this, to pass real data to the initialized '_ui_' lib as its input value.
  - To show an error graphic, set `(libNameFacade.errors$ | async)?.data1` condition.  
    **Tip!** In '_feature_' libs, you can do this, to show an error message to the user, if the lib's `showErrors` input was true.

If in your component's TS code, you also need to subscribe to your lib's state changes (`entity$('g')` for multi-instance, and `state$` for single-instance '_data-access_' libs), then you can easily check each data (e.g., `data1`) individually, only when the action which is related to that data is already called (i.e., `state.loadedLatest.data1` is truthy):

```ts
// A multi-instance 'data-access' lib.
// NOTE: Unlike single-instance 'data-access' libs which you need to subscribe
// to `state$` observable most of the times, in multi-instance libs, you don't
// need that observable... Instead you subscribe to `entity$('g')`.
this.libNameFacade.entity$('g').subscribe((state) => {
  if (state.loadedLatest.data1 && state.datas.data1) {
    // Do something...
  }
});

// A single-instance 'data-access' lib.
this.libNameFacade.state$.subscribe((state) => {
  if (state.loadedLatest.data1 && state.datas.data1) {
    // Do something...
  }
});
```

&nbsp;

[🔝](#best-practices-👌)

## Error handling

Depnding on what type of lib we are building, error handling is different:

- **'_map_' libs**: Whenever we want to receive the API response (after calling an endpoint), we also need to use `catchError` operator to handle the error and log it.

```ts
getSomething(
    url: string,
  ): Observable<MapSomething> {
    // Here's the endpoint
    const endPoint = `${url}/something`;

    // Let's send the request
    return this._http.get<ApiSomething>(endPoint).pipe(
      map((data) => {
        return this._mapSomething(data);
      }),
      catchError((err) => {
        const errParsed = this._parsedError(err); // Try parsing the error to see if it's a custom (expected) server error.
        let errToLog = err.message || undefined;
        if (errParsed && errParsed['code']) errToLog = errParsed['code'];
        this._logFailure(errToLog, err, 'GET', undefined, lib);
        console.error('@LibName/getSomething:', err.message || err); // NOTE: Log the error message (when available) to keep 'WebNative' logs easier to read.
        return throwError(() => errToLog || err.message || err);
      }),
    );
  }
```

- **'_feature_' libs**: They should have an input called `showErrors` to know whether to show error messages in their HTML template (via a popup as an example) or not, and an output called `hasError` to emit any probable errors that they receive from '_data-access_' libs. e.g., `this.hasError.emit({ key: facadeMethodName, value: errorMsg });`.

- **Core '_feature_' web-component libs**: They should pass `showErrors` input of the their inner initialized '_feature_' lib as `false` by default, because web-components never show errors themselves! Showing errors is only the '_Initializer_' web-component responsibility. So all the other web-components (core libs) need to do (regarding handling errors of the inner initialized '_feature_' lib) is to listen for the errors, and do something like this:

```ts
onError({ key, value }: { key: string; value: string }) {
  this.hasError.emit({ key, value });
  v1LocalWebcomSetOneError({ key: `core-lib-name: ${key}`, value: value });
}
```

&nbsp;

[🔝](#best-practices-👌)

## Ionic & Capacitor (mobile apps)

**In mobile apps, we use Ionic & Capacitor.**  
Ionic components are used to make our app's UI feel more like native.  
Capacitor plugins are used to let our app access native functionalities of the device, like camera, GPS, etc.

So in such apps, we should consider some more extra considerations regarding setting up our DOM elements and page navigations. Here's we're going to mention these guidelines.

&nbsp;

### `app.component.html` structure

In mobile, the structure should look like similar to the below one. So basically ALL pages (libs) should be inside `ion-router-outlet`.

```html
<ion-app>
  <ion-router-outlet>
    <!-- Page libs (base or child) go here -->
  </ion-router-outlet>
</ion-app>
```

&nbsp;

### Page libs with a common shell

If a group of page libs share a common shell (like header/footer), based on DRY (Don't Repeat Yourself) principles they should be child of a **base page**.  
Base page holds the shared elements (header, footer, etc.) and the router-outlet, and child pages hold their own specific content.

The structure of the base page lib should look like similar to the below one.

```html
<x-header-fea-v1>
  <ion-header></ion-header>
</x-header-fea-v1>

<ion-content>
  <!-- router-outlet go here -->
</ion-content>

<x-footer-fea-v1>
  <ion-footer></ion-footer>
</x-footer-fea-v1>
```

&nbsp;

### Page libs without a common shell

```html
<ion-content>
  <!-- router-outlet go here -->
</ion-content>
```

&nbsp;

### `router-outlet` vs `ion-router-outlet`

Basically in mobile apps, ALL pages (whether they are base or child) contents' MUST live under `ion-content`, and in there, if we wanna show a specific route's content, we should use a router-outlet. So we can either have:

- Standard router-outlet: `<router-outlet></router-outlet>`
- Ionic router-outlet: `<ion-router-outlet></ion-router-outlet>`

**Which one to choose?**
If you you have a tab-liked footer to navigate between pages without having Ionic's native-like iOS/Android page navigation, simply go with `router-outlet`.  
But if you like to keep the previous pages alive (NOT be destroyed) so you can go back to them using Ionic's native-like gestures (e.g., iOS edge-swipe), then go with `ion-router-outlet`.

&nbsp;

### `ion-router-outlet` considerations

- **Stack Navigation**: Pages are NOT destroyed when you navigate forward; they are kept alive in a stack.
- **Lifecycle Hooks**: Use Ionic-specific hooks (`ionViewWillEnter`, etc.) instead of just `ngOnInit` for logic that must run every time a page is shown (e.g., refreshing data).
- **Background Tasks**: Be careful with timers or subscriptions as they will continue to run while a page is hidden in the stack.

&nbsp;

**Lifecycle Hooks**:

- Entering a Page:
  - **`ionViewWillEnter`**: Fired when the component is about to animate into view. **Use this to refresh data** from services or reset component state.
  - **`ionViewDidEnter`**: Fired after the component has finished animating.

- Leaving a Page:
  - **`ionViewWillLeave`**: Fired when the component is about to animate out of view. **Use this to pause timers, videos, or background processes.**
  - **`ionViewDidLeave`**: Fired after the component has finished animating out.

&nbsp;

**⚠️ Background Processes Caution:**

If you start a `setInterval`, `setTimeout`, or an RxJS subscription, it **will continue to run in the background** while the user is on another page in the stack. So consider the following:

- Initialize heavy background tasks in `ionViewWillEnter`.
- Clean up or pause them in `ionViewWillLeave`.
- Use `ngOnDestroy` only for permanent clean-up (when the page is popped from the stack).

&nbsp;

**How to force destroy a page lib with `ion-router-outlet`?**

If in some cases you still liked to force destroy a page lib with `ion-router-outlet` when navigating to another route, you can use `routerLink` with `replaceUrl=true`.

```html
<ion-button [routerLink]="['/some-page']" replaceUrl="true">
  Go to Page
</ion-button>
```

```ts
this._router.navigate(['/some-page'], { replaceUrl: true });
```

[🔙](../../README.md#guidelines)
