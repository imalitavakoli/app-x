# shared-util-ng-capacitor

v1.

`V1CapacitorAndroidEdgeToEdgeSupportService` gives access to the Android-edge-to-edge-support functionality.

## Implementation guide

```ts
import { V1CapacitorAndroidEdgeToEdgeSupportService } from '@eliq/shared-util-ng-capacitor';

private readonly _capacitorAndroidEdgeToEdgeSupportService = inject(V1CapacitorAndroidEdgeToEdgeSupportService);

/* Methods ////////////////////////////////////////////////////////////////// */

this._capacitorAndroidEdgeToEdgeSupportService.enable();
this._capacitorAndroidEdgeToEdgeSupportService.disable();

// Get safe area margins.
// NOTE: Because this plugin is ONLY for Android deevices, we're just being
// cautious and making sure that `insets` truthy and its top/bottom properties
// are also truthy. Of course we could check the platform value as well...
const insets = this._capacitorAndroidEdgeToEdgeSupportService.getInsets();
let safeAreaTop = 0;
let safeAreaBottom = 0;
if (insets) {
  if (insets.top && insets.top > 0) {
    safeAreaTop = insets.top;
  }
  if (insets.bottom && insets.bottom > 0) {
    safeAreaBottom = insets.bottom;
  }
}
```
