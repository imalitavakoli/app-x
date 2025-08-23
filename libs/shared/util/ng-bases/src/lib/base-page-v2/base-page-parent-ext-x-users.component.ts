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
import { Subscription } from 'rxjs';

import {
  V1Communication_Data,
  V1Communication_Event,
  V1Communication_Data_Util_V2_BasePage_ParentExtU,
  V2BasePage_Error,
  V1Communication_Event_Util_V2_BasePage_ParentExtU,
} from '@x/shared-util-ng-bases-model';
import { V1XUsers_MapUser } from '@x/shared-map-ng-x-users';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { V1XUsersFeaComponent } from '@x/shared-api-feature-ng-x-users';

import { V2BasePageParentComponent } from './base-page-parent.component';

/**
 * Base class for 'page' components that act as a parent
 * (extended-x-users version).
 *
 * NOTE: This Base class is useful for the times that we have ONLY 1 starter
 * lib, and that is XUsers 'feature' lib. As it takes care of this
 * lib's `ready` event callback and stores some variables related to this lib
 * (which are required for other libs to get initialized in HTML later). If you
 * have multiple starter libs, then `V2BasePageParentComponent` Base is an
 * easier choice.
 *
 * Here's how the inherited classes use this (in most cases):
 * 01. Define `starterLib1_xUsersFeaCom` as a `ViewChild`:
 *     `@ViewChild('xUsersFea', { static: false })
 *     override starterLib1_xUsersFeaCom!: V1XUsersFeaComponent;`
 * 02. Override `_xHasRequiredInputs`.
 * 03. Override `_xInitOtherLibs`.
 * 04. Override `_xUpdateOtherLibs`.
 * 05. In HTML, use `isReadyStarterLib1` to init any other 'feature' lib as soon
 *     as this flag is set to true.
 * 06. In HTML, use `onReadyStarterLib1` as the starter lib #1 `isReady` output
 *     callback, and use `onXUsersSelectedUser` as its `selectedUser`
 *     output callback.
 * 07. In HTML, use `xOnError` as 'feature' lib's callback to handle errors that
 *     it may throw (by its `hasError` output): `xOnError({page: 'parent', lib: 'blahblah', error: $event})`.
 * 08. In HTML, use `errors` array to show the errors that 'feature' libs may
 *     emit (e.g., in a popup), and also reset the array (e.g., when the user
 *     closes the popup).
 * 09. Optional! In HTML, you can use `hasRequiredInputs`.
 * 10. Optional! In HTML, you can use `appVersion`.
 * 11. Optional! In HTML, you can use `selectedUserId`, and `selectedUser` for
 *     any other 'feature' lib inputs.
 *
 * IMPORTANT: In HTML, where you wanna initialize the child routes, you should
 * do that ONLY after starter libs are ready:
 * `<div *ngIf="isReadyStarterLib1"><router-outlet></router-outlet></div>`.
 *
 * IMPORTANT: In the HTML of the class that is extending this base class, you
 * should make a reference to `V1XUsersFeaComponent` with 'xUsersFea' name.
 *
 * Here's how other libs ('ui', 'feature', or `page`) may interacts with this:
 * 01. Optional! The lib can fetch `appVersion` via the communication service
 *     (if this parent page itself already had access to it by `app.routes.ts`
 *     file of the app.). e.g., the child routes which are defined in a 'page'
 *     lib (and not directly in the app) can use this data.
 * 02. Optional! The lib can listen to `@V2BasePageParentComponent:Init` event
 *     which gets emitted via the communication service. e.g., the mobile-header
 *     can listen to this event to update its UI layout to 'base', as we are in
 *     a parent (base) page.
 * 03. Optional! A 'page' lib can listen to
 *     `@V2BasePageParentExtXUsersComponent:SelectedUser` event
 *     which gets emitted via the communication service. e.g., the child page
 *     can listen to this event to update its own lib's inputs according to the
 *     new user change data.
 *
 * @export
 * @class V2BasePageParentExtXUsersComponent
 * @typedef {V2BasePageParentExtXUsersComponent}
 */
