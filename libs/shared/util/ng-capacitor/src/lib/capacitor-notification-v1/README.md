# shared-util-ng-capacitor

v1.

`V1CapacitorNotificationService` gives access to the push-notification functionalities.

## Implementation guide

```ts
import {
  V1CapacitorNotificationService,
  V1CapacitorNotification_Token,
  V1CapacitorNotification_Notification,
  V1CapacitorNotification_Action,
} from '@x/shared-util-ng-capacitor';
import { Subscription } from 'rxjs';

private readonly _capacitorNotificationService = inject(V1CapacitorNotificationService);

/* Useful functions ///////////////////////////////////////////////////////// */

this._capacitorNotificationService.requestOrRegister().then((msg) => {
  console.log('requestOrRegister:', msg);
});

// Useful for removing the notification badge on app's icon.
this._capacitorNotificationService.removeAllDeliveredNotifications();

// Useful when everything should be destroyed... But it's worthy to mention that
// we won't destroy push-notification subscriptions most of the times...
this._capacitorNotificationService.removeAllListeners();

/* Listeners //////////////////////////////////////////////////////////////// */

// NOTE: In each app, we ONLY need to subscribe to these listeners once. i.e.,
// we can subscribe them in `app.component.ts` file.

this._capacitorNotificationService.onRegistration.subscribe((e) => {
  console.log('onRegistration:', e.token.value);
});

this._capacitorNotificationService.onRegistrationError.subscribe((e) => {
  console.log('onRegistrationError:', JSON.stringify(e.error));
});

this._capacitorNotificationService.onPushNotificationReceived.subscribe((e) => {
  console.log('onPushNotificationReceived:', JSON.stringify(e.notification));
});

this._capacitorNotificationService.onPushNotificationActionPerformed.subscribe((e) => {
  console.log('onPushNotificationActionPerformed:', JSON.stringify(e.action));
});
```
