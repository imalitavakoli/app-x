import { inject, Injectable, NgZone } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { FirebaseAnalytics } from '@capacitor-firebase/analytics';

@Injectable({
  providedIn: 'root',
})
export class V1CapacitorFirebaseAnalyticsService {
  /* General //////////////////////////////////////////////////////////////// */

  private readonly _ngZone = inject(NgZone);
  private _router = inject(Router);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Methods                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  async logEvent(name: string, data: any = undefined) {
    await FirebaseAnalytics.logEvent({
      name: name,
      params: data,
    });
  }

  async logScreen(name: string) {
    await FirebaseAnalytics.setCurrentScreen({
      screenName: name,
    });

    // await FirebaseAnalytics.logEvent({
    //   name: 'screen_view',
    //   params: { firebase_screen: name },
    // });
  }

  async setUserId(id: number) {
    await FirebaseAnalytics.setUserId({
      userId: id.toString(),
    });

    // Now that we're setting the user's ID (user is already logged in to the
    // app), let's make sure 'personalized advertising features' is enabled.
    // Read more: https://firebase.google.com/docs/analytics/configure-data-collection?platform=android#control-data-collection-for-personalized-advertising
    await FirebaseAnalytics.setUserProperty({
      key: 'allow_ad_personalization_signals',
      value: 'true',
    });

    // Let's make sure 'analytics collection' is enabled.
    // Read more: https://firebase.google.com/docs/analytics/configure-data-collection?platform=android
    await FirebaseAnalytics.setEnabled({
      enabled: true,
    });
  }

  /** Call `logScreen` when page navigation (routing) happens automatically */
  autoScreenTracking() {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.logScreen(event.urlAfterRedirects);
      }
    });
  }
}
