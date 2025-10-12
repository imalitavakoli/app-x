# shared-util-ng-capacitor

v1.

`V1CapacitorFirebaseFirestoreService` gives access to the Firebase (RemoteConfig) functionality.

**Note!** Unlike the web-specific Firebase service (in the services lib) which has `init` method that receives the Firebase config, the native-specific Firebase Capacitor plugins don't require that! Why? Because these plugins read the config from `google-services` file that is placed in our native projects.

## Implementation guide

```ts
import { DestroyRef } from '@angular/core';
import {
  V1CapacitorFirebaseFirestoreService,
  V1CapacitorFirebaseFirestore_DocumentSnapshot,
} from '@x/shared-util-ng-capacitor';

protected readonly _destroyRef = inject(DestroyRef);
private readonly _capacitorFirebaseFirestoreService = inject(V1CapacitorFirebaseFirestoreService);

/* Methods ////////////////////////////////////////////////////////////////// */


let refId = string | undefined = undefined;
this._capacitorFirebaseFirestoreService.addDocument('users', { first: 'John', last: 'Doe' }).then((e) => {
  refId = e;
});

this._capacitorFirebaseFirestoreService.setDocument(`users/${refId}`, { first: 'Jane' });

let user: V1CapacitorFirebaseFirestore_DocumentSnapshot<{first: string; last: string;}> | undefined = undefined;
this._capacitorFirebaseFirestoreService.getDocument(`users/${refId}`).then((e) => {
  user = e;
});

// Learn more: https://capawesome.io/blog/announcing-the-capacitor-firebase-cloud-firestore-plugin/#get-data
let users = V1CapacitorFirebaseFirestore_DocumentSnapshot<{first: string; last: string;}>[] | undefined = undefined;
this._capacitorFirebaseFirestoreService.getCollection('users').then((e) => {
  users = e;
});

/* Listeners //////////////////////////////////////////////////////////////// */

this._capacitorFirebaseFirestoreService.onDocumentSnapshot(`users/${refId}`)
  .pipe(takeUntilDestroyed(this._destroyRef))
  .subscribe({
    next: (event) => console.log('Updated:', event),
    error: (err) => console.error('Error:', err),
  });

this._capacitorFirebaseFirestoreService.onCollectionSnapshot('users')
  .pipe(takeUntilDestroyed(this._destroyRef))
  .subscribe({
    next: (event) => console.log('Updated:', event),
    error: (err) => console.error('Error:', err),
  });
```
