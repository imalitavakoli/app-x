import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  of,
  Subscription,
} from 'rxjs';

import { V1BaseFunComponent } from '../base-fun-v1/base-fun.component';

/**
 * Base class for all 'feature' components.
 *
 * Here's a way (#1) that the inherited classes use this:
 * 01. Override `_xInitPreBeforeDom` (with super call right at the beginning).
 * 02. Override `_xHasRequiredInputs` (with super call right at the beginning).
 * 03. Override `_xInitPre` (with super call right at the beginning).
 * 04. Override `_xFacadesPre`.
 * 05. Override `_xFacadesLoadesValidation`.
 * 06. Override `_xFacadesAddErrorListeners`. You may use `xOnError` inside of
 *     this function. And you may save your subscriptions (listeners) in
 *     private variables, so you can unsubscribe from them in `ngOnDestroy`.
 * 07. Override `_xInit` (with super call right at the beginning).
 * 08. Override `_xUpdate` (with super call right at the beginning). When having
 *     `@Input` (zone.js), you may use `_xIsInputChanged` inside of this function.
 * 09. Override `_xDataPre`.
 * 10. Override `_xDataReset`. Here's the place, where you may set the 'ui'
 *     lib's `state` input to 'loading'.
 * 11. Override `_xDataFetch`.
 * 12. Override `_xInitOrUpdateAfterAllDataReady` (with super call right at the
 *     beginning). Here's the place, where you may set the 'ui' lib's `state`
 *     input to to other states, according to the fetched data. You may also
 *     change its `dataType` input to the type that explains the fetched data
 *     the best.
 *
 * Here's also another way (#2) that the inherited classes use this (in most cases):
 * 01. Override `_xInitPreBeforeDom` (with super call right at the beginning).
 * 02. Override `_xHasRequiredInputs` (with super call right at the beginning).
 * 03. Override `_xFacadesPre`.
 * 04. Override `_xFacadesLoadesValidation`.
 * 05. Override `_xFacadesAddErrorListeners`. You may use `xOnError` inside of
 *     this function. And you may save your subscriptions (listeners) in
 *     private variables, so you can unsubscribe from them in `ngOnDestroy`.
 * 06. Override `_xDataPre`.
 * 07. Override `_xDataReset`. Here's the place, where you may set the 'ui'
 *     lib's `state` input to 'loading'.
 * 08. Override `_xDataFetch`.
 * 09. Override `_xInitOrUpdateAfterAllDataReady` (with super call right at the
 *     beginning). Here's the place, where you may set the 'ui' lib's `state`
 *     input to to other states, according to the fetched data. You may also
 *     change its `dataType` input to the type that explains the fetched data
 *     the best.
 *
 * Here's how the 'page' lib interacts with this:
 * 01. The lib initializes this component in its HTML.
 * 02. The lib provides this component's required inputs.
 * 03. The lib listens to `hasError` output to see if any error occurs in this
 *     component while fetching data from a 'data-access' lib, so that it can
 *     show the error message to the user.
 * 04. Optional! The lib listens to `ready` or `allDataIsReady` outputs.
 *
 * @export
 * @class V1BaseFeatureComponent
 * @typedef {V1BaseFeatureComponent}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'x-feature-base-v1',
  standalone: true,
  template: '',
})
export class V1BaseFeatureComponent extends V1BaseFunComponent {
  /* General //////////////////////////////////////////////////////////////// */

  private _isReadyEmitted = false;

  // Observables
  private _isAllDataReady$!: Observable<boolean>;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * If 'true', then it means that the lib should handle showing error messages
   * in the UI. If 'false', then the lib will NOT handle showing error messages
   * in the UI, and it's up to the parent lib (which has initialized this lib)
   * to take advantage of `hasError` output and show error messages.
   */
  showErrors = input(true);

  /**
   * Emits only one time! And that's when all API endpoints are called, their
   * data is ready, and `_xInitOrUpdateAfterAllDataReady` is already called for
   * the very first time.
   */
  ready = output<void>();

  /**
   * Emits each time (when an inputs is changed) all API endpoints are called,
   * their data is ready, and `_xInitOrUpdateAfterAllDataReady` is already
   * called.
   */
  allDataIsReady = output<void>();

  /**
   * Emits when an error occurs while fetching data from a 'data-access' lib.
   */
  hasError = output<{ key: string; value: string }>();

  /* //////////////////////////////////////////////////////////////////////// */
  /* Setter, Getter                                                           */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Check if we've called to fetch data for the very first time.
   */
  protected _isFirstDataFetchDone = new BehaviorSubject<boolean>(false);
  get isFirstDataFetchDone(): boolean {
    return this._isFirstDataFetchDone.getValue();
  }
  set isFirstDataFetchDone(value: boolean) {
    this._isFirstDataFetchDone.next(value);
  }
  get isFirstDataFetchDone$(): Observable<boolean> {
    return this._isFirstDataFetchDone.asObservable();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  // Introduced in the Base.
  // NOTE: This function should be overridden in the child class, for the times
  // that we're using multi-instance 'data-access' libs. In here, we create
  // a new instance(s) for the 'data-access' lib.
  // e.g., `this._insightsFacade.createIfNotExists('V1BaseFeatureComponent_main');`
  // protected  _xInitPreBeforeDom(): void {}

  /**
   *
   * Prepare the component's `_isAllDataReady$` Observable to start subscribing
   * to it and see if all data is ready... If all data is ready, then
   * `_xInitOrUpdateAfterAllDataReady` function will be called.
   *
   * @inheritdoc
   * @protected
   */
  protected override _xInitPre(): void {
    super._xInitPre();

    // Set variables.
    const facadeLoadeds = this._xFacadesPre();
    // NOTE: We add `isFirstDataFetchDone$` to make sure the `combineLatest`
    // emits at least once AFTER that we have fetched the required data for the
    // very first time (Initialization phase, whenever all required inputs are
    // set). Why we need to make sure of that? Because if all 'requested API
    // calls arrays' of facades are undefined (i.e., we are simply returning an
    // empty array in `_xFacadesPre`), then the `combineLatest` will not emit
    // anything...
    const observables = [this.isFirstDataFetchDone$, ...facadeLoadeds];

    // Prepare the Observable to check: If all data is ready.
    this._isAllDataReady$ = combineLatest(
      observables as [
        Observable<boolean>,
        ...(Observable<{ [key: string]: boolean }> | Observable<boolean>)[],
      ],
    ).pipe(
      map((all) => {
        // Don't continue IF we still didn't call `_xDataFetch` for the very
        // first time. Why? Because the 'requested API calls arrays' might be
        // undefined at the beginning, but may be defined with some pushed
        // values later, when we're fetching data at the Initialization phase...
        // So we don't like to return true here, by mistake, while we might
        // still need to fetch some data, as soon as code execution reaches to
        // `_xDataFetch` function.
        //
        // Why this check is not important later, when inputs are changed?
        // Because before the first data fetch, we are still not sure that
        // whether 'requested API calls arrays' is going to be defined or not,
        // so we like to prevent the facades to cause emitting `combineLatest`
        // too early... But later, when inputs are changed, one of the following
        // scenarios will happen: (1) 'requested API calls arrays' are still
        // undefined, then it means that no API call will be called, so nothing
        // is changed in the facades Object and this whole Observable will not
        // emit anything new. (2) 'requested API calls arrays' are defined, some
        // API called are called, facade Objects are updated, and then this
        // Observable emits new values, and based on the requested data, we will
        // return true or false... So basically, there's no need to check this
        // flag here later.
        const firstDataFetchDone = all[0];
        if (!firstDataFetchDone) return false;

        // Set variables.
        let isAllDataReady = false;
        const loadedsArr = all.slice(1); // Filter out the first item in `all` array, because the first item is always a `true` boolean value that we don't need it here (we just needed it to make sure the `combineLatest` emits at least once).

        // Check if all data is ready.
        // NOTE: `_xFacadesLoadesValidation` function will return `true`
        // whatsoever, if all 'requested API calls arrays' of facades are
        // undefined (i.e., we are simply returning `true` in
        // `_xFacadesLoadesValidation` function).
        isAllDataReady = this._xFacadesLoadesValidation(loadedsArr);

        return isAllDataReady;
      }),
    );

    // Start listening to see: If all data is ready.
    this._isAllDataReady$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((isReady) => {
        if (!isReady) return;

        this._xInitOrUpdateAfterAllDataReady();

        // Why setTimeout? Because in most cases, we like the 'feature' lib to
        // do its stuff in `_xInitOrUpdateAfterAllDataReady` function first
        // (such as manipulating its fetched data and then providing it to the
        // UI), and then emit `ready` in the next Angular tick (i.e., after that
        // the 'ui' lib in the 'feature' lib's HTML is already updated with the
        // new input values).
        //
        // In this way, other libs (which are mostly 'page' libs) that use this
        // 'feature' lib to listen to its `ready` event, will be notified after
        // that the 'feature' lib has manipulated its fetched data and the 'ui'
        // lib in there is also already updated with the new input values.
        //
        // How it can be useful? In the times that the 'page' lib likes to
        // access the 'feature' lib in the DOM via `ViewChild` to call some of
        // its methods, while the methods are also depending on the inner 'ui'
        // lib! So in such case, the 'ui' lib should already has its own
        // required inputs and be in a ready stable state (i.e., it should be in
        // any state rather than 'loading').
        setTimeout(() => {
          if (!this._isReadyEmitted) {
            this.ready.emit();
            this._isReadyEmitted = true;
          }
          this.allDataIsReady.emit();
        });
      });

    // Start listening to see: If any of 'data-access' lib calls throw an error.
    this._xFacadesAddErrorListeners();
  }

  /**
   *
   * Prepare calling API endpoints from a 'data-access' lib (by calling
   * `_xDataPre`), reset any probable old data of a 'data-access' lib (by
   * calling `_xDataReset`), and finally start fetching new data for a
   * 'data-access' lib (by calling `_xDataFetch`).
   *
   * @inheritdoc
   * @protected
   */
  protected override _xInit(): void {
    super._xInit();

    this._xDataPre();
    this._xDataReset();
    this._xDataFetch();

    // Indicate that data fetch is done for the very first time (it is useful
    // in `_initPre`).
    if (!this.isFirstDataFetchDone) this.isFirstDataFetchDone = true;
  }

  /**
   *
   * Reset any probable old data of a 'data-access' lib (by calling
   * `_xDataReset`), and finally start fetching new data for a 'data-access' lib
   * (by calling `_xDataFetch`).
   *
   * @inheritdoc
   * @protected
   * @param {?SimpleChanges} [changes] The changed properties
   */
  protected override _xUpdate(changes?: SimpleChanges): void {
    super._xUpdate(changes);

    this._xDataReset();
    this._xDataFetch();
  }

  /**
   * A callback method that is invoked once all requested API calls data are
   * ready. This happens once at the Initialization phase & each time an inputs
   * is changed.
   *
   * **Who calls it?** `_xInitPre` once all requested API calls data are ready
   * (i.e., `_isAllDataReady$` Observable returns `true`).
   *
   * **Useful for?** Initialization & updating... i.e., starting to write down
   * the main logic (after all asynchronous data are ready). Now you can
   * subscribe and take the latest state object data of the 'data-access' lib
   * that you have already fetched its data in `_xDataFetch` function.
   *
   * @example
   * ```ts
   * protected readonly _insightsFacade = inject(V3InsightsFacade);
   *
   * // Here's an example of how to override this function in a child class.
   * protected override _xInitOrUpdateAfterAllDataReady() {
   *   super._xInitOrUpdateAfterAllDataReady();
   *
   *   // LIB: Insights (main)
   *   this._insightsFacade
   *     .entity$('V1BaseFeatureComponent_main')
   *     .pipe(take(1))
   *     .subscribe((state) => {
   *       if (state.loadedLatest.locations && state.datas.locations) {
   *         console.log('Locations:', state.datas.locations);
   *       }
   *     });
   * }
   * ```
   *
   * @protected
   */
  protected _xInitOrUpdateAfterAllDataReady() {
    // ...
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

  /**
   * Dispatches the error event (`hasError`) when an error occurs while
   * fetching data from a 'data-access' lib.
   *
   * @param {{ key: string; value: string }} error
   * @param {string} [libName] - 'data-access' lib's facade class name. It's the 'data-access' lib that throws the error.
   * @param {?string} [instanceName] - If the 'data-access' lib that throws the error is a multi-instance one (has multi-instance object structure in its reducer's state interface), then this is the instance name that the error is related to. Schema: '{ThisClassName}_{main|secondary|...}'.
   */
  xOnError(
    error: { key: string; value: string },
    libName: string,
    instanceName?: string,
  ): void {
    // Make up the error key.
    let key = `${libName}/${error.key}`; // e.g., 'V3InsightsFacade/locations'
    if (instanceName) key = `${libName}(${instanceName})/${error.key}`; // e.g., 'V3InsightsFacade(V1BaseFeatureComponent_main)/locations'

    // Emit the error event.
    this.hasError.emit({
      key: key,
      value: error.value,
    });
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X facades functions                                                      */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * `_xInitPre` calls this function to prepare `_isAllDataReady$` Observable.
   * This process contains the following steps:
   * - Add 'data-access' lib's `loadeds` state property as an Observable (i.e.,
   *   `loadeds$` or `entityLoadeds$`) to an array.
   * - Return the array of Observables.
   *
   * NOTE: The order of Observables that you push to the array is important!
   * Because you're going to use the `loadeds` array later in
   * `_xFacadesLoadesValidation` function (as `loadedsArr` argument), to check
   * if all data is ready.
   *
   * @example
   * ```ts
   * protected readonly _insightsFacade = inject(V3InsightsFacade);
   *
   * // Here's an example of how to override this function in a child class.
   * protected override _xFacadesPre(): (Observable<{ [key: string]: boolean }> | Observable<boolean>)[] {
   *   const observables = [];
   *
   *   // LIB: Insights (main)
   *   observables.push(
   *     this._insightsFacade.entityLoadeds$('V1BaseFeatureComponent_main'),
   *   );
   *
   *   return observables as Observable<{ [key: string]: boolean }>[];
   * }
   * ```
   *
   * @protected
   * @returns {(Observable<{ [key: string]: boolean }> | Observable<boolean>)[]}
   */
  protected _xFacadesPre(): (
    | Observable<{ [key: string]: boolean }>
    | Observable<boolean>
  )[] {
    return [];
  }

  /**
   * `_xInitPre` calls this function to check if all data of the 'data-access'
   * lib facades are loaded or not. This process contains the following steps:
   * - Check if 'requested API calls arrays' of facades are defined or not. If
   *   they are not defined, it means that there's no data to load, so we just
   *   return `true` (i.e., all data is ready); otherwise, we continue to the
   *   next step.
   *   Tip! If you know that you will definitely call one or more API endpoints
   *   and your 'requested API calls arrays' of facades are always defined (as
   *   empty arrays), then you don't need to do this check here.
   * - Check every key that exists in a 'requested API calls object' (an item of
   *   `loadedsArr` argument) to see if that key is `true`.
   * - If all keys for all of the 'requested API calls arrays' (`loadedsArr`
   * argument) are `true`, then we return `true` (i.e., all data is ready).
   *
   * NOTE: The order of objects in `loadedsArr` argument is according to the
   * order of Observables that you already pushed to the array that
   * `_xFacadesPre` was returning.
   *
   * @example
   * ```ts
   * protected _insightsRequestedData_main?: (keyof V3Insights_Datas)[];
   *
   * // Here's an example of how to override this function in a child class.
   * protected override _xFacadesLoadesValidation(
   *   loadedsArr: (boolean | {[key: string]: boolean;})[],
   * ): boolean {
   *   let isAllDataReady = false;
   *
   *   // LIB: Insights (main)
   *   let isInsightsAllDataReady_main = false;
   *   const insights_main = loadedsArr[0] as V3Insights_Loadeds; // In `_xFacadesPre` we already defined the order of the observables in the array that it returns... So we know that `loadedsArr` is also in the same order.
   *   if (this._insightsRequestedData_main) {
   *     isInsightsAllDataReady_main = this._insightsRequestedData_main.every(
   *       (key) => !!insights_main[key],
   *     );
   *     if (this._insightsRequestedData_main.length === 0) {
   *       isInsightsAllDataReady_main = false;
   *     }
   *   } else {
   *     isInsightsAllDataReady_main = true;
   *   }
   *
   *   // Check if all data is ready.
   *   if (isInsightsAllDataReady_main) {
   *     isAllDataReady = true;
   *   }
   *   return isAllDataReady;
   * }
   * ```
   *
   * @protected
   * @param {(boolean | {[key: string]: boolean;})[]} loadedsArr
   * @returns {boolean}
   */
  protected _xFacadesLoadesValidation(
    loadedsArr: (boolean | { [key: string]: boolean })[],
  ): boolean {
    return true;
  }

  /**
   * `_xInitPre` calls this function to let us subscribe to the state object
   * changes of our facades and check their `errors` property... If an error
   * happens while calling API endpoints, you can be informed here in this
   * function, and use `xOnError` to emit `hasError` output.
   *
   * NOTE: If you're keeping your subscriptions (not taking them down until a
   * specific condition is met), then you should unsubscribe from them in
   * `ngOnDestroy`.
   *
   * @example
   * ```ts
   * protected readonly _insightsFacade = inject(V3InsightsFacade);
   * protected _insightsRequestedData_main?: (keyof V3Insights_Datas)[];
   * private _insightsSub_main!: Subscription;
   *
   * // Here's an example of how to override this function in a child class.
   * protected override _xFacadesAddErrorListeners(): void {
   *   // LIB: Insights (main)
   *   this._insightsSub_main = this._insightsFacade
   *     .entity$('V1BaseFeatureComponent_main')
   *     .pipe(takeUntilDestroyed(this._destroyRef))
   *     .subscribe((state) => {
   *       // Emit the error messages if any.
   *       const emitError = (key: keyof V3Insights_Datas) => {
   *         if (state.loadedLatest[key] && state.errors[key]) {
   *           // Don't emit the following errors (they are exceptions).
   *           if (state.errors[key] === 'BLAHBLAH') {
   *             return;
   *           }
   *
   *           // We're here? Then it means that we should emit the error!
   *           this.xOnError(
   *             {
   *               key: key,
   *               value: state.errors[key] as string,
   *             },
   *             'V3InsightsFacade',
   *             'V1BaseFeatureComponent_main',
   *           );
   *         }
   *       };
   *
   *       // Loop through `_insightsRequestedData_main` array to emit the error messages.
   *       if (this._insightsRequestedData_main) {
   *         this._insightsRequestedData_main.forEach((key) => {
   *           emitError(key as keyof V3Insights_Datas);
   *         });
   *       }
   *   });
   * }
   * ```
   *
   * @protected
   */
  protected _xFacadesAddErrorListeners(): void {
    // ...
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X Prepare & reset & fetch data functions                                 */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * A callback method that is invoked right at the Initialization phase, once
   * ALL required inputs are defined (i.e., when `_xHasRequiredInputs` returns
   * true).
   *
   * **Who calls it?** `_xInit` right before calling `_xDataFetch`.
   *
   * **Useful for?** Preparing required data (e.g., BaseURL, UserID, etc.)
   * before calling API endpoints from a 'data-access' lib.
   *
   * @protected
   */
  protected _xDataPre(): void {
    // ...
  }

  /**
   * A callback method that is invoked right at the Initialization phase, once
   * ALL required inputs are defined (i.e., when `_xHasRequiredInputs` returns
   * true) & each time an inputs is changed.
   *
   * **Who calls it?** `_xInit`  & `_xUpdate` right before calling `_xDataFetch`.
   *
   * **Useful for?** Resetting all 'requested API calls arrays' (if they are
   * defined), resetting any probable old data of a 'data-access' lib.
   *
   * NOTE: Creating a new instance for the 'data-access' lib (if it is a
   * multi-instance one) MUST happen in `ngOnInit` or `_xInitPreBeforeDom`
   * functions BEFORE the DOM is initialized.
   *
   * @example
   * ```ts
   * protected readonly _insightsFacade = inject(V3InsightsFacade);
   * protected _insightsRequestedData_main?: (keyof V3Insights_Datas)[];
   *
   * // Here's an example of how to override this function in a child class.
   * protected override _xDataReset(): void {
   *   // LIB: Insights (main)
   *   if (this._insightsRequestedData_main) this._insightsRequestedData_main = [];
   *   this._insightsFacade.reset('V1BaseFeatureComponent_main');
   *   // this._insightsFacade.createIfNotExists('V1BaseFeatureComponent_main'); // This should already have been done BEFORE the DOM is initialized (in `_xInitPreBeforeDom`).
   * }
   * ```
   *
   * @protected
   */
  protected _xDataReset(): void {
    // ...
  }

  /**
   * A callback method that is invoked right at the Initialization phase, once
   * ALL required inputs are defined (i.e., when `_xHasRequiredInputs` returns
   * true) & each time an input is changed.
   *
   * **Who calls it?** `_xInit` & `_xUpdate`.
   *
   * **Useful for?** Fetching new data from a 'data-access' lib.
   *
   * NOTE: Based on your logic, (1) you know that you will definitely call one
   * or more API endpoints (by calling the 'data-acces' lib's facade functions);
   * (2) or you may call one or more API endpoints (based on some conditions,
   * such as the presence of some inputs); So if condition (1) is true, then the
   * related 'requested API calls array' (e.g., `_insightsRequestedData_main`)
   * should NOT be undefined in your child class initially, instead consider to
   * define it as an empty array... In this way, you make sure that the
   * `_xFacadesLoadesValidation` function works properly, because a defined
   * 'requested API calls array' indicates that you DO NEED some data to fetch,
   * and now that the array is empty or its items (which are keys of requested
   * data) are NOT all loaded yet, then the function will return `false`,
   * instead of assuming that because the array is undefined, there's no data to
   * load, so it would return `true` by mistake.
   *
   * @example
   * ```ts
   * protected readonly _insightsFacade = inject(V3InsightsFacade);
   * protected _insightsRequestedData_main?: (keyof V3Insights_Datas)[];
   *
   * private _callInsights_getLocations(instance: string) {
   *   // NOTE: Based on some conditions, we may decide to just return here
   *   // (i.e., not calling the API endpoint)... e.g., if the required/optional
   *   // inputs which are related to fetching 'locations' data are not defined,
   *   // then we will return here.
   *   // return;
   *
   *   // If we're here, it means that we should call this API endpoint, then
   *   // main 'requested API calls array' should get defined (if it's not defined yet).
   *   if (!this._insightsRequestedData_main) this._insightsRequestedData_main = [];
   *   this._insightsRequestedData_main.push('locations');
   *   this._insightsFacade.getLocations(this._baseUrl, this._userId, instance);
   * }
   *
   * // Here's an example of how to override this function in a child class.
   * protected override _xDataFetch(): void {
   *   // LIB: Insights (main)
   *   this._callInsights_getLocations('V1BaseFeatureComponent_main');
   * }
   * ```
   *
   * @protected
   */
  protected _xDataFetch(): void {
    // ...
  }
}
