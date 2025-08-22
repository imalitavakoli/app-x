import { inject, Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
  PermissionStatus,
} from '@capacitor/push-notifications';
import {
  V1CapacitorNotification_Token,
  V1CapacitorNotification_Notification,
  V1CapacitorNotification_Action,
} from './capacitor-notification.interfaces';

@Injectable({
  providedIn: 'root',
})
export class V1CapacitorNotificationService {
  /* //////////////////////////////////////////////////////////////////////// */
  /* Methods                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Request or try registering for push notifications. The result of this
   * method will be either 'triedRegistration' or 'denied'.
   *
   * NOTE: How to understand whether the registration was successful or not?
   * We should listen to the `registration` events!
   *
   * @example
   * this._capacitorNotificationSerivce.requestOrRegister().then((msg) => {
   *  console.log('msg:', msg);
   * });
   *
   * @returns {Promise<'triedRegistering' | 'denied'>}
   */
  async requestOrRegister(): Promise<'triedRegistering' | 'denied'> {
    // First check the current status of the permission.
    let permStatus = await PushNotifications.checkPermissions();

    // If it's 'prompt', it means that user have never been asked for the
    // permission. So, let's prompt (request) for the permission foe the first
    // time.
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    // If the permission is denied (now or in the past), then simply return
    // 'denied'.
    if (permStatus.receive !== 'granted') {
      return Promise.resolve('denied');
    }

    // If we're here, it means that whether the permission has already been
    // granted in the past or the user has just granted the permission in the
    // prompt. So, let's try registering with Apple/Google to receive push via
    // APNS/FCM.
    await PushNotifications.register();
    return Promise.resolve('triedRegistering');
  }

  /**
   * Remove all the notifications from the notifications screen.
   * This removes the notification badge on app's icon.
   */
  removeAllDeliveredNotifications() {
    PushNotifications.removeAllDeliveredNotifications();
  }

  /** Remove all native listeners. */
  removeAllListeners() {
    PushNotifications.removeAllListeners();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Listeners                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Emits when the push notification is registered successfully.
   *
   * @returns {Observable<{ token: V1CapacitorNotification_Token; }>}
   */
  get onRegistration() {
    return new Observable<{ token: V1CapacitorNotification_Token }>(
      (observer) => {
        const listener = PushNotifications.addListener(
          'registration',
          (token: Token) => {
            observer.next({ token });
          },
        );

        return () => {
          listener.then((removeListener) => removeListener.remove());
        };
      },
    );
  }

  /**
   * Emits when the push notification is failed to register.
   *
   * @returns {Observable<{ error: unknown; }>}
   */
  get onRegistrationError() {
    return new Observable<{ error: unknown }>((observer) => {
      const listener = PushNotifications.addListener(
        'registrationError',
        (error: unknown) => {
          observer.next({ error });
        },
      );

      return () => {
        listener.then((removeListener) => removeListener.remove());
      };
    });
  }

  /**
   * Emits when the push notification is received.
   *
   * @returns {Observable<{ notification: V1CapacitorNotification_Notification; }>}
   */
  get onPushNotificationReceived() {
    return new Observable<{
      notification: V1CapacitorNotification_Notification;
    }>((observer) => {
      const listener = PushNotifications.addListener(
        'pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          observer.next({ notification });
        },
      );

      return () => {
        listener.then((removeListener) => removeListener.remove());
      };
    });
  }

  /**
   * Emits when the user performs an action on the push notification.
   *
   * @returns {Observable<{ action: V1CapacitorNotification_Action; }>}
   */
  get onPushNotificationActionPerformed() {
    return new Observable<{ action: V1CapacitorNotification_Action }>(
      (observer) => {
        const listener = PushNotifications.addListener(
          'pushNotificationActionPerformed',
          (action: ActionPerformed) => {
            observer.next({ action });
          },
        );

        return () => {
          listener.then((removeListener) => removeListener.remove());
        };
      },
    );
  }
}
