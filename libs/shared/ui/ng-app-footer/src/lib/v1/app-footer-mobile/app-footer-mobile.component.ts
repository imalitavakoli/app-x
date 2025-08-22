import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { IonFooter } from '@ionic/angular/standalone';

import { V1Communication_Event } from '@x/shared-util-ng-bases-model';
import { V1CommunicationService } from '@x/shared-util-ng-services';

import { V1AppFooterMobile_Nav } from './app-footer-mobile.interfaces';

@Component({
  selector: 'x-app-footer-mobile-v1',
  standalone: true,
  imports: [
    IonFooter,
    CommonModule,
    RouterModule,
    TranslocoDirective,
    AngularSvgIconModule,
  ],
  templateUrl: './app-footer-mobile.component.html',
  styleUrl: './app-footer-mobile.component.scss',
})
export class V1AppFooterMobileComponent implements OnInit {
  protected _destroyRef = inject(DestroyRef);
  private _communicationService = inject(V1CommunicationService);

  isPopOpened = false;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Input() isAuthenticated = false;

  /** List of links in the footer to navigate to different pages. */
  @Input() nav?: V1AppFooterMobile_Nav[];

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit(): void {
    this._communicationService.changeEmitted$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((action: V1Communication_Event) => {
        // `changeByUser` events.
        if (action.type === 'changeByUser') {
          // Handle popup opened/closed styles.
          if (action.name === '@V1PopupComponent:Opened') {
            setTimeout(() => {
              this.isPopOpened = true;
            });
          }
          if (action.name === '@V1PopupComponent:Closed') {
            setTimeout(() => {
              this.isPopOpened = false;
            });
          }
        }
      });
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  onClickedNavItem() {
    // This event can be used by the mobile header to update its layout to
    // 'base' if it's not already.
    this._communicationService.emitChange({
      type: 'changeByUser',
      name: '@V1AppFooterMobileComponent:ClickedNavItem',
    } as V1Communication_Event);
  }
}
