import { inject, Injectable, NgZone } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

import { V1TranslationsFacade } from '@x/shared-api-data-access-ng-translations';

import {
  V1CapacitorFirebaseAuthentication_SignInResult,
  V1CapacitorFirebaseAuthentication_User,
} from './capacitor-firebase-authentication.interfaces';

@Injectable({
  providedIn: 'root',
})
export class V1CapacitorFirebaseAuthenticationService {
  /* General //////////////////////////////////////////////////////////////// */

  private readonly _ngZone = inject(NgZone);
  private readonly _translationsFacade = inject(V1TranslationsFacade);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Methods: sign in/out                                                     */
  /* //////////////////////////////////////////////////////////////////////// */

  async signInWithApple() {
    const result = await FirebaseAuthentication.signInWithApple();
    return result.user;
  }

  async signInWithGoogle() {
    const result = await FirebaseAuthentication.signInWithGoogle();
    return result.user;
  }

  async signOut() {
    await FirebaseAuthentication.signOut();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Methods: user data                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  async getCurrentUser() {
    const result = await FirebaseAuthentication.getCurrentUser();
    return result.user;
  }

  async getIdToken() {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      return;
    }
    const result = await FirebaseAuthentication.getIdToken();
    return result.token;
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Methods: Other                                                           */
  /* //////////////////////////////////////////////////////////////////////// */

  /** Deletes and signs out the user. */
  async deleteUser() {
    await FirebaseAuthentication.deleteUser();
  }

  /** Sets the user-facing language code for auth operations. */
  async setLanguageCode(cultureCode?: string) {
    let lastLoadedLang!: string;

    // Get the last loaded language in the app.
    this._translationsFacade.lastLoadedLangCultureCode$
      .pipe(take(1))
      .subscribe((lang) => {
        lastLoadedLang = lang as string;
      });

    // Set the language code in Firebase Authentication.
    await FirebaseAuthentication.setLanguageCode({
      languageCode: cultureCode || lastLoadedLang,
    });
  }

  /** Sets the user-facing language code to be the default app language. */
  async useAppLanguage() {
    await FirebaseAuthentication.useAppLanguage();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Listeners                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Emits when the currently signed-in user state changes.
   *
   * @example
   * this._capacitorCoreService.onAuthStateChange.subscribe((e) => {
   *   console.log('User state changed!', e.user);
   * });
   */
  get onAuthStateChange() {
    return new Observable<{
      user: V1CapacitorFirebaseAuthentication_User | null;
    }>((observer) => {
      const listener = FirebaseAuthentication.addListener(
        'authStateChange',
        ({ user }) => {
          this._ngZone.run(() => {
            observer.next({ user });
          });
        },
      );

      return () => {
        listener.then((removeListener) => removeListener.remove());
      };
    });
  }
}
