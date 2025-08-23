import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { V1ToggleMeDirective } from '@x/shared-ui-ng-directives';

import { V1BaseUi_DataType } from '@x/shared-util-ng-bases-model';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { V1BaseUiComponent } from '@x/shared-util-ng-bases';
import { V1XUsers_MapUser } from '@x/shared-map-ng-x-users';

/**
 * X Users sample 'ui' lib.
 *
 * @export
 * @class V1XUsersComponent
 * @typedef {V1XUsersComponent}
 */
@Component({
  selector: 'x-x-users-v1',
  standalone: true,
  imports: [CommonModule, FormsModule, V1ToggleMeDirective, TranslocoDirective],
  templateUrl: './x-users.component.html',
  styleUrl: './x-users.component.scss',
})
export class V1XUsersComponent extends V1BaseUiComponent {
  curr!: V1XUsers_MapUser;

  // protected _state: V1BaseUi_State = 'loading'; // Introduced in base class
  protected override _dataType: V1BaseUi_DataType = 'all';

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Input() users!: V1XUsers_MapUser[];

  @Input() defaultSelectedUser?: V1XUsers_MapUser;

  @Output() selectedUser = new EventEmitter<V1XUsers_MapUser>();

  /* //////////////////////////////////////////////////////////////////////// */
  /* Methods                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  getSelectedUserId() {
    return this.curr.id as number;
  }

  getSelectedUser() {
    return this.curr;
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  onSelectedUser(user: V1XUsers_MapUser) {
    this.curr = user;
    this.selectedUser.emit(user);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X useful functions                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xHasRequiredInputs(): boolean {
    if (!this.users || this.users.length === 0) return false;
    return true;
  }

  protected override _xSetState(): void {
    // Set currently selected user.
    if (!this.defaultSelectedUser) this.curr = this.users[0];
    else this.curr = this.defaultSelectedUser;

    // Set state.
    this.state = 'data';
  }
}
