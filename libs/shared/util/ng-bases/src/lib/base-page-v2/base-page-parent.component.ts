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
import { Subscription } from 'rxjs';

import { V1CommunicationService } from '@x/shared-util-ng-services';
import {
  V1Communication_Data,
  V1Communication_Event,
  V2BasePage_Error,
} from '@x/shared-util-ng-bases-model';

import { V2BasePageComponent } from './base-page.component';

/**
 * Base class for 'page' components that act as a parent (i.e., pages that have
 * child routes).
 *
 * Here's a way (#1) that the inherited classes use this:
 * 01. Override `_xHasRequiredInputs`.
 * 02. Override `_xInitPre` (with super call right at the beginning).
 * 03. Override `_xInit` (with super call right at the beginning).
 * 04. Override `_xUpdate` (with super call right at the beginning).
 * 05. Override `_xHasInitStarterLibs`.
 * 06. Override `_xInitOtherLibs`.
 * 07. In HTML, use `xOnError` as 'feature' lib's callback to handle errors that
 *     it may throw (by its `hasError` output): `xOnError({lib: 'blahblah', error: $event})`.
 * 08. In HTML, use `errors` array to show the errors that 'feature' libs may
 *     emit (e.g., in a popup), and also reset the array (e.g., when the user
 *     closes the popup).
 * 09. Optional! In HTML, you can use `hasRequiredInputs`.
 * 10. Optional! In HTML, you can use `appVersion`.
 *
 * Here's also another way (#2) that the inherited classes use this (in most cases):
 * 01. Override `_xHasRequiredInputs`.
 * 02. Override `_xHasInitStarterLibs`.
 * 03. Override `_xInitOtherLibs`.
 * 04. In HTML, use `xOnError` as 'feature' lib's callback to handle errors that
 *     it may throw (by its `hasError` output): `xOnError({page: 'parent', lib: 'blahblah', error: $event})`.
 * 05. In HTML, use `errors` array to show the errors that 'feature' libs may
 *     emit (e.g., in a popup), and also reset the array (e.g., when the user
 *     closes the popup).
 * 06. Optional! In HTML, you can use `hasRequiredInputs`.
 * 07. Optional! In HTML, you can use `appVersion`.
 *
 * IMPORTANT: In HTML, where we wanna initialize the child routes, we should
 * do that ONLY after starter libs are ready:
 * `<div *ngIf="isReadyStarterLib1"><router-outlet></router-outlet></div>`.
 *
 * Here's how other libs ('ui', 'feature', or `page`) may interacts with this:
 * 01. Optional! The lib can fetch `appVersion` via the communication service
 *     (if this parent page itself already had access to it by `app.routes.ts`
 *     file of the app.). e.g., the child routes which are defined in the 'page'
 *     lib (and not straightly in the app) can use this data.
 * 02. Optional! The lib can listen to `@V2BasePageParentComponent:Init` event
 *     which gets emitted via the communication service. e.g., the mobile-header
 *     can listen to this event to update its UI layout to 'base', as we are in
 *     a parent (base) page.
 *
 *
 * @export
 * @class V2BasePageParentComponent
 * @typedef {V2BasePageParentComponent}
 */
@Component({
  selector: 'x-page-base-parent-v2',
  standalone: true,
  template: '',
})
export class V2BasePageParentComponent extends V2BasePageComponent {
  /* General //////////////////////////////////////////////////////////////// */

  protected _communicationService = inject(V1CommunicationService);

  errors: V2BasePage_Error[] = [];

  // Flags
  // hasRequiredInputs = false; // Introduced in the Base.

  // Fetched data from route
  // appVersion?: string; // Introduced in the Base.

  // Fetched data from 'data-access' libs
  // protected _configDep!: V2Config_MapDep; // Introduced in the Base.
  // protected _baseUrl!: string; // Introduced in the Base.
  // protected _lastLoadedLang!: string; // Introduced in the Base.
  // protected _userId!: number; // Introduced in the Base.

  /* //////////////////////////////////////////////////////////////////////// */
  /* X lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Fetch `appVersion` via the communication service, listen to the error
   * events that child routes may emit, and emit an event (via the communication
   * service) to indicate that this page is initialized.
   *
   * @inheritdoc
   * @protected
   */
  protected override _xInitPre(): void {
    super._xInitPre();

    // Save the required data to `communicationService` for child routes.
    this._communicationService.storedData = {
      ...this._communicationService.storedData,
      appVersion: this.appVersion,
    } as V1Communication_Data;

    // Listen to the error events that child routes may emit.
    this._communicationService.changeEmitted$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((action: V1Communication_Event) => {
        // `error` events.
        if (action.type && action.type === 'error') {
          this.xOnError(action.value as V2BasePage_Error);
        }
      });

    // Emit an event when this page is initialized.
    // NOTE: Such event can be useful for the mobile-header to update its UI
    // layout to 'base', as we are in a parent (base) page.
    this._communicationService.emitChange({
      type: 'changeByUser',
      name: '@V2BasePageParentComponent:Init',
    } as V1Communication_Event);
  }

