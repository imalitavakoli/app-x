# shared-util-ng-capacitor

v1.

`V1CapacitorAndroidEdgeToEdgeSupportService` gives access to the Android-edge-to-edge-support functionality.

## Implementation guide

```ts
import { V1CapacitorCoreService, V1CapacitorAndroidEdgeToEdgeSupportService } from '@x/shared-util-ng-capacitor';

private readonly _capacitorCoreService = inject(V1CapacitorCoreService);
private readonly _capacitorAndroidEdgeToEdgeSupportService = inject(V1CapacitorAndroidEdgeToEdgeSupportService);

/* Methods ////////////////////////////////////////////////////////////////// */

this._capacitorAndroidEdgeToEdgeSupportService.enable();
this._capacitorAndroidEdgeToEdgeSupportService.disable();

// Get safe area margins.
// NOTE: Because this plugin is ONLY for Android deevices, we check the platform.
if (this._capacitorCoreService.getPlatform() === 'android') {
  const insets = this._capacitorAndroidEdgeToEdgeSupportService.getInsets();
  const safeAreaTop = insets.top;
  const safeAreaBottom = insets.bottom;
}
```
