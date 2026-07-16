# shared-util-ng-capacitor

v1.

`V1CapacitorNetworkService` gives access to the most common functionalities.

## Implementation guide

```ts
import { DestroyRef, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  V1CapacitorNetworkService,
  V1CapacitorNetwork_Status,
} from '@eliq/shared-util-ng-capacitor';

private readonly _destroyRef = inject(DestroyRef);
private readonly _capacitorNetworkService = inject(V1CapacitorNetworkService);

/* Methods ////////////////////////////////////////////////////////////////// */

// Useful when everything should be destroyed...
// USE WITH CAUTION: Before calling this, we have to make sure that no other
// places (libs) are using this service (have active listener).
this._capacitorNetworkService.removeAllListeners();

let isNetworkConnected: boolean = true;
this._capacitorNetworkService.getStatus().then((status) => {
  isNetworkConnected = status.connected;
});

/* Listeners //////////////////////////////////////////////////////////////// */

this._capacitorNetworkService.onNetworkStatusChange
  .pipe(takeUntilDestroyed(this._destroyRef))
  .subscribe((status: V1CapacitorNetwork_Status) => {
    console.log('Network status changed:', status.connected, status.connectionType);
  });
```
