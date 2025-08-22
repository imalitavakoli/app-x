# shared-ui-ng-daylight

v1.

## Implementation guide

Here's a simple example of how to use the daylight to setup the page day/night mode of an app:

```ts
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { V1DaylightComponent } from '@x/shared-ui-ng-daylight';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [CommonModule, V1DaylightComponent],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  @ViewChild('daylight') daylightComponent!: V1DaylightComponent;
  configFacade = inject(V2ConfigFacade);

  callLibMethods() {
    // Call `removeUserDefinedTheme` method to remove the already saved daylight
    // item in Local Sotrage, and reset the switch to its default state.
    this.daylightComponent.removeUserDefinedTheme();
  }
}
```

```html
@if ((configFacade.dataConfigDep$ | async)?.fun?.feat?.daylightSwitch) {
<x-daylight-v1
  #daylight
  checkboxId="sd"
  [isCustomStyle]="false"
  [isHidden]="false"
></x-daylight-v1>
}
```

## Important requirements

- shared-ui-framework8 (Used the daylight switch)

## Running unit tests

Run `nx test shared-ui-ng-daylight` to execute the unit tests.
