# shared-ui-ng-ionic

v1.

`V1IonicNavComponent` utilizes `<ion-nav>`. Mostly useful to be used in a lib that likes to be shown as a native-like modal. It's actually a wrapper (nav) that holds the whole modal (root component).

`V1IonicNavLinkComponent` utilizes `<ion-nav-link>`. Mostly useful to be used in the modal's pages (root or child component) to enable navigation to the back/root/next modal page (component).

## Implementation guide

Here we're going to learn how we can use the Ionic native-like modal by using `V1IonicNavComponent` & `V1IonicNavLinkComponent` components that this lib offers.

Just image the Test page is your lib which is going to hold the whole modal in itself. Root component is the first page of the modal, and child page is the next page of the modal... There can be as many child pages as you wish.

So in the Test page (your lib) you simply use `V1IonicNavComponent` and provide its `root` input the root component. And in the modal pages (i.e., root & child components) you use `V1IonicNavLinkComponent` to go forward/back between the modal pages.

**Note!** Remember that the modal pages (i.e., root & child components) MUST hold all of their content in `<ion-content>` component which is the Ionic's content holder. Otherwise you won't get the expected visual results on iOS or Android devices.

```ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { IonContent } from '@ionic/angular/standalone';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import {
  V1IonicNavComponent,
  V1IonicNavLinkComponent,
} from '@x/shared-ui-ng-ionic';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    V1IonicNavComponent,
  ],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  readonly configFacade = inject(V2ConfigFacade);
  rootComponent = RootComponent;
}

@Component({
  selector: 'x-root',
  standalone: true,
  imports: [CommonModule, IonContent, V1IonicNavLinkComponent],
  template: `
    <ion-content class="ion-padding">
      <h1>Root</h1>
      <x-ionic-nav-link-v1
        routerDirection="forward"
        [component]="childComponent"
      >
        <button class="e-btn">Go to child</button>
      </x-ionic-nav-link-v1>
    </ion-content>
  `,
  styles: [``],
})
export class RootComponent {
  childComponent = ChildComponent;
}

@Component({
  selector: 'x-child',
  standalone: true,
  imports: [CommonModule, IonContent, V1IonicNavLinkComponent],
  template: `
    <ion-content class="ion-padding">
      <h1>Child</h1>
      <x-ionic-nav-link-v1 routerDirection="back">
        <button class="e-btn">Back</button>
      </x-ionic-nav-link-v1>
    </ion-content>
  `,
  styles: [``],
})
export class ChildComponent {}
```

```html
<x-ionic-nav-v1 [root]="rootComponent"></x-ionic-nav-v1>
```

## Important requirements

_None._

## Running unit tests

Run `nx test shared-ui-ng-ionic` to execute the unit tests.
