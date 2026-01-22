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
  V1Communication_Data,
  V1Communication_Event,
  V1Communication_Event_Util_V2_BasePage_Child,
  V2BasePage_Error,
} from '@x/shared-util-ng-bases-model';

import { V2BasePageComponent } from './base-page.component';

/**
 * Base class for 'page' components that act as a child (i.e., pages that are
 * child of a parent route).
 *
 * Here's a way (#1) that the inherited classes use this:
 * 01. Override `_pageName` & `_urlRoot`.
 * 02. Override `_xHasRequiredInputs`.
 * 03. Override `_xInitPre` (with super call right at the beginning).
 * 04. Override `_xInit` (with super call right at the beginning).
 * 05. Override `_xUpdate` (with super call right at the beginning).
 * 06. In HTML, use `xOnError` as 'feature' lib's callback to handle errors that
 *     it may throw (by its `hasError` output): `xOnError({page: 'one', lib: 'blahblah', error: $event})`.
 * 07. Optional! In HTML, you can Use `hasRequiredInputs`.
 * 08. Optional! In HTML, you can use `appVersion`.
 * 09. Optional! In HTML, you can use `id`.
 *
 * Here's also another way (#2) that the inherited classes use this (in most cases):
 * 01. Override `_pageName` & `_urlRoot`.
 * 02. Override `_xHasRequiredInputs`.
 * 03. In HTML, use `xOnError` as 'feature' lib's callback to handle errors that
 *     it may throw (by its `hasError` output): `xOnError({page: 'one', lib: 'blahblah', error: $event})`.
 * 04. Optional! In HTML, you can Use `hasRequiredInputs`.
 * 05. Optional! In HTML, you can use `appVersion`.
 * 06. Optional! In HTML, you can use `id`.
 *
 * Here's how other libs ('ui', 'feature', or `page`) may interacts with this:
 * 01. Optional! The lib can listen to `@V2BasePageChildComponent:Init` event
 *     which gets emitted via the communication service. e.g., the mobile-header
 *     can listen to this event to update its UI layout to 'inner', as we are in
 *     a child page.
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
export class V2BasePageChildComponent extends V2BasePageComponent {
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
  // hasRequiredInputs = signal(false); // Introduced in the Base.

  // Fetched data from route
  // appVersion = signal(''); // Introduced in the Base.

  /** In edit/one pages, there's always ID parameter. */
  id = signal<string | number | undefined>(undefined);

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
      if (params['id']) this.id.set(params['id']);
    });

    // NOTE: If this is a child route that is defined in the 'page' lib
    // `lib.routes.ts` file (and not the app's `app.routes.ts` file), then
    // `appVersion` cannot be fetched from the route snapshot... Instead, we can
    // get it from parent via the communication service.
    this.appVersion.set(
      this._communicationService.storedData?.appVersion ?? '',
    );

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
