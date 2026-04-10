import { inject, Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Capacitor } from '@capacitor/core';
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
    if (!Capacitor.isPluginAvailable('EdgeToEdge')) return;
    await EdgeToEdge.enable();
  }

  async disable() {
    if (!Capacitor.isPluginAvailable('EdgeToEdge')) return;
    await EdgeToEdge.disable();
  }

  async getInsets(): Promise<V1CapacitorAndroidEdgeToEdgeSupportService_GetInsetsResult> {
    if (!Capacitor.isPluginAvailable('EdgeToEdge'))
      return { bottom: 0, left: 0, right: 0, top: 0 };
    const result = await EdgeToEdge.getInsets();
    return result;
  }
}