  /**
   * Call `_xInitAllLibs` to start initializing all libs, whether they are
   * starter libs or not.
   *
   * @inheritdoc
   * @protected
   */
  protected override _xInit(): void {
    super._xInit();

    // Start initializing all libs.
    this._xInitAllLibs();
  }

  /**
   * A callback method that is invoked at the initialization phase & starter
   * libs (if there's any) ready callbacks (can happen multiple times, if we
   * have multiple starter libs).
   *
   * **Who calls it?** `_xInit` & starter libs ready callbacks (i.e., function
   * that gets called due to the lib's `ready` output emit), after that their
   * init function (e.g., `_initStarterLib1`) is already called in
   * `_xHasInitStarterLibs` function. So if we have multiple starter libs, then
   * this function will be called multiple times.
   *
   * **Useful for?** Start initializing all of the page libs, whether they are
   * starter libs or not.
   *
   * NOTE: This function calls `_xInitOtherLibs` ONLY once,
   * `_xHasInitStarterLibs` returns true.
   *
   * NOTE: What is a starter lib? It's a 'feature' lib that MUST be initialized
   * BEFORE any other lib in the page! Why such a lib is needed in some pages?
   * Because what it outputs is other libs' required inputs.
   *
   * @protected
   */
  protected _xInitAllLibs(): void {
    // Check if ALL starter libs are ready or not.
    if (!this._xHasInitStarterLibs()) return;

    // If we're here, it means that ALL starter libs are ready, so we can start
    // initializing other libs.
    this._xInitOtherLibs();
  }

  /**
   * A callback method that is invoked once ALL starter libs are ready.
   *
   * **Who calls it?** `_xInitAllLibs`, after that `_xHasInitStarterLibs` returns true.
   *
   * **Useful for?** Initializing other libs (the ones that are not starter).
   *
   * NOTE: This function can be empty in most cases, because we can simply init
   * the lib in HTML by using starter lib's ready flags (e.g.,
   * `isReadyStarterLib1`).
   *
   * @protected
   */
  protected _xInitOtherLibs(): void {
    // ...
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X useful functions                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  // Introduced in the Base.
  // protected _xHasRequiredInputs(): boolean {}

  /**
   * Check if ALL starter libs are ready or not (i.e., their ready callback is
   * called or not). This function is called at the initialization phase
   * (by `_xInitAllLibs`), which can happen multiple times, if we have multiple
   * starter libs.
   *
   * NOTE: In this Base class, we're just simply returning true. But child
   * classes should override this function according to their own logic. Don't
   * have any starter lib? Then you don't need to override this function!
   *
   * NOTE: In HTML, where we wanna initialize the child routes, we may like to
   * do it only after that starter libs are ready... Because sometimes it just
   * makes sense to initialize the whole child route content, by the time that
   * we're already sure that starter libs could get initialized successfully:
   * `<div *ngIf="isReadyStarterLib1"><router-outlet></router-outlet></div>`.
   *
   * @example
   * ```ts
   * isReadyStarterLib1 = false; // Flag to determine if starter lib #1 is ready or not.
   *
   * // Here's an example of how to override this function in a child class.
   * protected override _xHasInitStarterLibs(): boolean {
   *   // Check if the starter lib #1 is ready or not. If it's not ready, then
   *   // run its initializer function & return false.
   *   if (!this.isReadyStarterLib1) {
   *     this._initStarterLib1();
   *     return false;
   *   }
   *
   *   // If we're here, it means that all of the starter libs that we have
   *   // checked at above code are ready, so we can return true.
   *   return true;
   * }
   *
   * // Initializer function of the starter lib #1. This function can be empty
   * // in most cases, because we can simply init the lib in HTML by using
   * // `isReadyStarterLib1` flag.
   * private _initStarterLib1(): void {
   *   // ...
   * }
   *
   * // This function is called by the starter lib #1 `ready` output emit.
   * onReadyStarterLib1(): void {
   *   // Set ready flag of this lib to true & call `_xInitAllLibs` to init rest
   *   // of the libs.
   *   this.isReadyStarterLib1 = true;
   *   this._xInitAllLibs();
   * }
   * ```
   *
   * @protected
   * @returns {boolean}
   */
  protected _xHasInitStarterLibs(): boolean {
    return true;
  }

  /**
   * When a 'feature' lib in this (parent) page throws an error (by its
   * `hasError` output), this function should be called (as the lib's output
   * callback) to save the error in the `errors` array to show it in HTML.
   *
   * NOTE: If the error happens in the child pages, as they are emitting an
   * `error` typed event (`V1Communication_Event`) by the communication
   * service (and we're already listening to that event in `_xInitPre`), then
   * this function will be called automatically.
   *
   * @example
   * ```html
   * <!-- This is how we can call this function from the HTML of this (parent)
   * page, when a 'feature' lib throws an error. -->
   * <x-blahblah
   *   (hasError)="xOnError({page: 'parent', lib: 'blahblah', error: $event})"
   * ></x-blahblah>
   * ```
   *
   * @param {V2BasePage_Error} error
   */
  xOnError({
    page = 'parent',
    pageTemplate = undefined,
    lib,
    libTemplate = undefined,
    error,
  }: V2BasePage_Error): void {
    this.errors.push({ page, pageTemplate, lib, libTemplate, error });
  }
}
