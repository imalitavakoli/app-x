import { inject, Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';

import { V1CapacitorAndroidEdgeToEdgeSupportService_GetInsetsResult } from './capacitor-android-edge-to-edge-support.interfaces';

@Injectable({
  providedIn: 'root',
})
export class V1CapacitorAndroidEdgeToEdgeSupportService {
  /* General //////////////////////////////////////////////////////////////// */

  private readonly _ngZone = inject(NgZone);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Methods                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  async enable() {
    await EdgeToEdge.enable();
  }

  async disable() {
    await EdgeToEdge.disable();
  }

  async getInsets(): Promise<V1CapacitorAndroidEdgeToEdgeSupportService_GetInsetsResult> {
    const result = await EdgeToEdge.getInsets();
    return result;
  }
}
