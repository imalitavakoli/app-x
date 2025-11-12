import { isPlatformBrowser } from '@angular/common';
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
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { take, tap } from 'rxjs';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';

import { V1CapacitorCoreService } from '@x/shared-util-ng-capacitor';
import {
  V1FirebaseService,
  V1TrackingService,
  V1AuthAutoService,
} from '@x/shared-util-ng-services';
import { V2Config_MapDep, V2Config_MapFirebase } from '@x/shared-map-ng-config';
import { WindowMetadata } from '@x/ng-x-boilerplate-desktop-map-native-bridge';
import { V1IonicAppHolderComponent } from '@x/shared-ui-ng-ionic';
import { V1DaylightComponent } from '@x/shared-ui-ng-daylight';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1AuthFacade } from '@x/shared-data-access-ng-auth';
import { NativeBridgeFacade } from '@x/ng-x-boilerplate-desktop-data-access-native-bridge';

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
  private readonly _route = inject(ActivatedRoute);
  private readonly _destroyRef = inject(DestroyRef);
  isBrowser = false;

  readonly configFacade = inject(V2ConfigFacade);
  private readonly _authFacade = inject(V1AuthFacade);
  private readonly _firebaseService = inject(V1FirebaseService);
  private readonly _trackingService = inject(V1TrackingService);
  private readonly _capacitorCoreService = inject(V1CapacitorCoreService);
  private readonly _authAutoService = inject(V1AuthAutoService);

  platform: 'ios' | 'android' | 'desktop' = 'desktop';

  private _configDep!: V2Config_MapDep; // Hold ALL DEP config.
  private _configFirebase?: V2Config_MapFirebase; // Hold Firebase config.
  private _userId?: number;

  authenticated = false; // Defines whether the user is authenticated or not.
  isOutletAnimating = false;

  /* Native desktop related ///////////////////////////////////////////////// */

  private _currWinManualId?: string;
  private _currWinNativeId?: number;

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
    console.log(`XBoilerplateDesktop version: ${environment.version}`);

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
  /* X lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Init the libs EVEN BEFORE the user is logged in.
   *
   * @protected
   */
  protected _xInit() {
    this._initNativeDesktopSetup();
    this._initServices();
  }

  /**
   * Init the libs that MUST be initialized after the user is logged in.
   *
   * @protected
   */
  protected _xInitAfterAuth() {
    this._initServicesAfterAuth(); // The services (specially the Tracking service) MUST be initialized (prepared) BEFORE any other lib.
    this._initBlahBlah();
  }

  /**
   * All native app related initializations.
   *
   * @private
   */
  private _initNativeDesktopSetup() {
    window.electron_app.getElectronAppVersion().then((version: string) => {
      console.log('Electron app version:', version);
    });

    window.electron_app.getElectronAppName().then((appName: string) => {
      console.log('Electron app name:', appName);
    });

    window.electron_winManager
      .getWindowInfo()
      .then((metadata: WindowMetadata | null) => {
        this._currWinManualId = metadata?.manualWinId;
        this._currWinNativeId = metadata?.nativeWinId;
        console.log('Current window manual id:', this._currWinManualId);
        console.log('Current window native id:', this._currWinNativeId);
      });
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Services lib                                                             */
  /* //////////////////////////////////////////////////////////////////////// */

  /** Init the services that can start EVEN BEFORE the user is logged in. */
  private _initServices(): void {
    this._initTracking(); // Prepare & init the tracking service.
    this._initAuthAuto(); // Init the auto-login service.
  }

  /** Init the services that MUST start after the user is logged in. */
  private _initServicesAfterAuth(): void {
    this._initTrackingAfterAuth(); // Prepare & init the tracking service AGAIN to ALSO collect the logged in user's ID.
  }

  /* Individual services //////////////////////////////////////////////////// */

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

  /* //////////////////////////////////////////////////////////////////////// */
  /* BlahBlah lib                                                             */
  /* //////////////////////////////////////////////////////////////////////// */

  private _initBlahBlah(): void {
    // ...
  }
}
