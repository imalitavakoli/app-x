import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Params } from '@angular/router';
import { Subscription, take } from 'rxjs';

import { V1CommunicationService } from '@x/shared-util-ng-services';
import {
  V1Communication_Data,
  V1Communication_Data_Util_V2_BasePage_ParentExtU,
  V1Communication_Event,
  V1Communication_Event_Util_V2_BasePage_Child,
  V1Communication_Event_Util_V2_BasePage_ParentExtU,
  V2BasePage_Error,
} from '@x/shared-util-ng-bases-model';
import { V1XUsers_MapUser } from '@x/shared-map-ng-x-users';

import { V2BasePageChildComponent } from './base-page-child.component';

/**
 * Base class for 'page' components that act as a child
 * (extended-x-users version).
 *
 * NOTE: This Base class is useful for the times that we already have used
 * `V2BasePageParentExtXUsersComponent` Base class for the parent
 * page. As it already has added 'user change' event listener that happens
 * in the parent.
 *
 * Here's how the inherited classes use this (in most cases):
 * 01. Override `_pageName` & `_urlRoot`.
 * 02. Override `_xHasRequiredInputs`.
 * 03. Override `onXUsersSelectedUser` (with super call right at the beginning).
 * 04. In HTML, use `xOnError` as 'feature' lib's callback to handle errors that
 *     it may throw (by its `hasError` output): `xOnError({page: 'one', lib: 'blahblah', error: $event})`.
 * 05. Optional! In HTML, you can Use `hasRequiredInputs`.
 * 06. Optional! In HTML, you can use `appVersion`.
 * 07. Optional! In HTML, you can use `id`.
 * 08. Optional! In HTML, you can use `selectedUserId`, and `selectedUser` for
 *     any other 'feature' lib inputs.
 *
 * Here's how other libs ('ui', 'feature', or `page`) may interacts with this:
 * 01. Optional! The lib can listen to `@V2BasePageChildComponent:Init` event
 *     which gets emitted via the communication service. e.g., the mobile-header
 *     can listen to this event to update its UI layout to 'base', as we are in
 *     a parent (base) page.
 *
 * @export
 * @class V2BasePageChildExtXUsersComponent
 * @typedef {V2BasePageChildExtXUsersComponent}
 */
@Component({
  selector: 'x-page-base-child-ext-x-users-v2',
  standalone: true,
  template: '',
})
export class V2BasePageChildExtXUsersComponent extends V2BasePageChildComponent {
  /* General //////////////////////////////////////////////////////////////// */

  // protected _pageName = ''; // Introduced in the Base.
  // protected _urlRoot = '/dashboard'; // Introduced in the Base.

  // Flags
  // hasRequiredInputs = false; // Introduced in the Base.

  // Fetched data from route
  // appVersion?: string; // Introduced in the Base.
  // id?: string | number; // Introduced in the Base.

  // Fetched data from 'data-access' libs
  // protected _configDep!: V2Config_MapDep; // Introduced in the Base.
  // protected _baseUrl!: string; // Introduced in the Base.
  // protected _lastLoadedLang!: string; // Introduced in the Base.
  // protected _userId!: number; // Introduced in the Base.

  /* Lib: Users ///////////////////////////////////////////////////////////// */

  selectedUserId!: number;
  selectedUser!: V1XUsers_MapUser;

  /* //////////////////////////////////////////////////////////////////////// */
  /* X lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * @inheritdoc
   * @protected
   */
  protected override _xInitPre(): void {
    super._xInitPre();

    // Get the required data from parent via `V1CommunicationService`.
    const extraFromParent = this._communicationService.storedData
      ?.extra as V1Communication_Data_Util_V2_BasePage_ParentExtU;
    if (extraFromParent) {
      this.selectedUserId = extraFromParent.initialUserId;
      this.selectedUser = extraFromParent.initialUser;
    }

    // Listen to the events that parent may emit.
    this._communicationService.changeEmitted$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((action: V1Communication_Event) => {
        // `changeByUser` events.
        if (action.type && action.type === 'changeByUser') {
          if (
            action.name === '@V2BasePageParentExtXUsersComponent:SelectedUser'
          ) {
            const value =
              action.value as V1Communication_Event_Util_V2_BasePage_ParentExtU;
            this.onXUsersSelectedUser(value.user);
          }
        }
      });
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X useful functions                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  // Introduced in the Base.
  // protected _xHasRequiredInputs(): boolean {}

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lib: X Users                                                             */
  /* //////////////////////////////////////////////////////////////////////// */

  /** This function is called by 'X Users' lib, when a new user is selected in the UI. */
  onXUsersSelectedUser(user: V1XUsers_MapUser) {
    this.selectedUserId = user.id as number;
    this.selectedUser = user;
  }
}
