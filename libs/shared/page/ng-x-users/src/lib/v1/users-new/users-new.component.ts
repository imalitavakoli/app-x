import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { V2BasePageChildExtXUsersComponent } from '@x/shared-util-ng-bases';
import { V1XUsers_MapUser } from '@x/shared-map-ng-x-users';

@Component({
  selector: 'x-x-users-new-page-v1',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './users-new.component.html',
  styleUrls: ['./users-new.component.scss'],
})
export class V1XUsersNewPageComponent extends V2BasePageChildExtXUsersComponent {
  /* General //////////////////////////////////////////////////////////////// */

  protected override _pageName = 'Users';
  protected override _urlRoot = '/x-users';

  /* Lib: Blahblah ////////////////////////////////////////////////////////// */

  // ...

  /* //////////////////////////////////////////////////////////////////////// */
  /* X lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xInitPre(): void {
    super._xInitPre();
  }

  protected override _xInit(): void {
    super._xInit();

    // Init other libs.
    this._initBlahblah();
  }

  /** This function is called by `onXUsersSelectedUser` when a new user is selected in the UI. */
  private _update(): void {
    this._updateBlahblah();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lib: X Users                                                             */
  /* //////////////////////////////////////////////////////////////////////// */

  override onXUsersSelectedUser(user: V1XUsers_MapUser) {
    super.onXUsersSelectedUser(user);

    // Update other libs.
    this._update();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lib: Blahblah                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  private _initBlahblah() {
    //...
  }

  private _updateBlahblah() {
    //...
  }
}
