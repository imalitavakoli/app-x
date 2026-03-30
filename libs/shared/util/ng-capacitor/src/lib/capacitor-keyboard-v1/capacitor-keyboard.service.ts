import { inject, Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Keyboard } from '@capacitor/keyboard';

@Injectable({
  providedIn: 'root',
})
export class V1CapacitorKeyboardService {
  /* General //////////////////////////////////////////////////////////////// */

  private readonly _ngZone = inject(NgZone);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Methods                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  /** Remove all native listeners. */
  removeAllListeners() {
    Keyboard.removeAllListeners();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Listeners                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Emits when the keyboard is about to be shown.
   *
   * NOTE: On Android keyboardWillShow and keyboardDidShow fire almost at the same time.
   *
   * @example
   * this._capacitorKeyboardService.onKeyboardWillShow.subscribe((e) => {
   *   console.log('Keyboard will show!', e.keyboardHeight);
   * });
   */
  get onKeyboardWillShow() {
    return new Observable<{ keyboardHeight: number }>((observer) => {
      const listener = Keyboard.addListener(
        'keyboardWillShow',
        ({ keyboardHeight }) => {
          // NOTE: Why use `this._ngZone.run`? Because Capacitor plugin event
          // listeners run outside of Angular's `NgZone` execution context.
          // Read more: https://capacitorjs.com/docs/guides/angular
          this._ngZone.run(() => {
            observer.next({ keyboardHeight });
          });
        },
      );

      return () => {
        listener.then((removeListener) => removeListener.remove());
      };
    });
  }

  /**
   * Emits when the keyboard is about to be hidden.
   *
   * NOTE: On Android keyboardWillHide and keyboardDidHide fire almost at the same time.
   *
   * @example
   * this._capacitorKeyboardService.onKeyboardWillHide.subscribe(() => {
   *   console.log('Keyboard will hide!');
   * });
   */
  get onKeyboardWillHide() {
    return new Observable<void>((observer) => {
      const listener = Keyboard.addListener('keyboardWillHide', () => {
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
   * Emits when the keyboard is shown.
   *
   * NOTE: On Android keyboardWillShow and keyboardDidShow fire almost at the same time.
   *
   * @example
   * this._capacitorKeyboardService.onKeyboardDidShow.subscribe((e) => {
   *   console.log('Keyboard did show!', e.keyboardHeight);
   * });
   */
  get onKeyboardDidShow() {
    return new Observable<{ keyboardHeight: number }>((observer) => {
      const listener = Keyboard.addListener(
        'keyboardDidShow',
        ({ keyboardHeight }) => {
          this._ngZone.run(() => {
            observer.next({ keyboardHeight });
          });
        },
      );

      return () => {
        listener.then((removeListener) => removeListener.remove());
      };
    });
  }

  /**
   * Emits when the keyboard is hidden.
   *
   * NOTE: On Android keyboardWillHide and keyboardDidHide fire almost at the same time.
   *
   * @example
   * this._capacitorKeyboardService.onKeyboardDidHide.subscribe(() => {
   *   console.log('Keyboard did hide!');
   * });
   */
  get onKeyboardDidHide() {
    return new Observable<void>((observer) => {
      const listener = Keyboard.addListener('keyboardDidHide', () => {
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
