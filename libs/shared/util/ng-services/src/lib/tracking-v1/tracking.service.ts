import { inject, Injectable, isDevMode } from '@angular/core';
import { exhaustMap, filter, take } from 'rxjs';

import { V2Config_MapDep, V2Config_MapFirebase } from '@x/shared-map-ng-config';
import { V2ConfigFacade } from '@x/shared-api-data-access-ng-config';
import { V1AuthFacade } from '@x/shared-api-data-access-ng-auth';
import { V1HtmlEditorService } from '../html-editor-v1/html-editor.service';
import {
  V1CapacitorCoreService,
  V1CapacitorFirebaseAnalyticsService,
} from '@x/shared-util-ng-capacitor';
import { V1ApptentiveService } from '../apptentive-v1/apptentive.service';
import { V1FirebaseService } from '../firebase-v1/firebase.service';

import { TrackingType } from './tracking.interfaces';

/**
 * Tracking service is a Facade service that provides a single interface to
 * interact with multiple user activity tracking services like Apptentive &
 * Firebase.
 *
 * @export
 * @class V1TrackingService
 * @typedef {V1TrackingService}
 */
@Injectable({
  providedIn: 'root',
})
export class V1TrackingService {
  private readonly _configFacade = inject(V2ConfigFacade);
  private readonly _authFacade = inject(V1AuthFacade);

  private readonly _capacitorCoreService = inject(V1CapacitorCoreService);
  readonly capacitorFirebaseAnalyticsService = inject(
    V1CapacitorFirebaseAnalyticsService,
  );
  readonly apptentiveService = inject(V1ApptentiveService);
  readonly firebaseService = inject(V1FirebaseService);

  private _platform: 'ios' | 'android' | 'desktop' = 'desktop';
  private _isNative = false;

  isInitCapacitorFirebaseAnalytics = false;
  isInitApptentive = false;
  isInitFirebaseAnalytics = false;
  isInitGoogleAnalytics = false;

  private _dataConfigDep!: V2Config_MapDep;
  private _dataConfigFirebase?: V2Config_MapFirebase;
  private _userId?: number;

  private _appVersion = '0.0.0';

  /* //////////////////////////////////////////////////////////////////////// */
  /* Methods                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Prepare the tracking service.
   *
   * NOTE: MUST be called BEFORE calling `initOrUpdate`.
   *
   * NOTE: It will be called in `app.component.ts` of the app (after user logs in).
   *
   * NOTE: This method can be called multiple times! If it's called before user
   * login, it only collects (prepares) DEP and Firebase configs. If it's called
   * after user login, it also collects user's ID, which can be used by different
   * tracking 3rd-party services, (such as Firebase Analytics) to collect more
   * user-specific data.
   *
   * @param {string} appVersion
   */
  prepare(appVersion: string) {
    // Understand what is the platform that app is running on.
    this._platform = this._capacitorCoreService.getPlatform();

    // Understand whether we're on native platform or not.
    this._isNative = this._capacitorCoreService.isNativePlatform();

    // Save required data.
    this._appVersion = appVersion;

    // Get required data from DEP and Auth.
    this._configFacade.configState$
      .pipe(
        take(1),
        exhaustMap((state) => {
          // Save required data.
          if (state.dataConfigDep) {
            this._dataConfigDep = state.dataConfigDep;
          }
          if (state.dataConfigFirebase) {
            this._dataConfigFirebase = state.dataConfigFirebase;
          }

          // Switch to the `authState$` Observable.
          return this._authFacade.authState$;
        }),
        take(1),
      )
      .subscribe((state) => {
        // Save required data.
        if (state.datas.getToken?.userId) {
          this._userId = state.datas.getToken?.userId;
        }
      });
  }

  /**
   * Initialize/Update the tracking services.
   *
   * NOTE: MUST be called BEFORE calling `logEvent`.
   *
   * NOTE: This method can be called multiple times! First time, it initializes
   * the tracking services (even if user in not login yet), and the next times,
   * it updates the tracking services... Mostly useful, to update the services
   * with the user's ID (whenever she is logged in or when the previous logged
   * in user logs out, and another user logs in to the app in the very same
   * app session).
   *
   * @param {TrackingType[]} types
   */
  initOrUpdate(types: TrackingType[]) {
    if (types.includes('feedbacks')) {
      this._initApptentive();
    }

    if (types.includes('analytics')) {
      if (this._isNative) this._initCapacitorFirebaseAnalytics();
      else this._initFirebaseAnalytics();

      this._initGoogleAnalytics();
    }
  }

