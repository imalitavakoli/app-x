import { Component, Input } from '@angular/core';

import { IonNav } from '@ionic/angular/standalone';

@Component({
  selector: 'x-ionic-nav-v1',
  standalone: true,
  imports: [IonNav],
  templateUrl: './ionic-nav.component.html',
  styleUrl: './ionic-nav.component.scss',
})
export class V1IonicNavComponent {
  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Input() root: any;

  /**
   * Data you want to pass to the root component as props.
   *
   * NOTE: This is optional.
   *
   * @type {(undefined | unknown | { [key: string]: any })}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() rootParams: undefined | unknown | { [key: string]: any } = undefined;

  /**
   * Whether the transition should be animated.
   *
   * @type {boolean}
   */
  @Input() animated = true;
}
