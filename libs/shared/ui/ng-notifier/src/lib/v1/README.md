# shared-ui-ng-notifier

v1.

## Implementation guide

Here's a simple example of how to use the notifier when the app cannot load data from server:

```ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { V1NotifierComponent } from '@x/shared-ui-ng-notifier';

@Component({
  selector: 'x-core',
  standalone: true,
  imports: [CommonModule, V1NotifierComponent],
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss'],
})
export class CoreComponent {
  onNotifierOpened() {
    console.log('Notifier got opened!');
  }

  onNotifierClosed() {
    console.log('Notifier got closed!');
  }
}
```

```html
<x-notifier-v1
  [show]="myFacade.error$ | async"
  [closeAfter]="3000"
  (opened)="onNotifierOpened()"
  (closed)="onNotifierClosed()"
>
  There was an error, please try again later...
</x-notifier-v1>
```

## Important requirements

_None._

## Running unit tests

Run `nx test shared-ui-ng-notifier` to execute the unit tests.
