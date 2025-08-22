import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonNavLink } from '@ionic/angular/standalone';

@Component({
  selector: 'x-ionic-nav-link-v1',
  standalone: true,
  imports: [IonNavLink, CommonModule],
  templateUrl: './ionic-nav-link.component.html',
  styleUrl: './ionic-nav-link.component.scss',
})
export class V1IonicNavLinkComponent {
  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Component to navigate to.
   *
   * NOTE: It's required ONLY IF the `routerDirection` is 'forward' or 'root'.
   *
   * @type {*}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() component: any;

  /**
   * Data you want to pass to the component as props. Only used if the
   * `routerDirection` is 'forward' or 'root'.
   *
   * NOTE: This is optional.
   *
   * @type {(undefined | unknown | { [key: string]: any })}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() componentProps: undefined | unknown | { [key: string]: any } =
    undefined;

  @Input() routerDirection: 'forward' | 'back' | 'root' = 'forward';
}
