import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  exhaustMap,
  filter,
  map,
  Observable,
  of,
  Subscription,
  take,
} from 'rxjs';

import {
  v1LocalWebcomGet,
  v1LocalWebcomSetOneError,
} from '@x/shared-util-local-storage';
import { V2Config_MapDep } from '@x/shared-map-ng-config';
import { V2ConfigFacade } from '@x/shared-api-data-access-ng-config';
import {
  V1Translations_State,
  V1TranslationsFacade,
} from '@x/shared-api-data-access-ng-translations';
import { V1AuthFacade, V1Auth_State } from '@x/shared-api-data-access-ng-auth';

@Component({
  selector: 'x-core-base-v1',
  standalone: true,
  template: '',
})
export class V1BaseCoreComponent
  implements AfterViewInit, OnDestroy, OnChanges
{
  /* General //////////////////////////////////////////////////////////////// */

  // 'data-access' libs
  private readonly _configFacade = inject(V2ConfigFacade);
  private readonly _translationsFacade = inject(V1TranslationsFacade);
  private readonly _authFacade = inject(V1AuthFacade);

  // Observables
  protected _isAllDataReady$!: Observable<boolean>;

  // Subscriptions
  private _isAllDataReadySub!: Subscription;
  private _readerInterval!: ReturnType<typeof setInterval>;

  // Flags
  private _isNgAfterViewInit = false; // Check if `ngAfterViewInit` is called. Useful when `ngOnChanges` is called before other lifecycles.
  private _isXInit = false; // Check if `_xInit` is called.
  private _isXInitAfterAuth = false; // Check if `_xInitAfterAuth` is called.

  // Fetched data from 'data-access' libs
  private _baseUrl!: string;
  private _userId!: number;
  private _lastLoadedLang!: string;

  /* Initialized inner 'feature' lib related //////////////////////////////// */

  /**
   * If all of the `feature` lib inputs are ready and it can be initialized in
   * HTML. It may be reset multiple time each time an input (of the component)
   * is changed.
   *
   * NOTE: This can also be used to create skeleton loading in HTML.
   */
  isReadyToInitLib = false;

  /* Inherited children components related ////////////////////////////////// */

  /**
   * The name of the component class.
   * NOTE: It will be used if we're initializing the 'data-access' insights
   * lib... In order to do that, we need to create a new instance of the state
   * object with the component name as its ID.
   */
  readonly comName: string = 'V1BaseCoreComponent';

  /**
   * The name of the component in brief.
   * NOTE: It will be used in `onError` method to set the error key in the
   * local storage.
   */
  protected readonly _coreName: string = 'base';

  /* //////////////////////////////////////////////////////////////////////// */
  /* Setter, Getter                                                           */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Check if the user is already authenticated via 'initializer' component.
   */
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  get isAuthenticated(): boolean {
    return this._isAuthenticated.getValue();
  }
  set isAuthenticated(value: boolean) {
    this._isAuthenticated.next(value);
  }
  get isAuthenticated$(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Dispatch events when an error occurs in the component.
   * @output
   */
  @Output() hasError = new EventEmitter<{ key: string; value: string }>();

  /**
   * Dispatch events when the component is ready (all of the data is fetched
   * from server and the inner 'feature' lib in HTML is rendered). It may be
   * dispatched multiple times each time an input (of the component) is changed.
   * @output
   */
  @Output() ready = new EventEmitter<void>();

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngAfterViewInit(): void {
    this._isNgAfterViewInit = true; // Indicate `ngAfterViewInit` is called.

    // Prepare the component (subscribe to events, etc.).
    this._xInitPre();

    // Continue ONLY IF all required inputs are defined.
    if (!this._xHasRequiredInputs()) return;

    // Init the component to let it show everything in HTML.
    this._xInit();
  }

  ngOnChanges(changes?: SimpleChanges): void {
    // If the component is NOT done with `ngAfterViewInit` yet, then do nothing
    // here! Because we will take care of everything that is required in the
    // init method (once it gets called) with the default values of the inputs.
    if (!this._isNgAfterViewInit) return;

    // Helper function to check if a specific input has changed.
    const isInputChanged = (param: string): boolean => {
      if (!changes) return false;
      if (!changes[param]) return false;
      const prevValue = changes[param].previousValue;
      const currValue = changes[param].currentValue;
      if (prevValue !== currValue) return true;
      return false;
    };

    // Continue ONLY IF all required inputs are defined.
    if (!this._xHasRequiredInputs()) return;

    // Init the component to let it show everything in HTML, if we didn't already!
    if (!this._isXInit) this._xInit();

    // Update the component with the new inputs.
    this._xUpdate();
  }

  ngOnDestroy(): void {
    if (this._readerInterval) clearInterval(this._readerInterval);
    if (this._isAllDataReadySub) this._isAllDataReadySub.unsubscribe();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X Lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Here we subscribe to events or observables, listen to route changes, or
   * initialize services if needed.
   *
   * NOTE: Will be called only once (right at the initialization phase), BEFORE
   * all required inputs are defined.
   *
   * @protected
   */
  protected _xInitPre() {
    // Set variables.
    const observables = [];

    // Understand what 'data-access' libs' observables we need to listen to.
    observables.push(this.isAuthenticated$); // Add this to make sure the combineLatest emits at least once.

    // Prepare the Observable to check: If all data is ready.
    this._isAllDataReady$ = combineLatest(
      observables as [Observable<boolean>],
    ).pipe(
      map(([isAuthenticated]) => {
        // Set variables.
        let isAllReady = false;

        // Check if all data is ready.
        // NOTE: You can add more Observables to the `observables` array above
        // to check if they are ready or not, and then check them here.
        if (isAuthenticated) {
          isAllReady = true;
        }
        return isAllReady;
      }),
    );

    // Start listening to see: If all data is ready.
    this._isAllDataReadySub = this._isAllDataReady$.subscribe((isReady) => {
      if (!isReady) return;
      this._xInitOrUpdateAfterAllDataReady();
      this.ready.emit();
    });
  }

  /**
   * Here we start the local storage reader intervals.
   *
   * NOTE: Will be called only once (right at the initialization phase), AFTER
   * all required inputs are defined.
   *
   * @protected
   */
  protected _xInit() {
    this._isXInit = true; // Indicate `_xInit` is called.

    // Start the local storage reader interval to check if the user is authenticated.
    this._startReaderInterval();
  }

  /**
   * Here we fetch all the required data from different `data-access` libs. And
   * also call Facade methods (dispatch actions) to fetch data, and define
   * variables that the initialized `feature` lib in HTML, may requires.
   *
   * NOTE: Will be called only once (right at the initialization phase), AFTER
   * all required inputs are defined & the user is authenticated.
   *
   * @protected
   */
  protected _xInitAfterAuth() {
    this._isXInitAfterAuth = true; // Indicate `_xInitAfterAuth` is called.

    this._configFacade.configState$
      .pipe(
        take(1),
        exhaustMap((state) => {
          // If data was NOT truthy, just return.
          if (!state.dataConfigDep) {
            return of(false);
          }

          // Save required data.
          this._baseUrl = state.dataConfigDep.general.baseUrl;

          // Switch to the `translationsState$` Observable.
          return this._translationsFacade.translationsState$;
        }),
        take(1),
        filter((state) => {
          // Don't continue, if the above `exhaustMap` operation was halted.
          if (state === false) return false;
          return true;
        }),
        exhaustMap((state) => {
          state = state as V1Translations_State;

          // If translations data was NOT truthy, just return.
          if (!state.datas.translations) {
            return of(false);
          }

          // Save required data.
          this._lastLoadedLang = state.lastLoadedLangCultureCode as string;

          // Switch to the `authState$` Observable.
          return this._authFacade.authState$;
        }),
        take(1),
        filter((state) => {
          // Don't continue, if the above `exhaustMap` operation was halted.
          if (state === false) return false;
          return true;
        }),
      )
      .subscribe((state) => {
        state = state as V1Auth_State;

        // Save required data.
        // NOTE: Here unlike the above operations, we won't check whether the
        // data is truthy or not! Because we're sure that it is definitely
        // truthy... Why? Because ONLY after the user is authenticated, we're
        // initializing the component.
        this._userId = state.datas.getToken?.userId as number;

        // Dispatch data-access actions (call API endpoints to fetch data).
        this._xDataFetch();
      });
  }

  /**
   * NOTE: May be called multiple times (whenever an input is changed).
   *
   * @protected
   */
  protected _xUpdate() {
    // Now that we wanna fetch new data from server, let's reset the old fetched
    // data (if they have been defined before).
    this._xDataReset();

    // Dispatch data-access actions (call API endpoints to fetch data).
    this._xDataFetch();
  }

  /**
   * Here we define the flag to let the 'feature' lib in HTML know that it is
   * ready to be initialized (ALL of its inputs are ready).
   *
   * NOTE: Will be called each time an input is changed, `_dataFetch` is called,
   * and ALL data is fetched (i.e., the time that in `_initPre` function,
   * `_isAllDataReady$` emits `true` after all requested data of
   * `_dataFetch` function is ready).
   *
   * NOTE: If there's no data needed to be fetched (i.e., `_dataFetch` function
   * is not needed be called because our 'data-access' lib flags such as
   * `_shallInsights_getLocations` are false), then this function will be called
   * once `_isAuthenticated` gets true. How? Well, because in `_initPre`
   * function we have created its Observable and `_isAllDataReady$` emits `true`
   * after `_isAuthenticated` is true.
   *
   * @protected
   */
  protected _xInitOrUpdateAfterAllDataReady() {
    this.isReadyToInitLib = true; // Indicate that 'feature' lib is ready to be initialized in HTML.
  }

  /**
   * Reset the state & old UI inputs (if they have been defined before).
   *
   * NOTE: If we need to fetch data from any 'data-access' lib, then indicate
   * that 'feature' lib is NOT ready yet, by setting `isReadyToInitLib` flag to
   * false. It will get true again (in `_xInitOrUpdateAfterAllDataReady`),
   * whenever all data is fetched.
   *
   * @protected
   */
  protected _xDataReset() {
    // ...
  }

  /**
   * Start fetching new data from API, after resetting the old data.
   *
   * @protected
   */
  protected _xDataFetch() {
    // ...
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Check if ALL required inputs are already define or not. Only after that
   * the component gets initialized by `_xInit` function.
   */
  protected _xHasRequiredInputs() {
    // If all required inputs are defined, then return true.
    return true;
  }

  /**
   * Communication between components is happening through some properties in
   * `eWebcom` Object which is stored in local storage. This function starts an
   * interval to check the Object for changes, and updates the component
   * accordingly.
   *
   * @private
   */
  private _startReaderInterval() {
    // Helper function to check if user is authenticated via the 'initializer'
    // component. We initialize the `feature` lib in HTML, only after that.
    const checkIfAuthenticated = () => {
      const isAuthenticated = v1LocalWebcomGet('initializer', 'authenticated');
      if (isAuthenticated) {
        // Set `isAuthenticated` BehaviorSubject to true, if it is not already.
        if (!this.isAuthenticated) this.isAuthenticated = true;
        // Continue with the initilzation process.
        if (!this._isXInitAfterAuth) this._xInitAfterAuth();
      }
    };

    // Start the interval reader.
    this._readerInterval = setInterval(() => {
      checkIfAuthenticated();
    }, 1000);
  }

  /**
   * Dispatches an error event and logs the error locally.
   *
   * @param {{ key: string; value: string }} error
   * @param {?string} [childComName] - If this core component is going to initialize multiple inner 'feature' libs, then we can also pass the name of the child component to have a more specific error key.
   */
  onError(error: { key: string; value: string }, childComName?: string): void {
    // Make up the error key & key prefix.
    let keyPrefix = `${this._coreName}: `; // e.g., 'V1CoreFullInsightsComponent: '
    if (childComName) keyPrefix = `${this._coreName}/`; // e.g., 'V1CoreFullInsightsComponent/'
    let key = `${error.key}`; // e.g., 'V3InsightsFacade(V1BaseFeatureComponent_main)/locations'
    if (childComName) key = `${childComName}: ${error.key}`; // e.g., 'co2: V3InsightsFacade(V1BaseFeatureComponent_main)/locations'

    // Make sure key & value exist and their type is string. If not, then
    // create your own sample error object. Why we do this check? Because this
    // is the base class, and in child components, we are not sure what inner
    // 'feature' lib is going to get initialized in HTML and what type of errors
    // that lib is going to throw...
    if (
      !error ||
      typeof error.key !== 'string' ||
      typeof error.value !== 'string'
    ) {
      error = {
        key: `${this._coreName}: unknown`,
        value:
          'An unknown error (that could not be parsed in the core compoment) occurred! It can happen when the inner feature lib throws an error that is not in the expected format.',
      };
    }

    // Emit the error event.
    this.hasError.emit({
      key: key,
      value: error.value,
    });
    v1LocalWebcomSetOneError({
      key: `${keyPrefix}${key}`, // e.g., 'V1CoreFullInsightsComponent: V3InsightsFacade(V1BaseFeatureComponent_main)/locations', 'V1CoreFullInsightsComponent/co2: V3InsightsFacade(V1BaseFeatureComponent_main)/locations'
      value: error.value,
    });
  }
}
