import { Component, inject } from '@angular/core';

import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';

@Component({
  selector: 'x-test-page-v1',
  standalone: true,
  imports: [RouterModule, TranslocoDirective],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class V1TestPageComponent {
  readonly configFacade = inject(V2ConfigFacade);
}
