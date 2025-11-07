import { inject, Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Platform } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Device } from '@capacitor/device';
import {
  V1CapacitorCore_AppInfo,
  V1CapacitorCore_DeviceId,
  V1CapacitorCore_URLOpenListenerEvent,
} from './capacitor-core.interfaces';

@Injectable({
  providedIn: 'root',
})
export class V1CapacitorCoreService {
  /* General //////////////////////////////////////////////////////////////// */

  private readonly _ngZone = inject(NgZone);

  /* Ionic ////////////////////////////////////////////////////////////////// */

  private readonly _platform = inject(Platform);

  /* App //////////////////////////////////////////////////////////////////// */

  private _forcePlatform: 'ios' | 'android' | 'desktop' | undefined = undefined;

  /**
   * Whether `setPlatform` is called to define a simulated platform.
   * This flag can be useful for the times that we are doing some platform
   * specific thing, but we also need to understand whether we are in a real
   * targetted platform or it's just a simulation! e.g., when we wanna choose
   * between different types of Capacitor Browser plugins... If platform is
   * simulated (returns ios but we're actually in desktop), then we should not
   * use the Capacitor Browser plugin!
   */
  isPlatformSim = false;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Ionic: Methods                                                           */
  /* //////////////////////////////////////////////////////////////////////// */

  private _getPlatform() {
    const ps = this._platform.platforms();
    if (ps.includes('ios')) return 'ios';
    else if (ps.includes('android')) return 'android';
    else return 'desktop';
  }

  /**
   * Get the current platform.
   *
   * @returns {("ios" | "android" | "desktop")}
   */
  getPlatform() {
    if (this._forcePlatform) {
      return this._forcePlatform;
    }

    const ps = this._platform.platforms();
    if (ps.includes('ios')) return 'ios';
    else if (ps.includes('android')) return 'android';
    else return 'desktop';
  }