  /**
   * Log custom events to Apptentive & Firebase.
   *
   * NOTE: MUST be called AFTER calling `initOrUpdate`.
   *
   * NOTE: It will be called from the 'feature' libs most of the times.
   *
   * NOTE: Event name should follow 'GA4' naming rules. schema is: `libName_eventName`.
   * e.g., `advisoryCard_init`, `advisoryCard_clickedAdvice`.
   *
   * @example
   * this._trackingService.logEvent('advisoryCard_loadedAdvice', { data: 'something' });
   *
   * @param {string} name
   * @param {*} [data=undefined]
   */
  logEvent(name: string, data: any = undefined) {
    if (this.isInitApptentive) {
      this.apptentiveService.engage(name, data);
    }

    if (this.isInitCapacitorFirebaseAnalytics) {
      this.capacitorFirebaseAnalyticsService.logEvent(name, data);
    }
    if (this.isInitFirebaseAnalytics) {
      this.firebaseService.analyticsLogEvent(name, data);
    }
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Funtions: Capacitor plugin (Firebase-Analytics)                          */
  /* //////////////////////////////////////////////////////////////////////// */

  private _initCapacitorFirebaseAnalytics() {
    // Do not continue if NOT all requirements are set.
    if (!this._dataConfigDep.fun.configs.firebaseIntegration) return;

    // Call update once, and do not continue if already initialized.
    this._updateCapacitorFirebaseAnalytics();
    if (this.isInitCapacitorFirebaseAnalytics) return;

    // init...
    this.capacitorFirebaseAnalyticsService.autoScreenTracking();

    // Set init flag to true, and call update again (to do the rest of the work,
    // if the first update call couldn't do its job as we were not initialized
    // yet).
    this.isInitCapacitorFirebaseAnalytics = true;
    this._updateCapacitorFirebaseAnalytics();
  }

  private _updateCapacitorFirebaseAnalytics() {
    // Do not continue if already NOT initialized.
    if (!this.isInitCapacitorFirebaseAnalytics) return;

    // Update...
    if (this._userId)
      this.capacitorFirebaseAnalyticsService.setUserId(this._userId);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Funtions: Apptentive                                                     */
  /* //////////////////////////////////////////////////////////////////////// */

  private _initApptentive() {
    // Do not continue if NOT all requirements are set.
    if (!this._dataConfigDep) return;
    if (!this._dataConfigDep.fun.feat.apptentive?.projectId) return;

    // Call update once, and do not continue if already initialized.
    this._updateApptentive();
    if (this.isInitApptentive) return;

    // init...
    this.apptentiveService.init(
      this._dataConfigDep.fun.feat.apptentive.projectId,
      isDevMode(),
    );
    this.apptentiveService.createConversation(this._appVersion);
    this.apptentiveService.autoScreenTracking();

    // Set init flag to true, and call update again (to do the rest of the work,
    // if the first update call couldn't do its job as we were not initialized
    // yet).
    this.isInitApptentive = true;
    this._updateApptentive();
  }

  private _updateApptentive() {
    // Do not continue if already NOT initialized.
    if (!this.isInitApptentive) return;

    // Update...
    if (this._userId) this.apptentiveService.identifyPerson(this._userId);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Funtions: Firebase-Analytics                                             */
  /* //////////////////////////////////////////////////////////////////////// */

  private _initFirebaseAnalytics() {
    // Do not continue if NOT all requirements are set.
    if (!this._dataConfigFirebase) return;
    if (!this._dataConfigDep.fun.configs.firebaseIntegration) return;

    // Call update once, and do not continue if already initialized.
    this._updateFirebaseAnalytics();
    if (this.isInitFirebaseAnalytics) return;

    // init...
    this.firebaseService.analyticsAutoScreenTracking();

    // Set init flag to true, and call update again (to do the rest of the work,
    // if the first update call couldn't do its job as we were not initialized
    // yet).
    this.isInitFirebaseAnalytics = true;
    this._updateFirebaseAnalytics();
  }

  private _updateFirebaseAnalytics() {
    // Do not continue if already NOT initialized.
    if (!this.isInitFirebaseAnalytics) return;

    // Update...
    if (this._userId) this.firebaseService.analyticsSetUserId(this._userId);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Funtions: GoogleAnalytics                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Initialize Google Analytics.
   * Read more: https://developers.google.com/analytics/devguides/collection/ga4/events?client_type=gtag
   *
   * @private
   */
  private _initGoogleAnalytics() {
    // Do not continue if NOT all requirements are set.
    if (!this._dataConfigDep) return;
    if (this._dataConfigDep.fun.configs.firebaseIntegration) return;
    if (this._dataConfigDep.fun.configs.googleAnalyticsMeasurementId === '')
      return;

    // Call update once, and do not continue if already initialized.
    this._updateGoogleAnalytics();
    if (this.isInitGoogleAnalytics) return;

    // init...
    const measurementId =
      this._dataConfigDep.fun.configs.googleAnalyticsMeasurementId;

    V1HtmlEditorService.insertScript(
      `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
    );

    V1HtmlEditorService.insertScript(
      `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}');
      `,
    );

    // Set init flag to true, and call update again (to do the rest of the work,
    // if the first update call couldn't do its job as we were not initialized
    // yet).
    this.isInitGoogleAnalytics = true;
    this._updateGoogleAnalytics();
  }

  private _updateGoogleAnalytics() {
    // Do not continue if already NOT initialized.
    if (!this.isInitGoogleAnalytics) return;

    // Update...
  }
}
