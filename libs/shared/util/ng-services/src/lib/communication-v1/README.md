# shared-util-ng-services

v1.

## Implementation guide

It eases the communication between the child pages of a parent page (from
child to parent with router-outlet and viceversa).

```ts
// In the parent page:

import { V1CommunicationService } from '@x/shared-util-ng-services';
import { Subscription } from 'rxjs';

private _communicationService = inject(V1CommunicationService);
private _communicationSub!: Subscription;

this._communicationSub = this._communicationService.changeEmitted$.subscribe(e => {
 // Do something with the data.
});
// if (this._communicationSub) this._communicationSub.unsubscribe();

// Store some data for children to use later.
this._communicationService.storedData = {...this._communicationService.storedData, something: 'sth'};
```

```ts
// In the child page:

import { V1CommunicationService } from '@x/shared-util-ng-services';
private _communicationService = inject(V1CommunicationService);

this._communicationService.emitChange();
```
