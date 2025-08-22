import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import '@x/shared-ui-framework8-v1';
import * as $AB from 'jquery';

/**
 * Uses Framework8 jQuery plugin to setup the daylight switch and its
 * LocalStorage item.
 *
 * @export
 * @class V1DaylightComponent
 * @typedef {V1DaylightComponent}
 */
@Component({
  selector: 'x-daylight-v1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daylight.component.html',
  styleUrl: './daylight.component.scss',
})
export class V1DaylightComponent implements AfterViewInit, OnDestroy {
  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Input() checkboxId = 'sd';
  @Input() isHidden = true;
  @Input() isCustomStyle = true;
  @Input() darkClass = 'e-dark';

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngAfterViewInit(): void {
    $('.f8-switch-daylight').f8switchdaylight();
  }

  ngOnDestroy(): void {
    $('.f8-switch-daylight').f8switchdaylight('destroy', true);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  removeUserDefinedTheme() {
    $('.f8-switch-daylight').f8switchdaylight('removeUserDefinedTheme');
  }
}
