import { inject, Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  AppTrackingTransparency,
  AppTrackingStatusResponse,
} from 'capacitor-plugin-app-tracking-transparency';
import { V1CapacitorAtt_AppTrackingStatusResponse } from './capacitor-att.interfaces';

@Injectable({
  providedIn: 'root',
})
export class V1CapacitorAttService {
  /* //////////////////////////////////////////////////////////////////////// */
  /* Methods                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Get the status of user authorization to access app-related data for
   * tracking the user or the device.
   *
   * NOTE: iOS only. In Desktop/Android, this method will always return `authorized` status.
   *
   * @example
   * this._capacitorAttService.getStatus().then((response) => {
   *  console.log('app-tracking-transparency status:', response.status);
   * });
   *
   * @example
   * const response = await this._capacitorAttService.getStatus();
   * console.log('app-tracking-transparency status:', response.status);
   *
   * @returns {Promise<V1CapacitorAtt_AppTrackingStatusResponse>}
   */
  async getStatus(): Promise<V1CapacitorAtt_AppTrackingStatusResponse> {
    const response = await AppTrackingTransparency.getStatus();
    return Promise.resolve(response);
  }

  /**
   * Request app-tracking-transparency permission from the user.
   * Useful to be called after `getStatus` method, when the status is
   * `notDetermined`.
   *
   * Most of the times, first we understand the status of the permission, and if
   * it is `notDetermined`, we show an informative popup in our UI (with message
   * like 'Your data will be used to serve you more relevant data and advices.')
   * to convince the user that it's better for her own experience to allow the
   * app to track her data, then we call this method to request the permission.
   *
   * NOTE: iOS only. In Desktop/Android, this method will always return `authorized` status.
   *
   * @example
   * this._capacitorAttService.requestPermission().then((response) => {
   *  console.log('app-tracking-transparency status:', response.status);
   * });
   *
   * @example
   * const response = await this._capacitorAttService.requestPermission();
   * console.log('app-tracking-transparency status:', response.status);
   *
   * @returns {Promise<V1CapacitorAtt_AppTrackingStatusResponse>}
   */
  async requestPermission(): Promise<V1CapacitorAtt_AppTrackingStatusResponse> {
    const response = await AppTrackingTransparency.requestPermission();
    return Promise.resolve(response);
  }
}
