/**
 * @file Here's a facade (proxy layer) that lets other libs to work with this
 * lib! Actually, here our facade class itself straightly uses the NgRx Store,
 * so other libs don't have to!
 */

import { Injectable, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { ConfigActions } from './config.actions';
import { configFeature } from './config.reducer';

@Injectable({
  providedIn: 'root',
})
export class V2ConfigFacade {
  private readonly _store = inject(Store);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Let's select one option from our feature state object.        */
  /* //////////////////////////////////////////////////////////////////////// */

  // Expose our selectors as observables, so that they can be used inside of our
  // components. Why they need to be observables? Because this is the only way
  // for Angular to understand whenever the value of the selected option of our
  // feature state changes, it should update our templates or do some other
  // sutff if we have already subscribed to the observable.

  configState$ = this._store.pipe(select(configFeature.selectV2ConfigState));

  loadedConfigDep$ = this._store.pipe(
    select(configFeature.selectLoadedConfigDep),
  );
  errorConfigDep$ = this._store.pipe(
    select(configFeature.selectErrorConfigDep),
  );
  dataConfigDep$ = this._store.pipe(select(configFeature.selectDataConfigDep));

  loadedConfigFirebase$ = this._store.pipe(
    select(configFeature.selectLoadedConfigFirebase),
  );
  errorConfigFirebase$ = this._store.pipe(
    select(configFeature.selectErrorConfigFirebase),
  );
  dataConfigFirebase$ = this._store.pipe(
    select(configFeature.selectDataConfigFirebase),
  );

  loadedDataBuild$ = this._store.pipe(
    select(configFeature.selectLoadedDataBuild),
  );
  errorDataBuild$ = this._store.pipe(
    select(configFeature.selectErrorDataBuild),
  );
  dataDataBuild$ = this._store.pipe(select(configFeature.selectDataDataBuild));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Actions: Let's modify the state by dispatching actions.                  */
  /* //////////////////////////////////////////////////////////////////////// */

  appInitStart() {
    this._store.dispatch(ConfigActions.appInitStart());
  }

  appInitFinish() {
    this._store.dispatch(ConfigActions.appInitFinish());
  }

  loadConfigDep(
    url: string,
    extraMapFun?: <T, U, V>(d: T, a: U) => V,
    assetsFolderName = 'assets',
  ) {
    this._store.dispatch(
      ConfigActions.loadConfigDep({ url, extraMapFun, assetsFolderName }),
    );
  }

  loadConfigFirebase(url: string) {
    this._store.dispatch(ConfigActions.loadConfigFirebase({ url }));
  }

  loadDataBuild(url: string) {
    this._store.dispatch(ConfigActions.loadDataBuild({ url }));
  }
}
