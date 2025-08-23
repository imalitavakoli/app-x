import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { V1BaseUi_DataType } from '@x/shared-util-ng-bases-model';
import { V1BaseUiComponent } from '@x/shared-util-ng-bases';
import {
  V1XCredit_MapDetail,
  V1XCredit_Style,
} from '@x/shared-map-ng-x-credit';
import { V1XProfileInfo_MapData } from '@x/shared-map-ng-x-profile-info';
import { V1CurrencyPipe } from '@x/shared-ui-ng-pipes';

/**
 * X Profile-Info sample 'ui' lib.
 *
 * @export
 * @class V1XProfileInfoComponent
 * @typedef {V1XProfileInfoComponent}
 */
@Component({
  selector: 'x-x-profile-info-v1',
  standalone: true,
  imports: [
    CommonModule,
    AngularSvgIconModule,
    TranslocoDirective,
    V1CurrencyPipe,
  ],
  templateUrl: './x-profile-info.component.html',
  styleUrl: './x-profile-info.component.scss',
})
export class V1XProfileInfoComponent extends V1BaseUiComponent {
  style: V1XCredit_Style = 'rounded';

  // protected _state: V1BaseUi_State = 'loading'; // Introduced in base class
  protected override _dataType: V1BaseUi_DataType = 'one';

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Input() data!: V1XProfileInfo_MapData;
  @Input() creditDetail!: V1XCredit_MapDetail;

  @Input() icoInfo = './assets/images/libs/shared/icon-info.svg';
  @Input() langCultureCode = 'en-GB';
  @Input() defaultStyle?: V1XCredit_Style;
  @Input() showIcoInfo = true;
  @Input() showBg = true;
  @Input() showBtnReadMore = true;

  @Output() clickedReadMore = new EventEmitter<void>();
  @Output() clickedStyle = new EventEmitter<V1XCredit_Style>();

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  onClickedStyle() {
    if (this.style === 'rounded') this.style = 'sharp';
    else this.style = 'rounded';
    this.clickedStyle.emit(this.style);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X useful functions                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xHasRequiredInputs(): boolean {
    if (!this.data || !this.creditDetail) return false;
    return true;
  }

  protected override _xSetState(): void {
    // Set default style.
    if (!this.defaultStyle) this.style = 'rounded';
    else this.style = this.defaultStyle;

    // Set state.
    this.state = 'data';
  }
}
