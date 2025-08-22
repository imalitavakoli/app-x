import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  V1CapacitorCoreService,
  V1CapacitorCore_AppInfo,
} from '@x/shared-util-ng-capacitor';
import {
  V1AppAccSidebarComponent,
  V1AppAccSidebar_State,
} from '@x/shared-ui-ng-app-acc-sidebar';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';

@Component({
  selector: 'x-app-acc-sidebar-fea-v1',
  standalone: true,
  imports: [CommonModule, V1AppAccSidebarComponent],
  templateUrl: './app-acc-sidebar.component.html',
  styleUrl: './app-acc-sidebar.component.scss',
})
export class V1AppAccSidebarFeaComponent implements OnInit {
  readonly configFacade = inject(V2ConfigFacade);
  private readonly _capacitorCoreService = inject(V1CapacitorCoreService);
  nativeAppInfo: V1CapacitorCore_AppInfo | null = null;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Input() state: V1AppAccSidebar_State = 'general';

  @Input() appVersion!: string;

  @Output() clickedInternalLink = new EventEmitter<void>();
  @Output() clickedLogout = new EventEmitter<void>();

  ngOnInit() {
    this._capacitorCoreService.appGetInfo().then((info) => {
      this.nativeAppInfo = info;
    });
  }
}
