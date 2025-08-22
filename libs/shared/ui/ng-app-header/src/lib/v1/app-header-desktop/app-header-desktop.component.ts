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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { V1ToggleMeDirective } from '@x/shared-ui-ng-directives';

import { V1AppHeaderDesktop_Nav } from './app-header-desktop.interfaces';

@Component({
  selector: 'x-app-header-desktop-v1',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    AngularSvgIconModule,
    V1ToggleMeDirective,
  ],
  templateUrl: './app-header-desktop.component.html',
  styleUrl: './app-header-desktop.component.scss',
})
export class V1AppHeaderDesktopComponent {
  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Input() isAuthenticated = false;
  @Input() imgLogo = './assets/images/logo.webp';

  /** List of links in the footer to navigate to different pages. */
  @Input() nav?: V1AppHeaderDesktop_Nav[];
}