@Component({
  selector: 'x-page-base-parent-ext-x-users-v2',
  standalone: true,
  template: '',
})
export class V2BasePageParentExtXUsersComponent
  extends V2BasePageParentComponent
  implements AfterContentChecked
{
  /* General //////////////////////////////////////////////////////////////// */

  private readonly _cdref = inject(ChangeDetectorRef);

  // protected _communicationService = inject(V1CommunicationService); // Introduced in the Base.

  // errors: V2BasePage_Error[] = []; // Introduced in the Base.

  // Flags
  // hasRequiredInputs = false; // Introduced in the Base.

  // Fetched data from route
  // appVersion?: string; // Introduced in the Base.

  // Fetched data from 'data-access' libs
  // protected _configDep!: V2Config_MapDep; // Introduced in the Base.
  // protected _baseUrl!: string; // Introduced in the Base.
  // protected _lastLoadedLang!: string; // Introduced in the Base.
  // protected _userId!: number; // Introduced in the Base.

  /* Starter lib #1: X Users //////////////////////////////////////////////// */

  starterLib1_xUsersFeaCom!: V1XUsersFeaComponent;

  isReadyStarterLib1 = false;
  selectedUserId!: number;
  selectedUser!: V1XUsers_MapUser;
  hasSelectedLocMeters = true;

  /* //////////////////////////////////////////////////////////////////////// */
  /* lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngAfterContentChecked(): void {
    this._cdref.detectChanges();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  // Introduced in the Base.
  // protected _xInitOtherLibs(): void { }

  /**
   * A callback method that is invoked by a starter lib's output emit callback.
   * e.g., when something changes in the starter lib (by user interaction), then
   * other libs (which are not starters) may also need to be notified about it!
   * In such case, the starter lib's callback (which is called by one of the
   * starter lib's output events) must call this function, so that we can take
   * care of any TS code updates regarding the libs, according to new changes of
   * the starter lib.
   *
   * **Who calls it?**  a starter lib's output emit callback.
   *
   * **Useful for?** Updating other libs (the ones that are not starter)
   * according to new changes of the starter lib (whom called this function
   * initially).
   *
   * NOTE: This function can be empty in most cases, because libs can get
   * updated autmatically in HTML, if they are already relying on the variables
   * that the starter lib changes as their inputs.
   *
   * @protected
   */
  protected _xUpdateOtherLibs(): void {
    // ...
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X useful functions                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  // Introduced in the Base.
  // protected _xHasRequiredInputs(): boolean {}

  /**
   * Init XUser 'feature' lib as a starter lib.
   *
   * @inheritdoc
   * @protected
   * @returns {boolean}
   */
  protected override _xHasInitStarterLibs(): boolean {
    // Check if the starter lib #1 is ready or not. If it's not ready, then
    // run its initializer function & return false.
    if (!this.isReadyStarterLib1) {
      this._initStarterLib1();
      return false;
    }

    // If we're here, it means that all of the starter libs that we have
    // checked at above code are ready, so we can return true.
    return true;
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Starter lib #1: X Users                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  private _initStarterLib1(): void {
    // This 'feature' lib doesn't need any logic to be executed in TS.
  }

  /** This function is called by the starter lib #1, when lib is ready. */
  onReadyStarterLib1() {
    // Set latest user ID.
    this.selectedUserId = this.starterLib1_xUsersFeaCom.getSelectedUserId();
    this.selectedUser = this.starterLib1_xUsersFeaCom.getSelectedUser();

    // Save the required data to `communicationService` for child routes.
    this._communicationService.storedData = {
      ...this._communicationService.storedData,
      extra: {
        initialUserId: this.starterLib1_xUsersFeaCom.getSelectedUserId(),
        initialUser: this.starterLib1_xUsersFeaCom.getSelectedUser(),
      } as V1Communication_Data_Util_V2_BasePage_ParentExtU,
    } as V1Communication_Data;

    // Set ready flag of this lib to true & call `_xInitAllLibs` to init rest of
    // the libs.
    this.isReadyStarterLib1 = true;
    this._xInitAllLibs();
  }

  /** This function is called by the starter lib #1, when a new user is selected by the user. */
  onXUsersSelectedUser(user: V1XUsers_MapUser) {
    this.selectedUserId = user.id as number;
    this.selectedUser = user;

    // Emit the change for child routes.
    this._communicationService.emitChange({
      type: 'changeByUser',
      name: '@V2BasePageParentExtXUsersComponent:SelectedUser',
      value: {
        user: user,
      } as V1Communication_Event_Util_V2_BasePage_ParentExtU,
    } as V1Communication_Event);

    // Let's call `_xUpdateOtherLibs` function to update libs (if some libs
    // require some TS codes to get updated after user change).
    this._xUpdateOtherLibs();
  }
}
