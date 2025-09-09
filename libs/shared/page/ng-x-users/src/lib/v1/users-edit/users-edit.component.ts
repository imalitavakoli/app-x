import { Component, OnDestroy, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';

import { V2BasePageChildExtXUsersComponent } from '@x/shared-util-ng-bases';
import { V1XUsers_MapUser } from '@x/shared-map-ng-x-users';

@Component({
  selector: 'x-x-users-edit-page-v1',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss'],
})
export class V1XUsersEditPageComponent extends V2BasePageChildExtXUsersComponent {
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

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lib: Blahblah                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  private _initBlahblah() {
    //...
  }
}
