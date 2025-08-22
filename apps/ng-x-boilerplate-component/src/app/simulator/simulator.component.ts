import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  inject,
  isDevMode,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { V1AuthFacade } from '@x/shared-data-access-ng-auth';

@Component({
  selector: 'x-simulator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.scss'],
})
export class SimulatorComponent implements OnInit {
  authFacade = inject(V1AuthFacade);

  // Simulating environment variables.
  private _sampleBaseUrl = '/v1'; // https://client-x-api.x.io
  private _sampleClientId = 1234567890;
  sampleUserEmail = 'ali@x.com'; // https://admin.x.io/admin/users/123456

  // Core(s) required inputs.
  ticketId = 'Undefined';

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Output() isReadyTicketId: EventEmitter<string> = new EventEmitter();

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit(): void {
    // Subscribe to `authState$` to see every state change.
    this.authFacade.authState$.subscribe((state) => {
      // After `_onSendLoginLink` function is called: If we've got success
      // response, save `ticketId`, as we need it to call `_onCheckIfLinkSeen`.
      if (
        state.loadedLatest.magicSendLoginLink &&
        state.datas.magicSendLoginLink
      ) {
        this.ticketId = state.datas.magicSendLoginLink.ticketId;
      }

      // After `_onCheckIfLinkSeen` function is called: If we've got success
      // response, emit `ticketIsCompleted` event, ONLY when the ticket status
      // is completed, because before that, it's useless, as the app still
      // cannot authenticate the user.
      if (state.loadedLatest.checkIfLinkSeen && state.datas.checkIfLinkSeen) {
        if (state.datas.checkIfLinkSeen.ticketStatus === 'completed') {
          this.isReadyTicketId.emit(this.ticketId);
        }
      }
    });
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  onSendLoginLink() {
    this.authFacade.magicSendLoginLink(this._sampleBaseUrl, {
      client_id: this._sampleClientId,
      type: 'email',
      user_reference: this.sampleUserEmail,
    });
  }

  onCheckIfLinkSeen() {
    this.authFacade.checkIfLinkSeen(this._sampleBaseUrl, this.ticketId);
  }
}
