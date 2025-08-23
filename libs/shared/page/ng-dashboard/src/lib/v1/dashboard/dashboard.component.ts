import {
  AfterContentChecked,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { LottieComponent } from 'ngx-lottie';

import { V1CapacitorCoreService } from '@x/shared-util-ng-capacitor';
import { V2BasePageParentExtXUsersComponent } from '@x/shared-util-ng-bases';
import { V2Config_MapDep } from '@x/shared-map-ng-config';
import { V1XUsers_MapUser } from '@x/shared-map-ng-x-users';
import { V1PopupComponent } from '@x/shared-ui-ng-popup';
import { V1XUsersFeaComponent } from '@x/shared-feature-ng-x-users';
import { V1XProfileImageFeaComponent } from '@x/shared-feature-ng-x-profile-image';
import { V1XProfileInfoFeaComponent } from '@x/shared-feature-ng-x-profile-info';

@Component({
  selector: 'x-dashboard-page-v1',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    LottieComponent,
    V1PopupComponent,
    V1XUsersFeaComponent,
    V1XProfileImageFeaComponent,
    V1XProfileInfoFeaComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class V1DashboardPageComponent extends V2BasePageParentExtXUsersComponent {
  /* General //////////////////////////////////////////////////////////////// */

  capacitorCoreService = inject(V1CapacitorCoreService);
  funsToShowArr!: V2Config_MapDep['ui']['dashboardFuns'];

  /* Starter lib #1: X Users //////////////////////////////////////////////// */

  @ViewChild('xUsersFea', { static: false })
  override starterLib1_xUsersFeaCom!: V1XUsersFeaComponent;

  /* Other lib: Blahblah //////////////////////////////////////////////////// */

  //...

  /* //////////////////////////////////////////////////////////////////////// */
  /* X lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xInitPre(): void {
    super._xInitPre();

    // Understand what 'feature' libs we should show and in what order from DEP config.
    this.funsToShowArr = this._configDep.ui.dashboardFuns;
  }

  protected override _xInitOtherLibs(): void {
    this._initBlahblah();
  }

  protected override _xUpdateOtherLibs(): void {
    this._updateBlahblah();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Starter lib #1: X Users                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  override onXUsersSelectedUser(user: V1XUsers_MapUser) {
    super.onXUsersSelectedUser(user);

    console.log('Selected User:', user);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Other lib: Blahblah                                                      */
  /* //////////////////////////////////////////////////////////////////////// */

  private _initBlahblah() {
    //...
  }

  private _updateBlahblah() {
    //...
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Other lib: X Profile Info                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  onXProfileInfoClickedReadMore() {
    console.log('onXProfileInfoClickedReadMore');
  }
}
