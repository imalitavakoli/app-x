import { inject, Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as firebase from 'firebase/app';
import * as fireAnalytics from 'firebase/analytics';
import { V1HtmlEditorService } from '../html-editor-v1/html-editor.service';
import { FirebaseConfig } from './firebase.interfaces';

/**
 * In this service, we provide the Firebase services. Such as Analytics.
 *
 * It can be initialized in different ways:
 *
 * 1. By using `@angular/fire` package and its new tree-shakable API.
 *    Read more: https://github.com/angular/angularfire/blob/main/docs/analytics.md
 * ```ts
 * // app.config.ts
 * import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
 * import { provideAnalytics, getAnalytics, ScreenTrackingService } from '@angular/fire/analytics';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideFirebaseApp(() => initializeApp({ ... })),
 *     provideAnalytics(() => getAnalytics()),
 *     ScreenTrackingService,
 *     ...
 *   ],
 *   ...,
 * }
 *
 * // app.component.ts
 * import { Component, inject, OnInit } from '@angular/core';
 * import { Analytics, logEvent } from '@angular/fire/analytics';
 *
 * @Component({ ... })
 * export class AppComponent implements OnInit {
 *   private _analytics = inject(Analytics);
 *
 *   ngOnInit(): void {
 *     logEvent(this._analytics, 'event_name', { component: 'AppComponent' });
 *   }
 * }
 * ```
 *
 * 2. By using `@angular/fire` package and its old "compatibility" API.
 *    Read more: https://github.com/angular/angularfire/blob/main/docs/compat/analytics/getting-started.md
 * ```ts
 * // app.config.ts
 * import { importProvidersFrom, isDevMode } from '@angular/core'
 * import { AngularFireModule } from '@angular/fire/compat'
 * import { AngularFireAnalyticsModule, CONFIG, DEBUG_MODE, ScreenTrackingService } from '@angular/fire/compat/analytics'
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     {
 *       provide: CONFIG,
 *       useValue: {
 *         send_page_view: true,
 *       },
 *     },
 *     { provide: DEBUG_MODE, useValue: isDevMode() },
 *     importProvidersFrom(
 *       AngularFireModule.initializeApp({ ... }),
 *       AngularFireAnalyticsModule,
 *     ),
 *     ScreenTrackingService,
 *     ...
 *   ],
 *   ...,
 * }
 *
 * // app.component.ts
 * import { Component, inject, OnInit } from '@angular/core';
 * import { AngularFireAnalytics } from '@angular/fire/compat/analytics'
 *
 * @Component({ ... })
 * export class AppComponent implements OnInit {
 *   private _analytics = inject(AngularFireAnalytics);
 *
 *   ngOnInit(): void {
 *     this._analytics.logEvent('event_name', { component: 'AppComponent' });
 *   }
 * }
 * ```
 *
 * 3. By using the official Firebase JS SDK itself, which is what we are doing
 * here. Why? Because we like to easily provide the Firebase configuration
 * dynamically, which is not supported by `@angular/fire` package (at least not
 * currently).
 *
 * NOTE: Here in this service, because we're using the JS SDK itself (and we're
 * not taking advantage of the `ScreenTrackingService` service in the
 * `@angular/fire` package), we manually log `screen_view` events
 * ourselves when we route to a new page.
 *
 * @export
 * @class V1FirebaseService
 * @typedef {V1FirebaseService}
 */
@Injectable({
  providedIn: 'root',
})
export class V1FirebaseService {
  private _router = inject(Router);
  private _analytics!: fireAnalytics.Analytics;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Methods                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Initialize Firebase service by using the official Firebase JS SDK which is
   * installed in the workspace via the npm package.
   *
   * @param {FirebaseConfig} config
   * @param {boolean} [isDebug=false]
   */
  init(config: FirebaseConfig, isDebug = false) {
    // Init Firebase.
    const app = firebase.initializeApp(config);
    if (isDebug) firebase.setLogLevel('verbose');

    // Init Firebase Analytics.
    this._analytics = fireAnalytics.getAnalytics(app);
  }

  /* Analytics ////////////////////////////////////////////////////////////// */

  analyticsLogEvent(name: string, data: any = undefined) {
    fireAnalytics.logEvent(this._analytics, name, data);
  }

  analyticsLogScreen(name: string) {
    fireAnalytics.logEvent(this._analytics, 'screen_view' as string, {
      firebase_screen: name,
    });
  }

  analyticsSetUserId(id: number) {
    fireAnalytics.setUserId(this._analytics, id.toString());
  }

  /** Call `analyticsLogScreen` when page navigation (routing) happens automatically */
  analyticsAutoScreenTracking() {
    this._analyticsAutoScreenTracking(false);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* By CDN: Methods                                                          */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Initialize Firebase service by using the official Firebase CDN which we are
   * directly importing in `index.html` file of our app.
   *
   * @param {FirebaseConfig} config
   * @param {boolean} [isDebug=false]
   */
  initByCdn(config: FirebaseConfig, isDebug = false) {
    V1HtmlEditorService.insertScript(
      `
      // Import the functions from the SDKs
      import * as firebase from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
      import * as fireAnalytics from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";
      
      // Init Firebase.
      const config = ${JSON.stringify(config)};
      const app = firebase.initializeApp(config);
      if (${isDebug}) firebase.setLogLevel('verbose');

      // Init Firebase Analytics.
      window.eFireAnalytics = fireAnalytics;
      window.eAnalytics = window.eFireAnalytics.getAnalytics(app);
      `,
      true,
      false,
    );
  }

  /* Analytics ////////////////////////////////////////////////////////////// */

  analyticsLogEventByCdn(name: string, data: any = undefined) {
    const w = window as any;
    w.eFireAnalytics.logEvent(w.eAnalytics, name, data);
  }

  analyticsLogScreenByCdn(name: string) {
    const w = window as any;
    w.eFireAnalytics.logEvent(w.eAnalytics, 'screen_view', {
      firebase_screen: name,
    });
  }

  analyticsSetUserIdByCdn(id: number) {
    const w = window as any;
    w.eFireAnalytics.setUserId(w.eAnalytics, id.toString());
  }

  /** Call `analyticsLogScreenByCdn` when page navigation (routing) happens automatically */
  analyticsAutoScreenTrackingByCdn() {
    this._analyticsAutoScreenTracking(true);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Useful                                                                   */
  /* //////////////////////////////////////////////////////////////////////// */

  /* Analytics ////////////////////////////////////////////////////////////// */

  private _analyticsAutoScreenTracking(isCdn = false) {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (!isCdn) this.analyticsLogScreen(event.urlAfterRedirects);
        else this.analyticsLogScreenByCdn(event.urlAfterRedirects);
      }
    });
  }
}
