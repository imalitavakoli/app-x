import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  exhaustMap,
  map,
  take,
  tap,
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { LottieComponent } from 'ngx-lottie';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { V1BaseFeatureExtComponent } from '@x/shared-util-ng-bases';
import { V2Config_MapDep } from '@x/shared-map-ng-config';
import { V1XUsers_MapUser } from '@x/shared-map-ng-x-users';
import { V1PopupComponent } from '@x/shared-ui-ng-popup';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { V1XUsersComponent } from '@x/shared-ui-ng-x-users';
import {
  V1XUsers_State,
  V1XUsersFacade,
} from '@x/shared-data-access-ng-x-users';

@Component({
  selector: 'x-x-users-fea-v1',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoDirective,
    V1PopupComponent,
    LottieComponent,
    V1XUsersComponent,
  ],
  templateUrl: './x-users.component.html',
  styleUrl: './x-users.component.scss',
})
export class V1XUsersFeaComponent extends V1BaseFeatureExtComponent {
  @ViewChild('xUsers') xUsersCom!: V1XUsersComponent;
  protected readonly _router = inject(Router);
  private _route = inject(ActivatedRoute);

  readonly xUsersFacade = inject(V1XUsersFacade);

  defaultSelectedUser?: V1XUsers_MapUser;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * If 'true', then the lib will handle showing error messages in the UI.
   * If 'false', then the lib will NOT handle showing error messages in the UI,
   * and it's up to the parent lib to take advantage of `hasError` output and
   * show error messages.
   *
   * @type {boolean}
   */
  @Input() showErrors = true;

  @Output() selectedUser = new EventEmitter<V1XUsers_MapUser>();

  /* //////////////////////////////////////////////////////////////////////// */
  /* X Lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xInitOrUpdateAfterAllDataReady() {
    super._xInitOrUpdateAfterAllDataReady();

    // Read the already loaded entities from the state object.
    let xUsers: V1XUsers_MapUser[] | undefined = undefined;
    this.xUsersFacade.allEntities$.pipe(take(1)).subscribe((entities) => {
      xUsers = entities;
    });

    // Check URL Query Params inputs
    let defUserId: number | undefined = undefined;
    const queryParams = this._route.snapshot.queryParams;
    if (queryParams['user-id']) defUserId = Number(queryParams['user-id']);

    // Try finding the default selected user in the entities array.
    if (defUserId && xUsers) {
      xUsers = xUsers as V1XUsers_MapUser[];
      this.defaultSelectedUser = xUsers.find((user) => user.id === defUserId);
    }
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  getSelectedUserId(): number {
    return this.xUsersCom.getSelectedUserId();
  }

  getSelectedUser(): V1XUsers_MapUser {
    return this.xUsersCom.getSelectedUser();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X facades functions                                                      */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xFacadesPre(): Observable<boolean>[] {
    const observables = [];
    observables.push(this.xUsersFacade.loaded$);
    return observables;
  }

  protected override _xFacadesLoadesValidation(loadedsArr: boolean[]): boolean {
    const isXUsersDataReady = loadedsArr[0];
    return isXUsersDataReady;
  }

  protected override _xFacadesAddErrorListeners(): void {
    this.xUsersFacade.state$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((state) => {
        // Emit the error messages if any.
        const emitError = (crudAction: V1XUsers_State['crudActionLatest']) => {
          if (state.crudActionLatest === crudAction && state.error) {
            // Don't emit the following errors (they are exceptions).
            if (state.error === 'BLAHBLAH') {
              return;
            }

            // We're here? Then it means that we should emit the error!
            this._xOnError(
              {
                key: crudAction as string,
                value: state.error as string,
              },
              'V1XUsersFacade',
            );
          }
        };

        emitError('getAll');
        emitError('addOne');
        emitError('addMany');
        emitError('updateOne');
        emitError('updateMany');
        emitError('removeOne');
        emitError('removeMany');
        emitError('removeAll');
      });
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X Prepare & reset & fetch data functions                                 */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xDataReset(): void {
    // We don't need to do anything here... As soon as we call `getAll()`, new
    // set of entities will be set in the state object.
  }

  protected override _xDataFetch(): void {
    this.xUsersFacade.getAll(this._baseUrl);
  }
}
