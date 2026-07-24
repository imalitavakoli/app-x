[🔙](../../README.md#tuts)

# FAQ ⁉

You may see some similar patterns across the workspace...  
Here we try to share the most common ones which you may find useful.

&nbsp;

[🔝](#faq-⁉)

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

[🔝](#faq-⁉)

## Error handling

Depnding on what type of lib we are building, error handling is different:

&nbsp;

### '_map_' libs

Whenever we want to receive the API response (after calling an endpoint), we also need to use `catchError` operator to handle the error and log it.

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

&nbsp;

### '_feature_' libs

They should have an input called `showErrors` to know whether to show error messages in their HTML template (via a popup as an example) or not, and an output called `hasError` to emit any probable errors that they receive from '_data-access_' libs. e.g., `this.hasError.emit({ key: facadeMethodName, value: errorMsg });`.

&nbsp;

### Core '_feature_' web-component libs

They should pass `showErrors` input of the their inner initialized '_feature_' lib as `false` by default, because web-components never show errors themselves! Showing errors is only the '_Initializer_' web-component responsibility. So all the other web-components (core libs) need to do (regarding handling errors of the inner initialized '_feature_' lib) is to listen for the errors, and do something like this:

```ts
onError({ key, value }: { key: string; value: string }) {
  this.hasError.emit({ key, value });
  v1LocalWebcomSetOneError({ key: `core-lib-name: ${key}`, value: value });
}
```

&nbsp;

[🔝](#faq-⁉)

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

[🔙](../../README.md#tuts)
