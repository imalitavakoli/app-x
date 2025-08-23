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
import { V1XUsers_MapUser } from '@x/shared-map-ng-x-users';
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

  /* Starter lib #1: X Users //////////////////////////////////////////////// */

  @ViewChild('xUsersFea', { static: false })
  override starterLib1_xUsersFeaCom!: V1XUsersFeaComponent;

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
  /* Starter lib #1: X Users                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  override onXUsersSelectedUser(user: V1XUsers_MapUser) {
    super.onXUsersSelectedUser(user);

    console.log('Selected User (parent):', user);

    // Navigate to the selected user page.
    // NOTE: In 'one', child page we are NOT overriding `onXUsersSelectedUser`
    // function! Because here in this 'all' page, we're immediately navigating
    // to 'one' page as soon as a user is selected! So basically 'one' page
    // gets initialized each time this function is called (i.e., a new user is
    // selected), and we already have access to the page's `id` in its route...
    // So it doesn't make sense to also listen to the user selection event, that
    // is overriding this function.
    // This is also true about other child pages, except 'all' page which is
    // already part of the parent page's UI.
    //
    // NOTE: At the end of the day, all of this depends on your logic! Maybe in
    // your apps, you don't like to navigate to the 'one' page when a user is
    // selected, and instead you prefer to listen to the user change event
    // (i.e., overriding this function in the child pages) and do some other
    // stuff in there.
    this._router.navigate(['./', user.id], { relativeTo: this._route });
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
