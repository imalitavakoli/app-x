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
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Params } from '@angular/router';
import { Subscription, take } from 'rxjs';

import { V1CommunicationService } from '@x/shared-util-ng-services';
import {
  V2BasePage_ChildHasIt,
  V1Communication_Data,
  V1Communication_Event,
  V1Communication_Event_Util_V2_BasePage_Child,
  V2BasePage_Error,
} from '@x/shared-util-ng-bases-model';

import { V2BasePageComponent } from './base-page.component';

/**
 * Base class for 'page' components that act as a child (i.e., pages that
 * are children of a parent route).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO INHERIT
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * NOTE: Most subclasses only need steps 01–02 below. Steps 03–05 are for
 * advanced cases that require custom lifecycle logic.
 *
 * 01. Override `_pageName` & `_urlRoot`.
 *     → Identify this child page and its root URL segment.
 *
 * 02. Override `_xHasRequiredInputs`.
 *     → Return whether all required route/query params are present.
 *
 * 03. Override `_xInitPre` (optional, with super call).
 *     → Run setup logic before the main init phase.
 *
 * 04. Override `_xInit` (optional, with super call).
 *     → Run logic during the main init phase (dispatches, subscriptions).
 *
 * 05. Override `_xUpdate` (optional, with super call).
 *     → React to input / route-param changes after init.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ERROR HANDLING
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * In HTML, bind `xOnError` as the callback for every child 'feature'
 * lib's `hasError` output. Errors are forwarded to the parent page via
 * the communication service.
 *
 * Example:
 *   `xOnError({page: 'one', lib: 'blahblah', error: $event})`
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * COMMUNICATION EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * • `@V2BasePageChildComponent:Init` — emitted via the communication
 *   service when this child page initialises. Other libs (ui, feature,
 *   page) can listen to update their layout (e.g., the mobile-header
 *   switches to an 'inner' layout when a child page is active).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HTML HELPERS
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * • `$hasRequiredInputs` — boolean signal; guards rendering until all
 *   required inputs are available.
 * • `$appVersion` — current application version string.
 * • `$id` — unique identifier for this page instance.
 *
 * @export
 * @class V2BasePageChildComponent
 * @typedef {V2BasePageChildComponent}
 */
@Component({
  selector: 'x-page-base-child-v2',
  standalone: true,
  template: '',
})
export abstract class V2BasePageChildComponent
  extends V2BasePageComponent
  implements V2BasePage_ChildHasIt
{
  /* General //////////////////////////////////////////////////////////////// */

  protected _communicationService = inject(V1CommunicationService);

  /**
   * Child page's parent (root) name (e.g., 'Dashboard'). It's in `value`
   * property of `@V2BasePageChildComponent:Init` event which gets emitted via
   * the communication service.
   * It can be useful for the mobile-header 'inner' layout, so that it can show
   * the page name as the title.
   */
  protected _pageName = '';

  /**
   * Child page's parent (root) URL. It's in `value` property of
   * `@V2BasePageChildComponent:Init` event which gets emitted via the
   * communication service.
   * It can be useful for the mobile-header 'inner' layout, so that it can setup
   * its back button navigation URL accordingly.
   */
  protected _urlRoot = '/dashboard';

  // Flags
  // $hasRequiredInputs = signal(false); // Introduced in the Base.

  // Fetched data from route
  // $appVersion = signal(''); // Introduced in the Base.
  /** In edit/one pages, there's always ID parameter. */
  $id = signal<string | number | undefined>(undefined);

  // Fetched data from 'data-access' libs
  // protected _configDep!: V2Config_MapDep; // Introduced in the Base.
  // protected _baseUrl!: string; // Introduced in the Base.
  // protected _lastLoadedLang!: string; // Introduced in the Base.
  // protected _userId!: number; // Introduced in the Base.

  /* //////////////////////////////////////////////////////////////////////// */
  /* X lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   *
   * Fetch `id` from the route params (if it's already provided), fetch
   * `appVersion` via the communication service, and emit an event (via the
   * communication service) to indicate that this page is initialized.
   *
   * @inheritdoc
   * @protected
   */
  protected override _xInitPre(): void {
    super._xInitPre();

    // Get the page current ID (if it's already provided)!
    this._route.params.pipe(take(1)).subscribe((params: Params) => {
      if (params['id']) this.$id.set(params['id']);
    });

    // NOTE: If this is a child route that is defined in the 'page' lib
    // `lib.routes.ts` file (and not the app's `app.routes.ts` file), then
    // `$appVersion` cannot be fetched from the route snapshot... Instead, we
    // can get it from parent via the communication service.
    // NOTE: We should also consider that it might have been set from Auth
    // 'data-access' lib... That's why we're checking if it's truthy in the
    // communication service, only then, we set it for our `$appVersion` signal.
    if (this._communicationService.storedData?.appVersion) {
      this.$appVersion.set(this._communicationService.storedData?.appVersion);
    }

    // Emit an event when this page is initialized.
    // NOTE: Such event can be useful for the mobile-header to update its UI
    // layout to 'inner', as we are in a child (inner) page.
    this._communicationService.emitChange({
      type: 'changeByUser',
      name: '@V2BasePageChildComponent:Init',
      value: {
        urlRoot: this._urlRoot,
        pageName: this._pageName,
      } as V1Communication_Event_Util_V2_BasePage_Child,
    } as V1Communication_Event);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X useful functions                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  // Introduced in the Base.
  // protected _xHasRequiredInputs(): boolean {}

  /**
   * When a 'feature' lib in this (child) page throws an error (by its
   * `hasError` output), this function should be called (as the lib's output
   * callback) to emit the event via the communication service, so that the
   * parent page can handle it appropriately.
   *
   * @example
   * ```html
   * <!-- This is how we can call this function from the HTML of this (child)
   * page, when a 'feature' lib throws an error. -->
   * <x-blahblah
   *   (hasError)="xOnError({page: 'one', lib: 'blahblah', error: $event})"
   * ></x-blahblah>
   * ```
   *
   * @param {V2BasePage_Error} error
   */
  xOnError({
    page = 'child',
    pageTemplate = undefined,
    lib,
    libTemplate = undefined,
    error,
  }: V2BasePage_Error): void {
    this._communicationService.emitChange({
      type: 'error',
      name: '@V2BasePageChildComponent:Error',
      value: {
        page,
        pageTemplate,
        lib,
        libTemplate,
        error,
      } as V2BasePage_Error,
    } as V1Communication_Event);
  }
}
