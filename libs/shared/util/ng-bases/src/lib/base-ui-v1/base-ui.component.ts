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
  V1BaseUi_HasIt,
  V1BaseUi_State,
  V1BaseUi_DataType,
} from '@x/shared-util-ng-bases-model';

import { V1BaseFunComponent } from '../base-fun-v1/base-fun.component';

/**
 * Base class for 'ui' components.
 *
 * Provides a standardised lifecycle skeleton that every UI component
 * extends. The parent 'feature' component drives this component's
 * `state` and `dataType` inputs from the outside.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO INHERIT
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * NOTE: Steps 05 and 06 are optional — most UI components only need steps
 * 01-04 + 07.
 *
 * 01. Override `_xInitPreBeforeDom` (with super call).
 *     → Early setup that runs before the DOM is available.
 *
 * 02. Override `dataType`.
 *     → Declare the component's default data-type identifier.
 *
 * 03. Override `_xHasRequiredInputs` (with super call).
 *     → Return `false` to block initialisation until all inputs arrive.
 *
 * 04. Override `_xInitPre` (with super call).
 *     → Pre-initialisation logic (runs once, after inputs are ready).
 *
 * 05. Override `_xInit` (with super call, optional).
 *     → Main initialisation logic (runs once, after `_xInitPre`).
 *
 * 06. Override `_xUpdate` (with super call, optional).
 *     → Reacts to input changes. Use `_xIsInputChanged` inside when
 *       working with `@Input` (zone.js).
 *
 * 07. Override `_xSetState` (with super call).
 *     → Respond to `state` & `dataType` input changes.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW THE 'FEATURE' LIB INTERACTS WITH THIS
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * 01. The lib initializes this component in its HTML.
 * 02. The lib provides this component's required inputs.
 * 03. While the lib awaits API data (on init or input change), it sets this
 *     component's `state` input to `'loading'`.
 * 04. When API data arrives, the lib updates `state` (and optionally
 *     `dataType`) to reflect the fetched result.
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
export abstract class V1BaseUiComponent
  extends V1BaseFunComponent
  implements OnChanges, V1BaseUi_HasIt
{
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
