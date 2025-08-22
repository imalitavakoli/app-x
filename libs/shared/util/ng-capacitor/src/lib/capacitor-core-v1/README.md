# shared-util-ng-capacitor

v1.

`V1CapacitorCoreService` gives access to the most common functionalities.

## Implementation guide

```ts
import {
  V1CapacitorCoreService,
  V1CapacitorCore_AppInfo,
  V1CapacitorCore_DeviceId,
} from '@x/shared-util-ng-capacitor';
import { Subscription } from 'rxjs';

private readonly _capacitorCoreService = inject(V1CapacitorCoreService);
private _backSub!: Subscription;

/* Ionic: Methods /////////////////////////////////////////////////////////// */

this._capacitorCoreService.getPlatform();
this._capacitorCoreService.setPlatform('ios'); // Force a platform (Useful for simulation purposes).

/* Ionic: Listeners ///////////////////////////////////////////////////////// */

const pauseSub = this._capacitorCoreService.onPause.subscribe(() => {
  console.log('Pause event detected!');
});
const resumeSub = this._capacitorCoreService.onResume.subscribe(() => {
  console.log('Resume event detected!');
});

/* Core: Methods //////////////////////////////////////////////////////////// */

const isNotificationAvailable = this._capacitorCoreService.isPluginAvailable('PushNotifications');

/* App: Methods ///////////////////////////////////////////////////////////// */

this._capacitorCoreService.exitApp();

let appInfo: V1CapacitorCore_AppInfo | null = null;
this._capacitorCoreService.appGetInfo().then((info) => {
  appInfo = info;
});

/* App: Listeners /////////////////////////////////////////////////////////// */

this._backSub = this._capacitorCoreService.onBack.subscribe((e) => {
  console.log('Back event detected!', e.canGoBack);
  if (e.canGoBack) window.history.back();
  else this._capacitorCoreService.exitApp();
});

/* Device: Methods ////////////////////////////////////////////////////////// */

let deviceId: V1CapacitorCore_DeviceId | null = null;
this._capacitorCoreService.deviceGetId().then((id) => {
  deviceId = id;
});
```
