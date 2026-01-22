import {
  Component,
  EventEmitter,
  Input,
  Output,
  WritableSignal,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';

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
  imports: [FormsModule, V1ToggleMeDirective],
  templateUrl: './x-users.component.html',
  styleUrl: './x-users.component.scss',
})
export class V1XUsersComponent extends V1BaseUiComponent {
  curr = signal<V1XUsers_MapUser | undefined>(undefined);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  // state = model<V1BaseUi_State>('loading'); // Introduced in base class
  override dataType = model<V1BaseUi_DataType>('all');

  users = input.required<V1XUsers_MapUser[]>();

  defaultSelectedUser = input<V1XUsers_MapUser | undefined>(undefined);

  selectedUser = output<V1XUsers_MapUser>();

  /* //////////////////////////////////////////////////////////////////////// */
  /* Methods                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  getSelectedUserId() {
    return (this.curr() as V1XUsers_MapUser).id as number;
  }

  getSelectedUser() {
    return this.curr();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  onSelectedUser(user: V1XUsers_MapUser) {
    this.curr.set(user);
    this.selectedUser.emit(user);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X useful functions                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xHasRequiredInputs(): boolean {
    super._xHasRequiredInputs();

    // Read optional inputs to track them.
    this.defaultSelectedUser();

    // Check for required inputs (which also leads to tracking them).
    if (!this.users() || this.users().length === 0) return false;
    return true;
  }

  protected override _xSetState(): void {
    super._xSetState();

    // Set currently selected user.
    if (!this.defaultSelectedUser()) this.curr.set(this.users()[0]);
    else this.curr.set(this.defaultSelectedUser());

    // Set state.
    this.state.set('data');
  }
}
