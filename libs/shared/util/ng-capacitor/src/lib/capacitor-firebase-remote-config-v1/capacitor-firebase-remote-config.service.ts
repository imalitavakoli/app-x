import { inject, Injectable, NgZone } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';
import {
  AddConfigUpdateListenerOptionsCallbackEvent,
  FirebaseRemoteConfig,
} from '@capacitor-firebase/remote-config';

@Injectable({
  providedIn: 'root',
})
export class V1CapacitorFirebaseRemoteConfigService {
  /* General //////////////////////////////////////////////////////////////// */

  private readonly _ngZone = inject(NgZone);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Methods                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Perform fetch and activate operations. In simple terms, it fetches the
   * remote config values from Firebase and activates them so that they can be
   * used in the app.
   *
   * @async
   * @returns {Promise<void>}
   */
  async fetchAndActivate() {
    await FirebaseRemoteConfig.fetchAndActivate();
  }

  /**
   * Get the value for the given key as a boolean.
   *
   * @async
   * @param {string} key e.g., 'is_premium_user'
   * @returns {Promise<boolean>}
   */
  async getBoolean(key: string) {
    const { value } = await FirebaseRemoteConfig.getBoolean({
      key,
    });
    return value;
  }

  /**
   * Get the value for the given key as a number.
   *
   * @async
   * @param {string} key e.g., 'package_price'
   * @returns {Promise<number>}
   */
  async getNumber(key: string) {
    const { value } = await FirebaseRemoteConfig.getNumber({
      key,
    });
    return value;
  }

  /**
   * Get the value for the given key as a string.
   *
   * @async
   * @param {string} key e.g., 'welcome_message'
   * @returns {Promise<string>}
   */
  async getString(key: string) {
    const { value } = await FirebaseRemoteConfig.getString({
      key,
    });
    return value;
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Listeners                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Emits when the remote config is updated.
   *
   * @example
   * this._capacitorFirebaseRemoteConfigService.onConfigUpdate
   *  .pipe(takeUntilDestroyed(this._destroyRef))
   *  .subscribe({
   *    next: (event) => console.log('Remote Config updated:', event),
   *    error: (err) => console.error('Config listener error:', err),
   *  });
   */
  get onConfigUpdate() {
    return new Observable<AddConfigUpdateListenerOptionsCallbackEvent | null>(
      (observer) => {
        let callbackId: string | undefined;

        FirebaseRemoteConfig.addConfigUpdateListener((event, error) => {
          this._ngZone.run(() => {
            if (error) {
              // console.error('Remote Config listener error:', error);
              observer.error(error);
            } else {
              observer.next(event);
            }
          });
        })
          .then((id) => {
            callbackId = id;
          })
          .catch((err) => {
            observer.error(err);
          });

        // Teardown logic (unsubscribe)
        return () => {
          if (callbackId) {
            FirebaseRemoteConfig.removeConfigUpdateListener({ id: callbackId });
          }
        };
      },
    );
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Useful                                                                   */
  /* //////////////////////////////////////////////////////////////////////// */

  async setSettings(obj: object) {
    await FirebaseRemoteConfig.setSettings(obj);
  }
}
