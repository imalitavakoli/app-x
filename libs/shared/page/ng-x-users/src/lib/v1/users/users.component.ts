import {
  AfterContentChecked,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { LottieComponent } from 'ngx-lottie';

import { V1CapacitorCoreService } from '@x/shared-util-ng-capacitor';
import { V2BasePageParentExtXUsersComponent } from '@x/shared-util-ng-bases';
import { V1PopupComponent } from '@x/shared-ui-ng-popup';
import { V1XUsersFeaComponent } from '@x/shared-feature-ng-x-users';

@Component({
  selector: 'x-x-users-page-v1',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    LottieComponent,
    V1PopupComponent,
    V1XUsersFeaComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class V1XUsersPageComponent extends V2BasePageParentExtXUsersComponent {
  /* General //////////////////////////////////////////////////////////////// */

  capacitorCoreService = inject(V1CapacitorCoreService);

  /* Other lib: Blahblah //////////////////////////////////////////////////// */

  //...

  /* //////////////////////////////////////////////////////////////////////// */
  /* X lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xInitOtherLibs(): void {
    this._initBlahblah();
  }

  protected override _xUpdateOtherLibs(): void {
    this._updateBlahblah();
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
}
