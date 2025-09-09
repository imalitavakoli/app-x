import { Component, EventEmitter, Input, Output, inject } from '@angular/core';

import { TranslocoDirective } from '@jsverse/transloco';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { V1BaseUi_DataType } from '@x/shared-util-ng-bases-model';
import { V1BaseUiComponent } from '@x/shared-util-ng-bases';
import { V1XCredit_MapSummary } from '@x/shared-map-ng-x-credit';

/**
 * X Profile-Image sample 'ui' lib.
 *
 * @export
 * @class V1XProfileImageComponent
 * @typedef {V1XProfileImageComponent}
 */
@Component({
  selector: 'x-x-profile-image-v1',
  standalone: true,
  imports: [AngularSvgIconModule],
  templateUrl: './x-profile-image.component.html',
  styleUrl: './x-profile-image.component.scss',
})
export class V1XProfileImageComponent extends V1BaseUiComponent {
  // protected _state: V1BaseUi_State = 'loading'; // Introduced in base class
  protected override _dataType: V1BaseUi_DataType = 'one';

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Input() creditSummary!: V1XCredit_MapSummary;

  @Input() imgAvatar = './assets/images/libs/x-profile-image/img-profile.jpg';

  /* //////////////////////////////////////////////////////////////////////// */
  /* X useful functions                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xHasRequiredInputs(): boolean {
    if (!this.creditSummary) return false;
    return true;
  }

  protected override _xSetState(): void {
    // Set state.
    this.state = 'data';
  }
}
