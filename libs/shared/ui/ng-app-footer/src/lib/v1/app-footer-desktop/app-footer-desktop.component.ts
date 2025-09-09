import { Component, Input } from '@angular/core';

import { TranslocoDirective } from '@jsverse/transloco';
import { V1AppFooterDesktop_Nav } from './app-footer-desktop.interfaces';

@Component({
  selector: 'x-app-footer-desktop-v1',
  standalone: true,
  imports: [TranslocoDirective],
  templateUrl: './app-footer-desktop.component.html',
  styleUrl: './app-footer-desktop.component.scss',
})
export class V1AppFooterDesktopComponent {
  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Input() txtCompanyName = 'X';
  @Input() txtCompanySite = 'x.com';
  @Input() txtCompanySiteLink = 'https://x.com';
  @Input() txtCopyright?: string;

  /** List of links in the footer to navigate to different pages. */
  @Input() nav?: V1AppFooterDesktop_Nav[];

  /* //////////////////////////////////////////////////////////////////////// */
  /* Setters, Getters                                                         */
  /* //////////////////////////////////////////////////////////////////////// */

  get fullYear() {
    return new Date().getFullYear();
  }
}
