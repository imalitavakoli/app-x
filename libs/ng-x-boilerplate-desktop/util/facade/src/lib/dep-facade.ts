import { Observable, take } from 'rxjs';
import { NativePathType } from '@x/ng-x-boilerplate-desktop-map-native-bridge';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

export abstract class DepFacade {
  protected readonly _store = inject(Store);
  protected _stateId = 0;
  protected abstract featureKey: string;

  protected abstract handleMainProcessStateUpdate(state: object): void;

  abstract state$: Observable<object>;

  constructor() {
    this.listenToMainProcessUpdates();
  }

  private listenToMainProcessUpdates(): void {
    window.electron_app.onStateUpdate(
      (stateFeatureKey: string, stateObjStr: string) => {
        if (stateFeatureKey !== this.featureKey) return;

        const parsedState = JSON.parse(stateObjStr);

        // Dispatch an action or inform subclasses if additional processing is required
        this.handleMainProcessStateUpdate(parsedState);
      },
    );
  }

  /**
   * Passes the current state of the native bridge to other windows through the main process.
   * The state is retrieved from the nativeBridgeState$ observable, converted to a JSON string,
   * and then sent to the main process using the electron_app's postStateToMainProcess method.
   *
   * @return {void} Does not return a value.
   */
  passStateToOtherWindows() {
    this.state$.pipe(take(1)).subscribe((state) => {
      window?.electron_app.postStateToMainProcess(
        this.featureKey,
        JSON.stringify(state),
      );
    });
  }
}
