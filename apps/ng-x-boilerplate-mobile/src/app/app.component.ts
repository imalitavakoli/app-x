import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  PLATFORM_ID,
  Inject,
  DestroyRef,
  isDevMode,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { filter, map, Subscription, switchMap, take, tap } from 'rxjs';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import {
  IonContent,
  IonApp,
  IonRouterOutlet,
  IonHeader,
  IonFooter,
  IonToolbar,
  IonTitle,
} from '@ionic/angular/standalone';

import {
  V1CapacitorAtt_AppTrackingStatusResponse,
  V1CapacitorAttService,
  V1CapacitorCoreService,
  V1CapacitorNotificationService,
} from '@x/shared-util-ng-capacitor';
import {
  V1FirebaseService,
  V1TrackingService,
  V1AuthAutoService,
} from '@x/shared-util-ng-services';
import { V2Config_MapDep, V2Config_MapFirebase } from '@x/shared-map-ng-config';
import { V1IonicAppHolderComponent } from '@x/shared-ui-ng-ionic';
import { V1DaylightComponent } from '@x/shared-ui-ng-daylight';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1AuthFacade } from '@x/shared-data-access-ng-auth';

import { environment } from '../environments/environment';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    V1IonicAppHolderComponent,
    V1DaylightComponent,
  ],
  selector: 'x-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  /* General //////////////////////////////////////////////////////////////// */

  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _cdr = inject(ChangeDetectorRef);
  protected readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _destroyRef = inject(DestroyRef);
  isBrowser = false;

  readonly configFacade = inject(V2ConfigFacade);
  private readonly _authFacade = inject(V1AuthFacade);
  private readonly _firebaseService = inject(V1FirebaseService);
  private readonly _trackingService = inject(V1TrackingService);
  private readonly _capacitorCoreService = inject(V1CapacitorCoreService);
  private readonly _capacitorNotificationService = inject(
    V1CapacitorNotificationService,
  );
  private readonly _authAutoService = inject(V1AuthAutoService);

  platform: 'ios' | 'android' | 'desktop' = 'desktop';

  private _configDep!: V2Config_MapDep; // Hold ALL DEP config.
  private _configFirebase?: V2Config_MapFirebase; // Hold Firebase config.
  private _userId?: number;

  authenticated = false; // Defines whether the user is authenticated or not.

  /* //////////////////////////////////////////////////////////////////////// */
  /* constructor                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  constructor() {
    this.isBrowser = isPlatformBrowser(this._platformId);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit(): void {
    // Let's log the app version to the console.
    console.log(`Boilerplate version: ${environment.version}`);

    // Understand what is the platform that app is running on.
    this.platform = this._capacitorCoreService.getPlatform();

    // Get the DEP config data.
    // NOTE: Rxjs take(1) and first() operators are synchronous, so we can
    // directly use the value from the subscription right after it.
    this.configFacade.dataConfigDep$.pipe(take(1)).subscribe((data) => {
      this._configDep = data as V2Config_MapDep;
    });

    // Get the Firebase config data (available in web-app).
    this.configFacade.dataConfigFirebase$.pipe(take(1)).subscribe((data) => {
      this._configFirebase = data;
    });

    // Keep listening to the auth state to see when the user is logged in.
    // NOTE: We don't unsubscribe from this subscription! Why? Because a user
    // may logout, and another one may login in one single session...
    this._authFacade.authState$.subscribe((state) => {
      // If the user is authenticated.
      if (state.loadedLatest.getToken && state.datas.getToken) {
        const userId = state.datas.getToken.userId;
        this.authenticated = true;
        if (this._userId === userId) return;
        this._userId = userId;
        this._xInitAfterAuth();
      }
      // If the user is NOT authenticated.
      if (!state.datas.getToken) {
        this.authenticated = false;
        this._userId = undefined;
      }
    });

    // Init some libs.
    this._xInit();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X Lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Init the libs EVEN BEFORE the user is logged in.
   *
   * @private
   */
  private _xInit() {
    this._initServices();
  }

  /**
   * Init the libs that MUST be initialized after the user is logged in.
   *
   * @private
   */
  private _xInitAfterAuth() {
    this._initServicesAfterAuth(); // The services (specially the Tracking service) MUST be initialized (prepared) BEFORE any other lib.
    this._initBlahBlah();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Services lib                                                             */
  /* //////////////////////////////////////////////////////////////////////// */

  /** Init the services that can start EVEN BEFORE the user is logged in. */
  private _initServices(): void {
    this._initFirebase(); // Init the whole Firebase service.
    this._initTracking(); // Prepare & init the tracking service.
    this._initAuthAuto(); // Init the auto-login service.
  }

  /** Init the services that MUST start after the user is logged in. */
  private _initServicesAfterAuth(): void {
    this._initTrackingAfterAuth(); // Prepare & init the tracking service AGAIN to ALSO collect the logged in user's ID.
    this._initCapNotification(); // Init the Capaticotr-notification service.
  }

  /* Individual services //////////////////////////////////////////////////// */

  private _initFirebase(): void {
    if (!this._configFirebase) return;
    if (!this._configDep.fun.configs.firebaseIntegration) return;

    // Although Firebase service is mostly useful for desktop platforms (because
    // for mobile platforms we use the native SDKs via Capacitor plugins), we
    // still initialize it for ALL platforms, because in this way, we can use
    // some Firebase features that their Capacitor plugins are not available yet.
    this._firebaseService.init(this._configFirebase, isDevMode());
  }

  private _initTracking(): void {
    this._trackingService.prepare(environment.version);

    // Only init 'analytics' (Firebase) when user is NOT logged in yet.
    // NOTE: As we still don't have the user's ID, it's ok to log generic app
    // events to the Firebase Console...
    this._trackingService.initOrUpdate(['analytics']);
  }

  private _initTrackingAfterAuth(): void {
    this._trackingService.prepare(environment.version);

    // If user IS logged in (i.e., we DO have the user's ID), then init
    // 'analytics' (Firebase) and 'feedbacks' (Appentetive) to also collect
    // user's ID in the events.
    this._trackingService.initOrUpdate(['analytics', 'feedbacks']);
  }

  private _initAuthAuto(): void {
    this._authAutoService
      .autoLogin()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  private _initCapNotification(): void {
    // Helper function to setup the Capacitor notification service.
    const setupCapNotification = (appBundleId: string, deviceUuid: string) => {
      // Request or try registering for push notifications.
      this._capacitorNotificationService.requestOrRegister();

      // Listen for when the push notification is registered successfully.
      this._capacitorNotificationService.onRegistration.subscribe((e) => {
        // NOTE: We have `appBundleId`, `deviceUuid`, and the notification token
        // (`e.token.value`). So we can store such data in our server to
        // identify the user and send her push notifications later...
        // Post the notification token to the server.
      });

      // Listen for when the user performs an action on the push notification.
      this._capacitorNotificationService.onPushNotificationActionPerformed.subscribe(
        (e) => {
          // console.log('Push-Notification-Received:', JSON.stringify(e.action.notification));
        },
      );
    };

    // If we are on desktop or `PushNotifications` plugin is not available, simply return.
    if (this.platform === 'desktop') return;
    if (!this._capacitorCoreService.isPluginAvailable('PushNotifications'))
      return;

    // Let's clear any old badge count (if any) on the app icon.
    this._capacitorNotificationService.removeAllDeliveredNotifications();

    // If we're here, it means that we're on mobile and `PushNotifications`
    // plugin is available... So, let's first fetch some requirements that we
    // may need for push-notifications (e.g., calling an API endpoint).
    const appGetInfoPromise = this._capacitorCoreService.appGetInfo();
    const deviceGetIdPromise = this._capacitorCoreService.deviceGetId();
    Promise.all([appGetInfoPromise, deviceGetIdPromise])
      .then(([appInfo, deviceId]) => {
        // Save the required data.
        const appBundleId = appInfo?.id;
        const deviceUuid = deviceId?.identifier;

        // If we have the required data, then we can continue to setup the
        // push-notification service.
        if (appBundleId && deviceUuid) {
          setupCapNotification(appBundleId, deviceUuid);
        }
      })
      .catch((error) => {
        return; // Just return if we couldn't get the required data.
      });
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* BlahBlah lib                                                             */
  /* //////////////////////////////////////////////////////////////////////// */

  private _initBlahBlah(): void {
    // ...
  }
}
