import { inject, Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Network, ConnectionStatus } from '@capacitor/network';

import { V1CapacitorNetwork_Status } from './capacitor-network.interfaces';

@Injectable({
  providedIn: 'root',
})
export class V1CapacitorNetworkService {
  /* General //////////////////////////////////////////////////////////////// */

  private readonly _ngZone = inject(NgZone);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Methods                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  /** Remove all native listeners. */
  removeAllListeners() {
    Network.removeAllListeners();
  }

  /**
   * Query the current status of the network connection.
   *
   * @example
   * this._capacitorNetworkService.getStatus().then((status) => {
   *  console.log('Network status:', status.connected, status.connectionType);
   * });
   *
   * @returns {Promise<V1CapacitorNetwork_Status>}
   */
  async getStatus(): Promise<V1CapacitorNetwork_Status> {
    const status = await Network.getStatus();
    return status;
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Listeners                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Emits when the network status changes.
   *
   * @example
   * this._capacitorNetworkService.onNetworkStatusChange.subscribe((status) => {
   *   console.log('Network status changed:', status.connected, status.connectionType);
   * });
   */
  get onNetworkStatusChange() {
    return new Observable<V1CapacitorNetwork_Status>((observer) => {
      const listener = Network.addListener(
        'networkStatusChange',
        (status: ConnectionStatus) => {
          this._ngZone.run(() => {
            observer.next(status);
          });
        },
      );

      return () => {
        listener.then((removeListener) => removeListener.remove());
      };
    });
  }
}
