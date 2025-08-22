import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { V1BaseCoreComponent } from '@x/ng-x-boilerplate-component-util-bases';
import { V1XUsers_MapUser } from '@x/shared-map-ng-x-users';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1XUsersFeaComponent } from '@x/shared-feature-ng-x-users';
import { V1XProfileImageFeaComponent } from '@x/shared-feature-ng-x-profile-image';
import { V1XProfileInfoFeaComponent } from '@x/shared-feature-ng-x-profile-info';

@Component({
  selector: 'x-core-x-full-dashboard-v1',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoDirective,
    V1XUsersFeaComponent,
    V1XProfileImageFeaComponent,
    V1XProfileInfoFeaComponent,
  ],
  templateUrl: './core-x-full-dashboard.component.html',
  styleUrl: './core-x-full-dashboard.component.scss',
})
export class V1CoreXFullDashboardComponent
  extends V1BaseCoreComponent
  implements OnDestroy, AfterContentChecked
{
  /* General //////////////////////////////////////////////////////////////// */

  // isAuthenticated = false; // Introduced in the Base component.

  private readonly _cdref = inject(ChangeDetectorRef);

  /* Initialized inner 'feature' lib related //////////////////////////////// */

  // isReadyToInitLib = false; // Introduced in the Base component.

  /* Inherited children components related ////////////////////////////////// */

  /** @inheritdoc */
  override readonly comName = 'V1CoreXFullDashboardComponent';

  /** @inheritdoc */
  override readonly _coreName = 'x-full-dashboard';

  readonly configFacade = inject(V2ConfigFacade);

  /* Starter lib #1: Users ////////////////////////////////////////////////// */

  @ViewChild('xUsersFea', { static: false })
  starterLib1_xUsersFeaCom!: V1XUsersFeaComponent;

  isReadyStarterLib1 = false;
  selectedUserId!: number;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Input() userId?: string; // e.g., '12345'
  @Input() showProfileImage: 'true' | 'false' = 'true';
  @Input() showProfileInfo: 'true' | 'false' = 'true';

  // profileInfo
  @Input() profileInfo_showBtnReadMore: 'true' | 'false' = 'true';
  @Output() profileInfo_clickedReadMore = new EventEmitter<void>();

  // @Output() hasError = new EventEmitter<{ key: string; value: string }>(); // Introduced in the Base component.
  // @Output() ready = new EventEmitter<void>(); // Introduced in the Base component.

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngAfterContentChecked() {
    this._cdref.detectChanges();
  }

  /**
   * Let's initialze the inner 'feature' lib, now that `isReadyToInitLib` is
   * true, user is authenticated and all data is ready :)
   *
   * @inheritdoc
   */
  protected override _xInitOrUpdateAfterAllDataReady() {
    // Initialize the libs.
    this.isReadyToInitLib = true; // Indicate that 'feature' lib is ready to be initialized in HTML.
    this._initLibs();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions: Init & Update libs                                            */
  /* //////////////////////////////////////////////////////////////////////// */
  /**
   * Init the libs after everything is ready (i.e., after that the starter
   * & post-starter libs are already ready).
   *
   * @private
   * @param {boolean} [runOnlyInitLibs=true] If we have starter (and post-starter) lib(s).
   */
  private _initLibs(runOnlyInitLibs = true): void {
    // Starter & post-starter libs.
    // What's starter lib? It's the one that NEEDS to be initialized first,
    // before post-starter lib and other libs, because all libs depend on
    // its data.
    // What's post-starter lib (or 2post-starter)? It's the one that
    // NEEDS to be initialized after the starter lib and before other libs,
    // because it depends on the starter lib data, and other libs depend on
    // its data.
    if (runOnlyInitLibs) {
      if (!this.isReadyStarterLib1) {
        this._initUsers();
        return;
      }
      return; // Why return here? Because if `runOnlyInitLibs` is true, then it means that we ONLY have to run starter libs, so we don't continue in such case.
    }

    // Initialize other libs.
    this._initBlahBlah();
  }

  /**
   * Update the libs (if required) after user change.
   *
   * @private
   */
  private _updateLibs(): void {
    // Update libs.
    this._updateBlahBlah();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions: Controllers (Initializer)                                     */
  /* //////////////////////////////////////////////////////////////////////// */

  private _initUsers(): void {
    // This 'feature' lib doesn't need any logic to be executed in its init.
  }

  onUsersReady() {
    // Set latest user ID.
    this.selectedUserId = this.starterLib1_xUsersFeaCom.getSelectedUserId();

    // Set the update variable to true.
    this.isReadyStarterLib1 = true;

    // Eventually, this lib was the initializer lib... Now that it is ready,
    // let's call `_initLibs` function once again to initialize post-initializer
    // lib.
    this._initLibs(false);
  }

  onSelectedUser(user: V1XUsers_MapUser) {
    // Set latest user ID.
    this.selectedUserId = this.starterLib1_xUsersFeaCom.getSelectedUserId();

    // Let's call `_updateLibs` function to update the libs (if some libs
    // require some TS codes to get updated after location change).
    this._updateLibs();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions: Bla-blah                                                      */
  /* //////////////////////////////////////////////////////////////////////// */

  private _initBlahBlah() {
    //...
  }

  private _updateBlahBlah() {
    //...
  }
}
