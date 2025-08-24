[🔙](../../README.md#guidelines)

# Best Practices 👌

To improve teamwork, we follow some best practices:

**Tip!** Feel free to get inspired from our Boilerplate app files (its pages, and its dependent libs) for writing `README.md` files or '_jsdoc_' comments, documenting, or doing other best practices.

&nbsp;

[🔝](#best-practices-👌)

## Mindset

- **Prioritize docs**: Before generating/updating a project (app or lib), always begin by writing or updating its `README.md` (for apps, it's also essential to update the `CHANGELOG.md` file).  
  **Note!** Immediately after generating a new app/lib, update `CODEOWNERS` file as well. This ensures that all developers are aware of who owns the code initially for the newly created app/lib. This helps the Product Manager (PM) identify who should be assigned future upgrade or bug fix tasks for a feature in the workspace.

&nbsp;

- **Prefer many files with fewer lines**: It's preferable to have numerous libs/files rather than having a single lib/file with an extensive amount of code lines.

&nbsp;

- **Lightweight front logic, heavy behind the scenes codes**: Aim to keep '_feature_'/'_page_' libs lightweight. Instead, prepare all necessary data for presentation within '_map_'/'_data-access_' libs as much as possible. In this way, whenever you like your components' HTML templates to get updated, as soon as a feature state's property changes (in the '_data-access_' lib), you don't have to subscribe to the whole feature state in your component's TS code, in order to extract its data! Instead, you can just directly use the '_data-access_' lib's state object properties right inside your component's HTML template (e.g., `(translationsFacade.datas$ | async)?.allLangs?.codes`).

&nbsp;

[🔝](#best-practices-👌)

## Documenting

- **Write descriptive comments**: Add comments that explain why a variable or function exists and why it behaves the way it does. These comments not only assist other team members but also help developers understand their own code in the future when they revisit it.

- **Use self-explanatory variable and function names**.

- Use '_jsdoc_' more frequently.

- When writing CSS, write its HTML sample usage as a comment right before declaring the CSS rule.

- If possible, when creating a file (it can be a `.scss`, `.ts`, or any type of file), right at the top of the file, as a comment, explain (1) why that file is created at the first place, and (2) what it's going to do.

&nbsp;

- **When creating an app, write its `README.md` file** and try to explain (1) what is it about, (2) version, (3) user flow of the app, (4) UX edge decisions that have been made based on some special scenarios that may happen in the app to show a message or do an action according to a known server error or a conclusion that we've came up with, (5) designers related stuff which are listing '_unique brand-specific images_' and '_unique brand-specific color & style variables_' that the app has.  
  **Tip!** 'User flow' section of your description: If you have explained it somewhere else in an external resource/webpage (such as a Confluence page), it can be something like: _Click here to read more about the app's user-flow. Click here to read more about the app's back-API based on the user-flow._  
  **Tip!** Feel free to get inspired from our Boilerplate app for writing your app's `README.md` file.

&nbsp;

- **When creating a lib, write its `README.md` file** and try to explain (1) what is it about, (2) instruction on how apps or other libs can use it step by step, (3) what are its important requirements (dependencies), and (4) write its ready-to-use copy-paste HTML & TS codes that can be pasted in our Boilerplate app's test page and let us see the results.  
  **Note!** We can see a lib's dependencies via the NX graph (by running `nx graph` command), so we don't need to write ALL of the dependencies in the lib's `README.md`! But it's a good practice to write the important ones, while explaining those important dependencies' purpose! i.e., it's a good idea to not only mention those dependencies names, but also explain why they have been used inside of the lib too! This helps team members to understand the libs' relationships even better.  
  **Tip!** If your '_ui_' lib has CSS variables, let's also have CSS copy-paste codes in the lib's `README.md` file. Apps will refer to your lib's docs in their own `README.md` file 'Designers related' section to list unique brand-specific color & style variables that the app offers.  
  **Tip!** For '_page_' libs also explain whether they are guarded or not (visibility). i.e., specify to whom they should be shown, and to whom they should be hidden.  
  **Tip!** If the lib that you're writing its `README.md` file, depends on another lib, then avoid detailing the implementation of the dependent lib. For example, don't include its variable names, action names, or other specifics. Instead, simply mention the dependent lib by name and explain how your library interacts with it in a general way. If possible, don't initialize the dependent lib in your copy-paste code, and just use a placeholder instead. Team members can always refer to the dependent lib's own docs for implementation details... This approach ensures your documentation stays focused on your own lib, while also reducing maintenance overhead. If the dependent lib changes in the future, you won’t need to update multiple README.md files across the workspace.  
  **Tip!** Feel free to get inspired from our Boilerplate related libs for writing your libs' `README.md` files.

&nbsp;

[🔝](#best-practices-👌)

## Organizing

- **When building UI, it's important to maintain consistency** across different libraries created by multiple front-end developers. Here's the priority, from top to bottom, when using different 3rd-party frameworks:

  - Our own shared libs for building unique-designed UIs across our company. Such as simple inputs, cards, buttons, links, preloader, etc.
  - [daisyui](https://daisyui.com/) for building simple UIs, such as toggle, carousel, accordion, etc.
  - [ionicframework](https://ionicframework.com/) for building more common complex UIs, such as alert, menu, etc.
  - [material.angular](https://material.angular.io/) for building less common complex UIs, such as table, sort header, paginator, etc.
  - [primeng](https://primeng.org/) for building rare complex UIs, such as editor, color picker, drag & drop, etc.

&nbsp;

- **When you like to install & use a 3rd-party lib, ideally first contact the Workspace Specialist** and ask their ideas about it, then install it on the workspace.  
  **Tip!** Make sure that the lib you wanna use is popular and gets updated frequently before starting to use it. Because unpopular libs may get deprecated soon and slow down our development process in the long run.

&nbsp;

- **When defining routes in an app, define them in order of user flow**. e.g., first define `home`, then `auth`, then `dashboard`, and etc. This helps team members to understand the app's user flow easier by just looking out the routes.

&nbsp;

- **Import component dependencies in a consistent order from top to bottom**! This practice not only makes it easier for a new developer to read & understand the logic of an older component, but it also helps unify the structure of components across the workspace.

  The following order is recommended:

  - Technology related dependencies (e.g., Angular core, common, router, rxjs, etc.).
  - Our workspace libs.
  - Lib's internal files.

  Regarding the workspace libs, The following order is recommended, based on the types of libs:

  - '_util_'
  - '_map_'
  - '_ui_'
  - '_data-access_'
  - '_feature_'

  Why this order? '_util_' libs are usually the lightest and most broadly used across the workspace, so they come first. Then '_map_' libs come, because they often provide interfaces that are utilized in UIs & Features. Then '_ui_' libs come, because they are primarily consumed by Pages, Features, or other UIs. Then '_data-access_' libs come, because they supply the data of Features. And finally '_feature_' libs come, because they are the last piece of the puzzle and rely on almost any other type of libs.

&nbsp;

- Decisions to (1) show a content by `@if` blocks, (2) use some CSS classes or styles by `[ngClass]` or `[ngStyle]`, and (3) DEP config reading (e.g., `(configFacade.dataConfigDep$ | async)?.assets?.thisAuthImgBg`), all should happen in your component templates. But some other stuff, like calculating two values and returning a new value, should happen in your component logic itself.

&nbsp;

- **Globally exposed components in '_ui_' or '_feature_' libs**: If the lib needs to expose more than one main component, each component should have its own folder directly within the version folder (e.g., v1). So basically there's no component files (`.ts`, `.html`, `.scss`, etc.) directly inside of the version folder. This structure keeps internal component files organized and makes it clear how many components the lib is exposing globally right at the first glance. For example:

  - `v1/libname-wizard/libname-wizard.component.ts`
  - `v1/libname-popup/libname-popup.component.ts`

- **Private internal files in '_ui_' or '_feature_' libs**: If the lib needs to be broken down into smaller components (or have lots of TS code files to hold different interfaces, mocks, or utility functions), but all of those files are meant to be for internal usage of the lib itself (i.e., they are NOT useful to be exposed globally across the workspace), then the ones which exist directly in the version folder of the lib should have '\_' prefix for their file name (e.g., `_libname.interfaces.ts`), and the ones which rest in their own respective folder should have '\_' prefix for their folder name (e.g., `_feature`). For example:

  - `v1/libname.component.ts` (this is the lib's main component that is exposed globally and can rest directly in the version folder)
  - `v1/_feature/wizard/wizard.component.ts` (this component is a '_feature_' one)
  - `v1/_feature/popup/popup.component.ts`
  - `v1/_ui/button/button.component.ts` (this component is a '_ui_' one)
  - `v1/_util/formatter.ts` (this TS file is a '_util_' one, which contains some capsulated utility functions)
  - `v1/_libname.interfaces.ts`
  - `v1/_util/mocks/something1.mocks.ts`
  - `v1/_util/mocks/something2.mocks.ts`

- **If texts, numbers, or dates should get manipulated, it's better to do that inside of '_ui_' libs**, rather than '_feature_' libs! Most of the times '_feature_' libs would get complicated as they're dealing with data... So it's always better to simplify their job as much as possible and put any kind of UI related logic right inside of '_ui_' libs.

- **Use String, Number, and Boolean types for inputs of '_feature_' libs** as much as possible, and NOT Arrays or Objects, unlike '_ui_' libs' inputs! ! Because it simplifies building their web-component Core '_feature_' lib (if the lib is going to be a web-component).

- **In mobile app development, use our own '_ui_' Ionic lib** as a wrapper to use the original Ionic components. This approach reduces other lib's dependencies to Ionic and eases updating Ionic components.

- **In mobile app development, use our own '_util_' Capacitor lib** as a wrapper to use the original Capacitor classes. This approach reduces other lib's dependencies to Capacitor and eases updating Capacitor classes.

&nbsp;

[🔝](#best-practices-👌)

## State management

Here's the data-flow, when you wanna show real (NOT mock) data in your '_ui_' components' HTML templates:  
'_map_' lib > '_data-access_' lib > '_feature_'/'_page_' lib > '_ui_' lib.

&nbsp;

**When should we include certain mapped API response properties in '_map_' libs?**  
You should do this when the values of those properties directly originate from the API response. In simpler terms, in '_map_' libraries, you retrieve data from the API and then map (proxy) that data. This involves: (1) Removing any unnecessary properties; (2) renaming certain properties for clarity, if necessary; (3) adding new properties by extracting data from the fetched information, making it easier to use them in the components' HTML templates later.

**When should we incorporate selectors in '_data-access_' libs?**  
You should do this when you require computed selectors based on the available feature state object. In '_data-access_' libraries, you primarily integrate NgRx codes, such as reducers, actions, selectors, and effects.

&nbsp;

If you need to make calls to multiple API endpoints (for example, if these calls are related, like various authentication API endpoints residing in a single '_map_' library), then you should define multiple mapped interfaces within that single '_map_' library. Subsequently, in your '_data-access_' lib, you save each received data from these API calls as a new property in the 'reducer' file.

In your '_data-access_' lib, if you need to modify additional properties in your state object (**synchronous job**) when success/failure actions related to another property are dispatched, you should handle this in the **'reducer' file**.

In your '_data-access_' lib, if you need to call other actions or store something in Local Storage (**asynchronous job**) when success/failure actions related to a property are dispatched, you should handle this in the **'effect' file**.

&nbsp;

**Here's how to use the state object properties**:

You can update different parts of your component's HTML template easier, by using some simple `@if` blocks. As an example, for `data1` section in your page, here's what you can do:

- To show a loading graphic, set `(libNameFacade.entityLoadedLatest$('g') | async)?.data1 === false` or `!(libNameFacade.entityLoadeds$('g') | async)?.data1` condition.
- To show the loaded data, set `(libNameFacade.entityDatas$('g') | async)?.data1` condition.
- To show an error graphic, set `(libNameFacade.entityErrors$('g') | async)?.data1` condition.

If in your component's TS code, you also need to subscribe to your lib's entity state changes (`entity$('g')`), then you can easily check each data individually only when the action related to that data is already called:

```ts
this.libNameFacade.entity$('g').subscribe((state) => {
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
        const error = err.message || err;
        console.error('@LibName/getSomething:', error);
        return throwError(() => error);
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

[🔙](../../README.md#guidelines)
