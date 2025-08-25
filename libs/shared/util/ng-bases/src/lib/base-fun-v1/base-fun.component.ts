import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

/**
 * Base class for 'ui' & 'feature' components (functionalities).
 *
 * Here's how the inherited classes use this (in most cases):
 * 01. Override `_xInitPreBeforeDom` (with super call right at the beginning).
 * 02. Override `_xHasRequiredInputs`.
 * 03. Override `_xInitPre` (with super call right at the beginning).
 * 04. Override `_xInit` (with super call right at the beginning).
 * 05. Override `_xUpdate` (with super call right at the beginning). You may use
 *     `_xIsInputChanged` inside of this function.
 *
 * @export
 * @class V1BaseFunComponent
 * @typedef {V1BaseFunComponent}
 * @implements {AfterViewInit}
 * @implements {OnChanges}
 */
@Component({
  selector: 'x-fun-base-v1',
  standalone: true,
  template: '',
})
export class V1BaseFunComponent implements OnInit, AfterViewInit, OnChanges {
  /* General //////////////////////////////////////////////////////////////// */

  protected readonly _destroyRef = inject(DestroyRef);
  private _isNgAfterViewInit = false;
  protected _isXInit = false;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit(): void {
    this._xInitPreBeforeDom();
  }

  ngAfterViewInit(): void {
    // NOTE: We use `ngAfterViewInit` instead of `ngOnInit`, because we like to
    // make sure that we already have access to the DOM, before starting the TS
    // logic. Now in such case, because the DOM is already initialzed with the
    // inital value of the inputs, then if the component that is going to use
    // this component, provide another value for the inputs just immediatly
    // after the view init, we may receive Angular's
    // `ExpressionChangedAfterItHasBeenCheckedError` error. To prevent that,
    // we use a timeout to ensure the view is already stable, and then we can
    // safely define new values for our inputs.
    setTimeout(() => {
      this._isNgAfterViewInit = true; // Set as initialized.

      // Preparation (subscribe to events, etc.).
      this._xInitPre();

      // Continue ONLY IF all requirements are defined.
      if (!this._xHasRequiredInputs()) return;

      // We will be here ONLY IF all required inputs are already defined! So init.
      // NOTE: Why we also check if `_isXInit` is false? Because the child classes
      // we may have already called `_xInit` in their own `ngOnInit`,
      // `ngAfterViewInit`, or `_xInitPre` functions, so we don't want to call it
      // again.
      if (!this._isXInit) this._xInit();
    });
  }

  ngOnChanges(changes?: SimpleChanges): void {
    if (!this._isNgAfterViewInit) return; // Don't continue if NOT initialized.

    // Continue ONLY IF all requirements are defined.
    if (!this._xHasRequiredInputs()) return;

    // Now that all required inputs are already defined, init, if we didn't before!
    if (!this._isXInit) this._xInit();

    // Now that all required inputs are already defined, update.
    this._xUpdate(changes);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * A callback method that is invoked before DOM is ready & before all
   * required inputs are defined.
   *
   * **Who calls it?** Angular `ngOnInit`.
   *
   * **Useful for?** Preparations that are required to happen before the DOM is
   * ready, because some HTML elements may require them. e.g., Setting default
   * values for inputs in 'ui' libs, or preparing facades (creating new state
   * object instances) in 'feature' libs.
   *
   * @protected
   */
  protected _xInitPreBeforeDom(): void {
    // ...
  }

  /**
   * A callback method that is invoked once DOM is ready.
   *
   * **Who calls it?** Angular `ngAfterViewInit`.
   *
   * **Useful for?** Preparations... i.e., Subscribing to events & route
   * changes, before doing anything else.
   *
   * @protected
   */
  protected _xInitPre(): void {
    // ...
  }

  /**
   * A callback method that is invoked once ALL required inputs are defined
   * (i.e., when `_xHasRequiredInputs` returns true).
   *
   * **Who calls it?** Angular `ngAfterViewInit` (if all required inputs are
   * already ready right at the initialization phase) or `ngOnChanges`
   * (whenever all required inputs are defined).
   *
   * **Useful for?** Initialization... i.e., starting to write down the main
   * logic.
   *
   * @protected
   */
  protected _xInit(): void {
    this._isXInit = true; // Set as initialized.
  }

  /**
   * A callback method that is invoked once ALL required inputs are defined
   * (i.e., when `_xHasRequiredInputs` returns true) & each time an inputs is
   * changed.
   *
   * **Who calls it?** Angular `ngOnChanges`.
   *
   * **Useful for?** Updating... i.e., reacting based on each input change with
   * the help of `_xIsInputChanged`.
   *
   * @protected
   * @param {?SimpleChanges} [changes] The changed properties
   */
  protected _xUpdate(changes?: SimpleChanges): void {
    // ...
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X useful functions                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Check if ALL required inputs are already defined or not. This function is
   * called at the initialization phase, and each time an input changes.
   *
   * NOTE: In this Base class, we're just simply returning true. But child
   * classes should override this function according to their own inputs. Don't
   * have any required inputs? Then you don't need to override this function!
   *
   * @protected
   * @returns {boolean}
   */
  protected _xHasRequiredInputs(): boolean {
    return true;
  }

  /**
   * Helper function to check if a specific input has changed.
   *
   * @protected
   * @param {string} param Input name
   * @param {?SimpleChanges} changes The changed properties
   * @returns {boolean}
   */
  protected _xIsInputChanged(param: string, changes?: SimpleChanges): boolean {
    if (!changes) return false;
    if (!changes[param]) return false;
    const prevValue = changes[param].previousValue;
    const currValue = changes[param].currentValue;
    if (prevValue !== currValue) return true;
    return false;
  }
}
