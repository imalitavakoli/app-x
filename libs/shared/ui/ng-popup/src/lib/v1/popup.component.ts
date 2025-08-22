import {
  inject,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { V1CommunicationService } from '@x/shared-util-ng-services';
import { V1Communication_Event } from '@x/shared-util-ng-bases-model';
import { V1ToggleMeDirective } from '@x/shared-ui-ng-directives';

/**
 * Show a popup on a page.
 *
 * @export
 * @class V1PopupComponent
 * @typedef {V1PopupComponent}
 */
@Component({
  selector: 'x-popup-v1',
  standalone: true,
  imports: [CommonModule, V1ToggleMeDirective],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class V1PopupComponent implements OnDestroy {
  private _communicationService = inject(V1CommunicationService);
  isShown = false;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Input() set isOpen(value: boolean) {
    this.isShown = value;
  }

  @Input() isBgClosingEnabled = true;
  @Input() isClassicEnable = false;
  @Input() isHeadEnable = false;
  @Input() isFootEnable = false;
  @Input() holderClasses = '';

  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnDestroy(): void {
    // Emit the closed event when the component is destroyed.
    this._communicationService.emitChange({
      type: 'changeByUser',
      name: '@V1PopupComponent:Closed',
    } as V1Communication_Event);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  onStatusChanged(data: { status: 'open' | 'close' }) {
    if (data.status === 'open') this.opened.emit();
    else this.closed.emit();

    // Also emit the event via the communication service for the times that
    // indirect components (which cannot listen to the popup output directly)
    // also like to react based on the popup statu change (e.g. header).
    this._communicationService.emitChange({
      type: 'changeByUser',
      name:
        data.status === 'open'
          ? '@V1PopupComponent:Opened'
          : '@V1PopupComponent:Closed',
    } as V1Communication_Event);
  }
}
