import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'x-modal-network-v1',
  standalone: true,
  templateUrl: './modal-network.component.html',
  styleUrl: './modal-network.component.scss',
})
export class V1ModalNetworkComponent {
  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Input() show = false;

  /** Controls whether the Refresh button is interactive (true = network is up). */
  @Input() connected = false;

  /** Emitted when the user clicks the Refresh button inside the modal. */
  @Output() clickedRefresh = new EventEmitter<void>();
}
