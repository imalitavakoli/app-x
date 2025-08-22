import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnInit,
  OnDestroy,
  DestroyRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { V1CommunicationService } from '@x/shared-util-ng-services';
import {
  V1Communication_Event,
  V1Communication_Event_Util_V2_BasePage_Child,
} from '@x/shared-util-ng-bases-model';
import { V1CapacitorCoreService } from '@x/shared-util-ng-capacitor';
import { V2Config_MapDep } from '@x/shared-map-ng-config';
import {
  V1AppHeaderDesktopComponent,
  V1AppHeaderMobileComponent,
} from '@x/shared-ui-ng-app-header';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';

@Component({
  selector: 'x-app-header-fea-v1',
  standalone: true,
  imports: [
    CommonModule,
    V1AppHeaderDesktopComponent,
    V1AppHeaderMobileComponent,
    TranslocoDirective,
  ],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
})
export class V1AppHeaderFeaComponent implements OnInit {
  /* General //////////////////////////////////////////////////////////////// */

  protected _destroyRef = inject(DestroyRef);
  private _router = inject(Router);
  readonly configFacade = inject(V2ConfigFacade);
  private readonly _capacitorCoreService = inject(V1CapacitorCoreService);

  platform: 'ios' | 'android' | 'desktop' = 'desktop';

  /* For desktop platform /////////////////////////////////////////////////// */

  // ...

  /* For mobile platform //////////////////////////////////////////////////// */

  private _communicationService = inject(V1CommunicationService);

  currPageRouteName!: string;
  mobileLayout: 'base' | 'inner' = 'base';
  private _mobileLayoutBackUrl = '/';

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Input() isAuthenticated = true;
  @Output() changedPageOnMobile = new EventEmitter<string>();

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit(): void {
    // Understand the current platform that app is running on.
    this.platform = this._capacitorCoreService.getPlatform();

    // Init.
    this._init();
  }

  private _init() {
    // Initialize the header UI based on the platform.
    if (this.platform === 'desktop') {
      this._initForDesktop();
    } else {
      this._initForMobile();
    }
  }

  private _initForDesktop() {
    // For desktop platform, we don't need to do anything special.
  }

  private _initForMobile() {
    // Understand the current page that user is on.
    const url = this._router.url;
    this.currPageRouteName = this._getPageRouteNameFromUrl(url);
    this.changedPageOnMobile.emit(this.currPageRouteName);

    // Listen to the router events to understand the current page when user navigates.
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects; // e.g., '/account?state=contact' or '/dashboard'.
        this.currPageRouteName = this._getPageRouteNameFromUrl(url);
        this.changedPageOnMobile.emit(this.currPageRouteName);
      });

    // Listen to the communication service to understand when user navigates to
    // a child page that requires header to change its layout.
    this._communicationService.changeEmitted$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((action: V1Communication_Event) => {
        // `changeByUser` events.
        if (action.type === 'changeByUser') {
          // Handle layout: inner.
          if (
            action.name === '@V2BasePageChildComponent:Init' ||
            action.name === '@V1AccountPageComponent:StateView'
          ) {
            setTimeout(() => {
              this.mobileLayout = 'inner';
              const value =
                action.value as V1Communication_Event_Util_V2_BasePage_Child;
              this._mobileLayoutBackUrl = value.urlRoot;
            });
          }

          // Handle layout: base.
          if (
            action.name === '@V2BasePageParentComponent:Init' ||
            action.name === '@V1AppFooterMobileComponent:ClickedNavItem'
          ) {
            setTimeout(() => {
              this.mobileLayout = 'base';
            });
          }
        }
      });

    // Listen to the Android native back button event.
    this._capacitorCoreService.onBack
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((e) => {
        this.onClickedGoBack();
      });
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  onClickedGoBack(emit = true): void {
    // Check what to do based on `mobileLayout`.
    if (this.mobileLayout === 'inner') {
      this.mobileLayout = 'base';
      this._router.navigate([this._mobileLayoutBackUrl]);
    } else {
      this._capacitorCoreService.exitApp();
    }
  }

  private _getPageRouteNameFromUrl(url: string): string {
    const matches = url.match(/\/([^/?]+)/);
    if (matches) return matches[1];
    return '';
  }
}