  /**
   * Force the platform to be a specific one. Useful for simulation purposes
   *
   * @param {('ios' | 'android' | 'desktop')} platform
   */
  setPlatform(platform: 'ios' | 'android' | 'desktop') {
    this._forcePlatform = platform;
    this.isPlatformSim = true;
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Ionic: Listeners                                                         */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Emits when the native platform puts app into the background.
   *
   * @returns {*}
   */
  get onPause(): Observable<void> {
    return new Observable<void>((observer) => {
      const subscription = this._platform.pause.subscribe(() => {
        observer.next();
      });

      // Cleanup when unsubscribed
      return () => subscription.unsubscribe();
    });
  }

  /**
   * Emits when the native platform pulls app out from the background.
   *
   * @returns {*}
   */
  get onResume(): Observable<void> {
    return new Observable<void>((observer) => {
      const subscription = this._platform.resume.subscribe(() => {
        observer.next();
      });

      // Cleanup when unsubscribed
      return () => subscription.unsubscribe();
    });
  }

  /**
   * Emits when the native platform calls the Android device's back button.
   *
   * NOTE: This method works ONLY IF your app content is rendered inside
   * `ion-content`.
   *
   * NOTE: It seems that there's a bug or something in the Ionic framework
   * itself... Because when the Back Button is clicked, it calls our callback
   * twice. Use `onBack` method of this service instead.
   *
   * Why the default priority is 101? Because internal hardware back button
   * event handlers that Ionic Framework itself uses (Overlays and Menu) have
   * 100 and 99 priorities. And we like our own custom handler to be called
   * before them.
   *
   * @example
   * this._capacitorCoreService.onBackButton(102, false).subscribe((e) => {
   *   console.log('Back clicked!', e.priority);
   * });
   *
   * @deprecated
   * @param {number} [priority=101] The priority of the event handler.
   * @param {boolean} [processNextHandler=true] Whether to process the next handler.
   * @returns {*}
   */
  onBackButton(priority = 101, processNextHandler = true) {
    // Read more: https://ionicframework.com/docs/developing/hardware-back-button#basic-usage
    return new Observable<{ priority: number }>((observer) => {
      const subscription = this._platform.backButton.subscribeWithPriority(
        priority,
        (processNextHandler) => {
          observer.next({ priority });
          if (processNextHandler) processNextHandler();
        },
      );

      return () => subscription.unsubscribe();
    });
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Core: Methods                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Check if a plugin is available on the currently running platform.
   * The plugin name is used in the plugin registry. e.g. 'PushNotifications'.
   *
   * Read more:
   * https://capacitorjs.com/docs/basics/utilities#capacitorispluginavailable
   *
   * @param {string} name
   * @returns {boolean}
   */
  isPluginAvailable(name: string) {
    return Capacitor.isPluginAvailable(name);
  }

  /**
   * Check if the platform is native or not. `android` and `ios` would return
   * true, otherwise false.
   *
   * NOTE: This method is more reliable than checking the platform via
   * `getPlatform` method, because that method is actually based on user agent
   * and `window.navigator.platform`, which can be easily spoofed, but this
   * method is based on whether the code runs inside a Capacitor native shell
   * or not.
   *
   * @returns {boolean}
   */
  isNativePlatform() {
    return Capacitor.isNativePlatform();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* App: Methods                                                             */
  /* //////////////////////////////////////////////////////////////////////// */

  exitApp() {
    App.exitApp();
  }

  /**
   * Get native app info.
   *
   * @example
   * ```ts
   * // For HTML usage: Store the promise in a variable and then use it in HTML.
   * appInfoPromise!: Promise<V1CapacitorCore_AppInfo | null>;
   * ngOnInit(): void {
   *   this.appInfoPromise = this.appGetInfo();
   * }
   *
   * // For TS usage: Just call the method directly.
   * this._capacitorCoreService.appGetInfo().then((info) => {
   *  console.log('App Info:', info);
   * });
   * ```
   *
   * @example
   * ```html
   * <div *ngIf="appInfoPromise | async as appInfo">
   *   <p>App Name: {{ appInfo?.name }}</p>
   * </div>
   * ```
   *
   * @returns {Promise<V1CapacitorCore_AppInfo | null>}
   */
  async appGetInfo(): Promise<V1CapacitorCore_AppInfo | null> {
    if (this._getPlatform() === 'desktop') {
      return Promise.resolve(null);
    } else {
      try {
        const info = await App.getInfo();
        return Promise.resolve(info);
      } catch (error) {
        // console.error('@V1CapacitorCoreService/appGetInfo:', error);
        return Promise.resolve(null);
      }
    }
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* App: Listeners                                                           */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Emits when the native platform calls the Android device's back button.
   *
   * @example
   * this._capacitorCoreService.onBack.subscribe((e) => {
   *   console.log('Back clicked!', e.canGoBack);
   * });
   */
  get onBack() {
    return new Observable<{ canGoBack: boolean }>((observer) => {
      const listener = App.addListener('backButton', ({ canGoBack }) => {
        // NOTE: Why use `this._ngZone.run`? Because Capacitor plugin event
        // listeners run outside of Angular's `NgZone` execution context.
        // Read more: https://capacitorjs.com/docs/guides/angular
        this._ngZone.run(() => {
          observer.next({ canGoBack });
        });
      });

      return () => {
        listener.then((removeListener) => removeListener.remove());
      };
    });
  }

  /**
   * Emits when an url open event for the app is fired (app opens with a
   * deep-linking url).
   *
   * @example
   * this._capacitorCoreService.onAppUrlOpen.subscribe((e) => {
   *   console.log('URL that app is opened with:', e.url);
   * });
   */
  get onAppUrlOpen() {
    return new Observable<V1CapacitorCore_URLOpenListenerEvent>((observer) => {
      const listener = App.addListener('appUrlOpen', (event) => {
        this._ngZone.run(() => {
          observer.next(event);
        });
      });

      return () => {
        listener.then((removeListener) => removeListener.remove());
      };
    });
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Device: Methods                                                          */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Get native device UUID.
   *
   * @example
   * this._capacitorCoreService.deviceGetId().then((id) => {
   *  console.log('Device UUID:', id?.identifier);
   * });
   *
   * @returns {Promise<V1CapacitorCore_DeviceId | null>}
   */
  async deviceGetId(): Promise<V1CapacitorCore_DeviceId | null> {
    if (this._getPlatform() === 'desktop') {
      return Promise.resolve(null);
    } else {
      try {
        const id = await Device.getId();
        return Promise.resolve(id);
      } catch (error) {
        // console.error('@V1CapacitorCoreService/deviceGetId:', error);
        return Promise.resolve(null);
      }
    }
  }
}
