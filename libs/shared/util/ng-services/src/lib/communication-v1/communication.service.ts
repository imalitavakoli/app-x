import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import {
  V1Communication_Event,
  V1Communication_Data,
} from '@x/shared-util-ng-bases-model';

@Injectable({
  providedIn: 'root',
})
export class V1CommunicationService {
  private _emitChangeSource = new Subject<any | V1Communication_Event>();

  storedData: any | V1Communication_Data = {};
  changeEmitted$ = this._emitChangeSource.asObservable();

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  emitChange(value: any | V1Communication_Event = null) {
    this._emitChangeSource.next(value);
  }
}
