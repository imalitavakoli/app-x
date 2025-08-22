import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { V1DaylightComponent } from '@x/shared-ui-ng-daylight';
import { TranslocoDirective } from '@jsverse/transloco';
import { v1LocalPrefGet, v1LocalPrefSet } from '@x/shared-util-local-storage';
import {
  ACCOUNT_GENERAL_IS_MODE_SYS_DEF_KEY,
  AccountGeneralIsModeSysDef,
} from './pref.interfaces';

@Component({
  selector: 'x-state-general',
  standalone: true,
  imports: [CommonModule, FormsModule, V1DaylightComponent, TranslocoDirective],
  templateUrl: './state-general.component.html',
  styleUrls: ['./state-general.component.scss'],
})
export class StateGeneralComponent implements OnInit {
  @ViewChild('daylight') daylightComponent!: V1DaylightComponent;

  // State: General
  isModeSysDef = false;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Input() isDaylightSwitchEnabled? = false;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Let's define user's defaults on initialization.
   */
  ngOnInit(): void {
    // App mode
    if (this.isDaylightSwitchEnabled) {
      const isModeSysDef: AccountGeneralIsModeSysDef = v1LocalPrefGet(
        ACCOUNT_GENERAL_IS_MODE_SYS_DEF_KEY,
      );
      if (isModeSysDef) this.isModeSysDef = isModeSysDef;
    }
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  onReadModeSysChange(e: Event) {
    // Save user's decision in LocalStorage.
    this.isModeSysDef = (e.target as HTMLInputElement).checked;
    v1LocalPrefSet(ACCOUNT_GENERAL_IS_MODE_SYS_DEF_KEY, this.isModeSysDef);

    // Update the UI.
    if (this.isModeSysDef) {
      this.daylightComponent.removeUserDefinedTheme();
    }
  }
}
