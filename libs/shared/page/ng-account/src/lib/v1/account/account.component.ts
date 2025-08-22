import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { take } from 'rxjs/operators';
import { TranslocoDirective } from '@jsverse/transloco';

import { v1LocalPrefClearAll } from '@x/shared-util-local-storage';
import { V1CommunicationService } from '@x/shared-util-ng-services';
import {
  V1Communication_Event,
  V1Communication_Event_Util_V2_BasePage_Child,
} from '@x/shared-util-ng-bases-model';
import { V1CapacitorCoreService } from '@x/shared-util-ng-capacitor';
import { V1PopupComponent } from '@x/shared-ui-ng-popup';
import { V1AppAccSidebar_State } from '@x/shared-ui-ng-app-acc-sidebar';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1AuthFacade } from '@x/shared-data-access-ng-auth';
import { V1XCreditFacade } from '@x/shared-data-access-ng-x-credit';
import { V1AppAccSidebarFeaComponent } from '@x/shared-feature-ng-app-acc-sidebar';

import { StateGeneralComponent } from './state-general/state-general.component';
import { StateLanguageComponent } from './state-language/state-language.component';

@Component({
  selector: 'x-account-page-v1',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    V1AppAccSidebarFeaComponent,
    V1PopupComponent,
    StateGeneralComponent,
    StateLanguageComponent,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class V1AccountPageComponent implements OnInit {
  readonly configFacade = inject(V2ConfigFacade);
  private readonly _authFacade = inject(V1AuthFacade);
  private readonly _xCreditFacade = inject(V1XCreditFacade);
  protected _communicationService = inject(V1CommunicationService);
  capacitorCoreSerivce = inject(V1CapacitorCoreService);

  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);

  private _stateResetTimeout!: ReturnType<typeof setTimeout>;

  state: V1AppAccSidebar_State = 'none';
  appVersion!: string;

  isStateViewActive = false;
  showPopupLogout = false;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit(): void {
    // Get the app version from the route snapshot! It is provided by
    // `app.routes.ts` file of the app.
    this._route.data.pipe(take(1)).subscribe((data) => {
      this.appVersion = data['appVersion'] || '';
    });

    // Listen to the query params of the route.
    this._route.queryParams.subscribe((params) => {
      // Let's validate the `state` query param! It must be present and be
      // something which we already recognize. We also need to define
      // `isStateViewActive` to true to show the state view directly in mobile
      // devices.
      if (params['state']) {
        if (params['state'] === 'general') {
          this.state = 'general';
          this.isStateViewActive = true;
        } else if (params['state'] === 'language') {
          this.state = 'language';
          this.isStateViewActive = true;
        }
      } else {
        // Reset the state view to show ONLY the sidebar in mobile devices.
        this.state = 'none';
        this.isStateViewActive = false;
      }
    });
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  onLogoutConfirmed() {
    // Logout
    this._authFacade.logout();

    // Navigate to the default page
    // NOTE: Why `{ replaceUrl: true }`? Because in mobile, we're originally
    // redirecting via `ion-router-outlet` through pages.... And Ionic doesn't
    // kill pages (keeps pages in the DOM) when it's navigating between them
    // (to enable travel via the back/forward buttons). But here we wanna kill
    // the page.
    this._router.navigate(['/'], { replaceUrl: true });

    // Clear the 'data-access' state objects & local storage.
    this._stateReset();
  }

  onClickedBack() {
    // Navigate to the base route (of the page) and remove `state` query param.
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: { state: null },
      queryParamsHandling: 'merge',
    });
  }

  /**
   * Emit an event when one of the items in the sidebar is clicked.
   *
   * NOTE: This event can be used by the mobile header to update its layout to
   * 'inner' if it's not already.
   */
  onStateViewActive(): void {
    this._communicationService.emitChange({
      type: 'changeByUser',
      name: '@V1AccountPageComponent:StateView',
      value: {
        urlRoot: '/account',
        pageName: 'Account',
      } as V1Communication_Event_Util_V2_BasePage_Child,
    } as V1Communication_Event);
  }

  /**
   * Reset the state objects of the 'data-access' libraries and local storage
   * items with delay. Why? Because we might have some active subscriptions that
   * are already listening to an entity of some 'data-access' libs (e.g.,
   * 'feature' header & footer are listening to Insights state changes). So
   * if we reset the state immediately, because those libs are not destroyed
   * yet, then we would receive an error...
   *
   * NOTE: Currently we're resetting only the Insights 'data-access' state, but
   * we can reset any other registered states in the app (if it is required in
   * the future).
   *
   * @private
   */
  private _stateReset() {
    this._stateResetTimeout = setTimeout(() => {
      // Reset all used data-access libs in the app
      this._xCreditFacade.resetAll();

      // Reset all LocalStorage preferences
      v1LocalPrefClearAll();
    }, 2000);
  }
}
