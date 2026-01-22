import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  model,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import {
  V1BaseUi_DataType,
  V1BaseUi_State,
} from '@x/shared-util-ng-bases-model';

import { V1BaseFunComponent } from '../base-fun-v1/base-fun.component';

/**
 * Base class for all 'ui' components.
 *
 * Here's a way (#1) that the inherited classes use this:
 * 01. Override `_xInitPreBeforeDom` (with super call right at the beginning).
 * 02. Override `dataType`.
 * 03. Override `_xHasRequiredInputs` (with super call right at the beginning).
 * 04. Override `_xInitPre` (with super call right at the beginning).
 * 05. Override `_xInit` (with super call right at the beginning).
 * 06. Override `_xUpdate` (with super call right at the beginning). When having
 *     `@Input` (zone.js), you may use `_xIsInputChanged` inside of this function.
 * 07. Override `_xSetState` (with super call right at the beginning). Here you
 *     change `state` & `dataType` inputs.
 *
 * Here's also another way (#2) that the inherited classes use this (in most cases):
 * 01. Override `_xInitPreBeforeDom` (with super call right at the beginning).
 * 02. Override `dataType`.
 * 03. Override `_xHasRequiredInputs` (with super call right at the beginning).
 * 04. Override `_xInitPre` (with super call right at the beginning).
 * 05. Override `_xSetState` (with super call right at the beginning). Here you
 *     change `state` & `dataType` inputs.
 *
 * Here's how the 'feature' lib interacts with this:
 * 01. The lib initializes this component in its HTML.
 * 02. The lib provides this component's required inputs.
 * 03. When the lib calls its API endpoints (at initialization phase or whenever
 *     its inputs are changed), while it's waiting for the data, it defines
 *     this component's `state` input to 'loading'.
 * 04. When the lib's API endpoints return data, it changes this component's
 *     `state` input to other states, according to the fetched data. According
 *     to the lib's logic, it may also define the `dataType` input to the type
 *     that explains the fetched data the best.
 *
 * @export
 * @class V1BaseUiComponent
 * @typedef {V1BaseUiComponent}
 */
@Component({
  selector: 'x-ui-base-v1',
  standalone: true,
  template: '',
})
export class V1BaseUiComponent extends V1BaseFunComponent implements OnChanges {
  /* General //////////////////////////////////////////////////////////////// */

  // ...

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * UI state. It's a two-way binding property. 'feature' lib may change it to
   * 'loading' while its waiting for its API endpoints to return data, and then
   * it can be changed to other states, according to the fetched data. The 'ui'
   * lib itself can also change it, according to the value of its
   * required/optional inputs & its own logic.
   *
   * @type {V1BaseUi_State}
   */
  state = model<V1BaseUi_State>('loading');

  /**
   * Type of data that this 'ui' lib is suppose to present in HTML. It's a
   * two-way binding property. 'feature' lib defines this according to the
   * fetched data. The 'ui' lib itself can also change it, according to the
   * value of its required/optional inputs & its own logic.
   *
   * NOTE: This 'ui' lib can always present one type of data, or multiple
   * types... It all depends on the lib's logic.
   *
   * NOTE: Default value of this input MUST be defined in the inherited class.
   *
   * @type {!V1BaseUi_DataType}
   */
  dataType = model.required<V1BaseUi_DataType>();

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  override ngOnChanges(changes?: SimpleChanges): void {
    super.ngOnChanges(changes);

    // If the component is already initialized (i.e., ALL required inputs have
    // been defined) once, and now the required inputs are not defined anymore,
    // then we set the state to 'loading', in order to prevent showing broken
    // UI in HTML... Whenever the required inputs are defined again,
    // `_xSetState` will be called, and in that function, the state can be set
    // to other states once again.
    if (this._isXInit && !this._xHasRequiredInputs()) this.state.set('loading');
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   *
   * Prepare the component in HTML.
   *
   * @inheritdoc
   * @protected
   */
  protected override _xInitPre(): void {
    super._xInitPre();
  }

  /**
   *
   * Init the component in TS. And setting the component's state to show related
   * content in HTML.
   *
   * @inheritdoc
   * @protected
   */
  protected override _xInit(): void {
    super._xInit();
    this._xSetState();
  }

  /**
   *
   * Update the component in TS. And setting the component's state to show
   * related content in HTML.
   *
   * @inheritdoc
   * @protected
   * @param {?SimpleChanges} [changes] The changed properties
   */
  protected override _xUpdate(changes?: SimpleChanges): void {
    super._xUpdate(changes);
    this._xSetState();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X useful functions                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * @inheritdoc
   * @protected
   * @returns {boolean}
   */
  protected override _xHasRequiredInputs(): boolean {
    super._xHasRequiredInputs();

    // Read optional inputs to track them.
    this.state();
    this.dataType(); // Default value is defined in the inherited class.

    return true;
  }

  /**
   * A callback method that is invoked right at the Initialization phase, once
   * ALL required inputs are defined (i.e., when `_xHasRequiredInputs` returns
   * true) & each time an inputs is changed.
   *
   * **Who calls it?** `_xInit` & `_xUpdate`.
   *
   * **Useful for?** Changing `state` input (and maybe `dataType` input, if this
   * 'ui' lib can present multiple types of data).
   *
   * @protected
   */
  protected _xSetState(): void {
    // ...
  }
}
