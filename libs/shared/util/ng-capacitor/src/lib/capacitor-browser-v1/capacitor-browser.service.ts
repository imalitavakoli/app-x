import { inject, Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Browser } from '@capacitor/browser';
import { V1CapacitorBrowser_OpenOptions } from './capacitor-browser.interfaces';

@Injectable({
  providedIn: 'root',
})
export class V1CapacitorBrowserService {
  /* General //////////////////////////////////////////////////////////////// */

  private readonly _ngZone = inject(NgZone);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Browser: Methods                                                         */
  /* //////////////////////////////////////////////////////////////////////// */

  open(options: V1CapacitorBrowser_OpenOptions) {
    Browser.open(options);
  }

  close() {
    Browser.close();
  }

  /** Remove all native listeners for 'Browser' plugin. */
  browserRemoveAllListeners() {
    Browser.removeAllListeners();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Browser: Listeners                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Android & iOS only: Listen for the browser finished event. It fires when
   * the Browser is closed by the user.
   */
  get onBrowserFinished() {
    return new Observable<void>((observer) => {
      const listener = Browser.addListener('browserFinished', () => {
        this._ngZone.run(() => {
          observer.next();
        });
      });

      return () => {
        listener.then((removeListener) => removeListener.remove());
      };
    });
  }

  /**
   * Android & iOS only: Listen for the page loaded event. It's only fired when
   * the URL passed to open method finish loading. It is not invoked for any
   * subsequent page loads.
   */
  get onBrowserPageLoaded() {
    return new Observable<void>((observer) => {
      const listener = Browser.addListener('browserPageLoaded', () => {
        this._ngZone.run(() => {
          observer.next();
        });
      });

      return () => {
        listener.then((removeListener) => removeListener.remove());
      };
    });
  }
}
