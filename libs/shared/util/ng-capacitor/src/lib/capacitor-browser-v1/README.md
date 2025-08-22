# shared-util-ng-capacitor

v1.

`V1CapacitorBrowserService` gives access to the in-app browser functionality.

## Implementation guide

```ts
import {
  V1CapacitorBrowserService,
  V1CapacitorBrowser_OpenOptions
} from '@x/shared-util-ng-capacitor';

private readonly _capacitorBrowserService = inject(V1CapacitorBrowserService);

/* Useful functions ///////////////////////////////////////////////////////// */

this._capacitorBrowserService.open({url: 'https://site.com'});
this._capacitorBrowserService.close();
this._capacitorBrowserService.browserRemoveAllListeners(); // Useful when everything should be destroyed.

/* Listeners //////////////////////////////////////////////////////////////// */

this._capacitorBrowserService.onBrowserFinished.subscribe(() => {
  console.log('browserFinished');
});

this._capacitorBrowserService.onBrowserPageLoaded.subscribe(() => {
  console.log('browserPageLoaded');
});

```
