# shared-util-ng-capacitor

v1.

`V1CapacitorAttService` in iOS devices, lets us get user's authorization to access app-related data for tracking the user or the device.

## Implementation guide

```ts
import {
  V1CapacitorAttService,
  V1CapacitorAtt_AppTrackingStatusResponse
} from '@x/shared-util-ng-capacitor';

private readonly _capacitorAttService = inject(V1CapacitorAttService);

/* Useful functions ///////////////////////////////////////////////////////// */

let attResponse1: V1CapacitorAtt_AppTrackingStatusResponse;
this._capacitorAttService.getStatus().then((response) => {
  attResponse1 = response;
});

let attResponse2: V1CapacitorAtt_AppTrackingStatusResponse;
this._capacitorAttService.requestPermission().then((response) => {
  attResponse2 = response;
});

```
