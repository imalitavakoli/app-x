import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  inject,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

/**
 * ROOT base class for 'ui' & 'feature' components (functionalities).
 *
 * Every component ultimately extends this class. It wires up Angular lifecycle
 * hooks (`ngOnInit`, `ngAfterViewInit`, `ngOnChanges`) into a deterministic
 * initialisation and update chain that subclasses hook into via a small set of
 * protected overrides.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO INHERIT
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * NOTE: Items marked with "(with super call)" should call `super.methodName()`
 * right at the beginning. Items marked "optional" may be skipped if not
 * applicable.
 *
 * 01. Override `_xInitPreBeforeDom` (with super call).
 *     → Runs inside `ngOnInit`, **before** the DOM is available.
 *       Use for early setup that does not need template access.
 *
 * 02. Override `_xHasRequiredInputs` (with super call).
 *     → Returns `true` when every mandatory input has a value.
 *       Called before `_xInit` and again before every `_xUpdate`.
 *
 * 03. Override `_xInitPre` (with super call).
 *     → Runs once inside `ngAfterViewInit`, **before** `_xInit`.
 *       Use for subscriptions or DOM-dependent pre-work.
 *
 * 04. Override `_xInit` (with super call).
 *     → Runs once after `_xInitPre` succeeds and
 *       `_xHasRequiredInputs` returns `true`. Main initialisation.
 *
 * 05. Override `_xUpdate` (with super call).
 *     → Runs on every subsequent `ngOnChanges` after init.
 *       For zone.js `@Input` properties, use `_xIsInputChanged`
 *       inside this method to detect specific input changes.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * LIFECYCLE SEQUENCE
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * First render:
 *   ngOnInit → _xInitPreBeforeDom →
 *   ngAfterViewInit → _xInitPre → _xHasRequiredInputs → _xInit
 *
 * Subsequent changes:
 *   ngOnChanges → _xHasRequiredInputs → _xUpdate
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
export abstract class V1BaseFunComponent
  implements OnInit, AfterViewInit, OnChanges
{
  /* General //////////////////////////////////////////////////////////////// */

  protected readonly _destroyRef = inject(DestroyRef);
  private _isNgAfterViewInit = false;
  protected _isXInit = false;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Constructor                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  constructor() {
    // This effect will run whenever a required/optional input changes. How?
    // Because we are actually reading ALL inputs inside `_xHasRequiredInputs`
    // to track them, `_xHasRequiredInputs` is called in `ngOnChanges`, and
    // `ngOnChanges` is called here! In other words, this effect is reading ALL
    // inputs indirectly.
    effect(() => {
      // NOTE: So why we're NOT calling `ngOnChanges` to do the very same things
      // that Angular's change detection does, when classic `@Input` properties
      // change? Because currently (as of Angular 20), when signal inputs are
      // changed form the parent component, Angular itself calls `ngOnChanges`!
      // That's why we're keeping the logic here, but we're NOT calling it at
      // the moment to prevent double calls.
      // this.ngOnChanges();
    });
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit(): void {
    this._xInitPreBeforeDom();
  }

  ngAfterViewInit(): void {
    // NOTE: We use `ngAfterViewInit` instead of `ngOnInit`, because we like to
    // make sure that we already have access to the DOM, before starting the TS
    // logic. Now in such case, because the DOM is already initialized with the
    // initial value of the inputs, then if the component that initializes
    // this component (e.g., a 'feature' component initializes a 'ui'
    // component), provides another value for the inputs just immediately after
    // the view init, we may receive Angular's
    // `ExpressionChangedAfterItHasBeenCheckedError` error (in a zone.js app).
    // To prevent that, we use a timeout to ensure the view is already stable,
    // and then we can safely define new values for our inputs.
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
    // Track dependencies FIRST (this is required for `constructor` effect)!
    const hasInputs = this._xHasRequiredInputs();

    if (!this._isNgAfterViewInit) return; // Don't continue if NOT initialized.

    // Continue ONLY IF all requirements are defined.
    if (!hasInputs) return;

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
   * already ready right at the initialization phase) or `ngOnChanges` or
   * `constructor` effect (whenever all required inputs are defined).
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
   * **Who calls it?** Angular `ngOnChanges` or `constructor` effect.
   *
   * **Useful for?** Updating... i.e., reacting based on each input change.
   *
   * NOTE: When having `@Input` (zone.js), this function's `changes` argument is
   * defined and you can react based on the changed input with the help of
   * `_xIsInputChanged`. When having signals (no zone.js), this function's
   * `changes` argument is undefined, and you need to have explicit effects for
   * your inputs, if you wish to react based on their changes.
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
   * classes should override this function according to their own inputs.
   * having `@Input` (zone.js) and don't have any required inputs? Then you
   * don't need to override this function!
   *
   * NOTE: When having signals (no zone.js), you should override this function
   * to let it read ALL your inputs, EVEN IF you don't have any required inputs,
   * because this function is used inside the `constructor` effect (to track all
   * inputs), so that the effect can run whenever any input changes.
   *
   * @example
   * ```ts
   * protected override _xHasRequiredInputs(): boolean {
   *   super._xHasRequiredInputs();
   *
   *   // Read optional inputs to track them.
   *   this.input1();
   *   this.input2();
   *
   *   // Check for required inputs (which also leads to tracking them).
   *   if (!this.requiredInput1()) return false;
   *   return true;
   * }
   * ```
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
