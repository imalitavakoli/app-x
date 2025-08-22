# shared-util-ng-services

v1.

## Implementation guide

In this service we deal with app's service worker. We can simply import and use it in our app's `AppComponent` class `ngOnInit` method, right after app's initialization.

- `unregister` method: Unregister 'ngsw-worker.js' Service worker (or other SWs in other names) from our app, if it's already registered:

```ts
import { V1ServiceWorkerService } from '@x/shared-util-ng-services';

private _serviceWorkerService = inject(V1ServiceWorkerService);
this._serviceWorkerService
  .unregister()
  .then(() => {
    // console.log('Service worker unregistered successfully.')
  })
  .catch((error) => {
    // console.error('Error unregistering service worker:', error);
  });
```
