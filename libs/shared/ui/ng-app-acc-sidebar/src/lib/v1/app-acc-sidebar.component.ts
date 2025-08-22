import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { AngularSvgIconModule } from 'angular-svg-icon';
import {
  V1AppAccSidebar_Nav,
  V1AppAccSidebar_State,
} from './app-acc-sidebar.interfaces';
import { V1CapacitorCore_AppInfo } from '@x/shared-util-ng-capacitor';

@Component({
  selector: 'x-app-acc-sidebar-v1',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    AngularSvgIconModule,
  ],
  templateUrl: './app-acc-sidebar.component.html',
  styleUrl: './app-acc-sidebar.component.scss',
})
export class V1AppAccSidebarComponent {
  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Input() state: V1AppAccSidebar_State = 'general';

  @Input() appVersion!: string;
  @Input() nativeAppInfo!: V1CapacitorCore_AppInfo | null;
  @Input() buildId!: string;

  /** List of links in the footer to navigate to different pages. */
  @Input() nav?: V1AppAccSidebar_Nav[];

  @Output() clickedInternalLink = new EventEmitter<void>();
  @Output() clickedLogout = new EventEmitter<void>();
}
