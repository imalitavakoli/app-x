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

import {
  V1BaseUi_DataType,
  V1BaseUi_State,
} from '@x/shared-util-ng-bases-model';

import { V1BaseFunComponent } from '../base-fun-v1/base-fun.component';

/**
 * Base class for all 'ui' components.
 *
 * Here's a way (#1) that the inherited classes use this:
 * 01. Override `_dataType`.
 * 02. Override `_xHasRequiredInputs`.
 * 03. Override `_xInitPre` (with super call right at the beginning).
 * 04. Override `_xInit` (with super call right at the beginning).
 * 05. Override `_xUpdate` (with super call right at the beginning). You may use
 *     `_xIsInputChanged` inside of this function.
 * 06. Override `_xSetState` (with super call right at the beginning). Here you
 *     change `state` & `dataType` inputs.
 *
 * Here's also another way (#2) that the inherited classes use this (in most cases):
 * 01. Override `_dataType`.
 * 02. Override `_xHasRequiredInputs`.
 * 03. Override `_xInitPre` (with super call right at the beginning).
 * 04. Override `_xSetState` (with super call right at the beginning). Here you
 *     change `state` & `dataType` inputs.
 *
 * Here's how the 'feature' lib interacts with this:
 * 01. The lib initializes this component in its HTML.
 * 02. The lib provides this component's required inputs.
 * 04. When the lib calls its API endpoints (at initialization phase or whenever
 *     its inputs are changed), while it's waiting for the data, it defines
 *     this component's `state` input to 'loading'.
 * 05. When the lib's API endpoints return data, it changes this component's
 *     `state` input to other states, according to the fetched data. It also
 *     defines the `dataType` input to the type that explains the fetched data
 *     the best.
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

  @Output() stateChange = new EventEmitter<V1BaseUi_State>();
  protected _state: V1BaseUi_State = 'loading';
  /**
   * UI state. It's a two-way binding property. 'feature' lib may change it to
   * 'loading' while its waiting for its API endpoints to return data, or other
   * states, according to the fetched data. The 'ui' lib itself can also change
   * it, according to the value of its required/optional inputs & its own logic.
   *
   * @type {V1BaseUi_State}
   */
  @Input() get state() {
    return this._state;
  }
  set state(value: V1BaseUi_State) {
    this._state = value;
    // Why timeout? To ensure change detection happens in the next cycle
    setTimeout(() => {
      this.stateChange.emit(value);
    });
  }

  @Output() dataTypeChange = new EventEmitter<V1BaseUi_DataType>();
  protected _dataType!: V1BaseUi_DataType;
  /**
   * Type of data that this 'ui' lib is suppose to present in HTML. It's a
   * two-way binding property. 'feature' lib defines this according to the
   * fetched data. The 'ui' lib itself can also change it, according to the
   * value of its required/optional inputs & its own logic.
   *
   * NOTE: This 'ui' lib can always present one type of data, or multiple
   * types... It all depends on the lib's logic.
   *
   * @type {!V1BaseUi_DataType}
   */
  @Input() get dataType() {
    return this._dataType;
  }
  set dataType(value: V1BaseUi_DataType) {
    this._dataType = value;
    // Why timeout? To ensure change detection happens in the next cycle
    setTimeout(() => {
      this.dataTypeChange.emit(value);
    });
  }

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
    if (this._isXInit && !this._xHasRequiredInputs()) this.state = 'loading';
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Prepare the component in HTML.
   *
   * @inheritdoc
   * @protected
   */
  protected override _xInitPre(): void {
    super._xInitPre();
  }

  /**
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
    return true;
  }

  // Introduced in the Base.
  // protected _xIsInputChanged(param: string, changes: SimpleChanges): boolean {}

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
