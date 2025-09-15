import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  PLATFORM_ID,
  Inject,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { take, tap } from 'rxjs';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';

import {
  V1TrackingService,
  V1AuthAutoService,
} from '@x/shared-util-ng-services';
import { V1CapacitorCoreService } from '@x/shared-util-ng-capacitor';
import { V2Config_MapDep } from '@x/shared-map-ng-config';
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
  private readonly _route = inject(ActivatedRoute);
  private readonly _destroyRef = inject(DestroyRef);
  isBrowser = false;

  readonly configFacade = inject(V2ConfigFacade);
  private readonly _authFacade = inject(V1AuthFacade);
  private readonly _trackingService = inject(V1TrackingService);
  private readonly _capacitorCoreService = inject(V1CapacitorCoreService);
  private readonly _authAutoService = inject(V1AuthAutoService);

  platform: 'ios' | 'android' | 'desktop' = 'desktop';

  private _configDep!: V2Config_MapDep; // Hold ALL DEP config.
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
    console.log(`XBoilerplateWeb version: ${environment.version}`);

    // Understand what is the platform that app is running on.
    this.platform = this._capacitorCoreService.getPlatform();

    // Get the DEP config data.
    // NOTE: Rxjs take(1) and first() operators are synchronous, so we can
    // directly use the value from the subscription right after it.
    this.configFacade.dataConfigDep$.pipe(take(1)).subscribe((data) => {
      this._configDep = data as V2Config_MapDep;
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

  /* //////////////////////////////////////////////////////////////////////// */
  /* Services lib                                                             */
  /* //////////////////////////////////////////////////////////////////////// */

  /** Init the services that can start EVEN BEFORE the user is logged in. */
  private _initServices(): void {
    this._initAuthAuto(); // Init the auto-login service.
  }

  /** Init the services that MUST start after the user is logged in. */
  private _initServicesAfterAuth(): void {
    this._initTracking(); // Init the tracking service.
  }

  /* Individual services //////////////////////////////////////////////////// */

  private _initAuthAuto(): void {
    this._authAutoService
      .autoLogin()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  private _initTracking(): void {
    // NOTE: We don't need to call the `init` method of the service individually
    // here after `prepare`! Because the service itself understands that if the
    // `consentsTracking` property is NOT truthy in the DEP config, then it
    // should initialize the tracking services.
    this._trackingService.prepare(environment.version);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* BlahBlah lib                                                             */
  /* //////////////////////////////////////////////////////////////////////// */

  private _initBlahBlah(): void {
    // ...
  }
}
