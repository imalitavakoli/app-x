import { inject, Injectable, NgZone } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

import { V1TranslationsFacade } from '@x/shared-api-data-access-ng-translations';

import { V1CapacitorFirebaseAuthentication_SignInResult } from './capacitor-firebase-authentication.interfaces';

@Injectable({
  providedIn: 'root',
})
export class V1CapacitorFirebaseAuthenticationService {
  /* General //////////////////////////////////////////////////////////////// */

  private readonly _ngZone = inject(NgZone);
  private readonly _translationsFacade = inject(V1TranslationsFacade);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Methods: sign-in                                                         */
  /* //////////////////////////////////////////////////////////////////////// */

  async signInWithApple() {
    const result = await FirebaseAuthentication.signInWithApple();
    return result.user;
  }

  async signInWithGoogle() {
    const result = await FirebaseAuthentication.signInWithGoogle();
    return result.user;
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Methods: Other                                                           */
  /* //////////////////////////////////////////////////////////////////////// */

  async deleteUser() {
    await FirebaseAuthentication.deleteUser();
  }

  async setLanguageCode() {
    let lastLoadedLang!: string;

    // Get the last loaded language in the app.
    this._translationsFacade.lastLoadedLangCultureCode$
      .pipe(take(1))
      .subscribe((lang) => {
        lastLoadedLang = lang as string;
      });

    // Set the language code in Firebase Authentication.
    await FirebaseAuthentication.setLanguageCode({
      languageCode: lastLoadedLang,
    });
  }
}
