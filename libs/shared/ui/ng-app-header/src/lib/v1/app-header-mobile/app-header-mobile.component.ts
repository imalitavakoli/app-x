import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  OnChanges,
  SimpleChanges,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { IonHeader } from '@ionic/angular/standalone';

import { V1Communication_Event } from '@x/shared-util-ng-bases-model';
import { V1CommunicationService } from '@x/shared-util-ng-services';

import { V1AppHeaderMobile_Nav } from './app-header-mobile.interfaces';

@Component({
  selector: 'x-app-header-mobile-v1',
  standalone: true,
  imports: [IonHeader, CommonModule, RouterModule, AngularSvgIconModule],
  templateUrl: './app-header-mobile.component.html',
  styleUrl: './app-header-mobile.component.scss',
})
export class V1AppHeaderMobileComponent implements OnInit, OnChanges {
  protected _destroyRef = inject(DestroyRef);
  private readonly _translocoService = inject(TranslocoService);
  private _communicationService = inject(V1CommunicationService);

  isPopOpened = false;
  title = '';

  /** Dashboard page flag. Useful for the times that we like to have some custom styles for that page. */
  isPageDashboard = false;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Input() isAuthenticated = false;

  /** Current page route name to display in the header as title. */
  @Input() pageRouteName = 'dashboard';

  /** List of links in the footer to navigate to different pages. */
  @Input() nav?: V1AppHeaderMobile_Nav[];

  @Output() clickedGoBack = new EventEmitter<void>();

  @Output() layoutChange = new EventEmitter<'base' | 'inner'>();
  private _layout: 'base' | 'inner' = 'base';
  @Input() get layout() {
    return this._layout;
  }
  set layout(value: 'base' | 'inner') {
    this._layout = value;
    // Ensure change detection happens in the next cycle
    setTimeout(() => {
      this.layoutChange.emit(value);
    });
  }

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

  ngOnChanges(changes?: SimpleChanges) {
    // Helper function to check if a specific input has changed.
    const isInputChanged = (param: string): boolean => {
      if (!changes) return false;
      if (!changes[param]) return false;
      const prevValue = changes[param].previousValue;
      const currValue = changes[param].currentValue;
      if (prevValue !== currValue) return true;
      return false;
    };

    // Dispatch the actions based on the changed inputs.
    if (isInputChanged('pageRouteName')) this._setTextTitle(this.pageRouteName);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  private _setTextTitle(pageRouteName: string) {
    // Before understanding in what page we are... Let's first reset
    // page-specific flags (that are being used in HTML for styling).
    this.isPageDashboard = false;

    // Let's understand in what page we are.
    if (pageRouteName === 'dashboard') {
      this.title = this._translocoService.translate('menu_options.dashboard');
      this.isPageDashboard = true;
    } else if (pageRouteName === 'account') {
      this.title = this._translocoService.translate('menu_options.account');
    } else if (pageRouteName === 'x-users') {
      this.title = this._translocoService.translate('menu_options.x_users');
    }
  }
}
