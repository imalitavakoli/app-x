import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
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
  imports: [CommonModule, AngularSvgIconModule, V1CurrencyPipe],
  templateUrl: './x-profile-info.component.html',
  styleUrl: './x-profile-info.component.scss',
})
export class V1XProfileInfoComponent extends V1BaseUiComponent {
  style = signal<V1XCredit_Style>('rounded');

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  // state = model<V1BaseUi_State>('loading'); // Introduced in base class
  override dataType = model<V1BaseUi_DataType>('one');

  data = input.required<V1XProfileInfo_MapData>();
  creditDetail = input.required<V1XCredit_MapDetail>();

  icoInfo = input('./assets/images/libs/shared/icon-info.svg');
  langCultureCode = input('en-GB');
  defaultStyle = input<V1XCredit_Style | undefined>(undefined);
  showIcoInfo = input(true);
  showBg = input(true);
  showBtnReadMore = input(true);

  clickedReadMore = output<void>();
  clickedStyle = output<V1XCredit_Style>();

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  onClickedStyle() {
    if (this.style() === 'rounded') this.style.set('sharp');
    else this.style.set('rounded');
    this.clickedStyle.emit(this.style());
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X useful functions                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xHasRequiredInputs(): boolean {
    super._xHasRequiredInputs();

    // Read optional inputs to track them.
    this.icoInfo();
    this.langCultureCode();
    this.defaultStyle();
    this.showIcoInfo();
    this.showBg();
    this.showBtnReadMore();

    // Check for required inputs (which also leads to tracking them).
    if (!this.data() || !this.creditDetail()) return false;
    return true;
  }

  protected override _xSetState(): void {
    super._xSetState();

    // Set default style.
    if (!this.defaultStyle()) this.style.set('rounded');
    else this.style.set(this.defaultStyle() as V1XCredit_Style);

    // Set state.
    this.state.set('data');
  }
}
