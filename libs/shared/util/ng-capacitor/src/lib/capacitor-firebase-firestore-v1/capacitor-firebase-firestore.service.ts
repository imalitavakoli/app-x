import { inject, Injectable, NgZone } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';
import {
  AddCollectionSnapshotListenerCallbackEvent,
  AddDocumentSnapshotListenerCallbackEvent,
  DocumentData,
  DocumentSnapshot,
  FirebaseFirestore,
  QueryCompositeFilterConstraint,
  QueryNonFilterConstraint,
} from '@capacitor-firebase/firestore';
import {
  V1CapacitorFirebaseFirestore_DocumentSnapshot,
  V1CapacitorFirebaseFirestore_QueryCompositeFilterConstraint,
  V1CapacitorFirebaseFirestore_QueryNonFilterConstraint,
} from './capacitor-firebase-firestore.interfaces';

@Injectable({
  providedIn: 'root',
})
export class V1CapacitorFirebaseFirestoreService {
  /* General //////////////////////////////////////////////////////////////// */

  private readonly _ngZone = inject(NgZone);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Methods                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  async addDocument(collectionName: string, data: object): Promise<string> {
    const { reference } = await FirebaseFirestore.addDocument({
      reference: collectionName,
      data,
    });
    return reference.id;
  }

  async setDocument(path: string, data: object): Promise<void> {
    await FirebaseFirestore.setDocument({
      reference: path, // e.g., 'users/Aorq09lkt1ynbR7xhTUx'
      data,
      merge: true,
    });
  }

  async getDocument(
    path: string,
  ): Promise<V1CapacitorFirebaseFirestore_DocumentSnapshot<DocumentData>> {
    const { snapshot } = await FirebaseFirestore.getDocument({
      reference: path,
    });
    return snapshot;
  }

  async getCollection(
    path: string,
    compositeFilter?: V1CapacitorFirebaseFirestore_QueryCompositeFilterConstraint,
    queryConstraints?: V1CapacitorFirebaseFirestore_QueryNonFilterConstraint[],
  ): Promise<V1CapacitorFirebaseFirestore_DocumentSnapshot<DocumentData>[]> {
    const { snapshots } = await FirebaseFirestore.getCollection({
      reference: path,
      ...(compositeFilter ? { compositeFilter } : {}),
      ...(queryConstraints ? { queryConstraints } : {}),
    });
    return snapshots;
  }

  async deleteDocument(path: string): Promise<void> {
    await FirebaseFirestore.deleteDocument({
      reference: path,
    });
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Listeners                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Emits when the document snapshot is updated.
   *
   * @example
   * this._capacitorFirebaseFirestoreService.onDocumentSnapshot('users/Aorq09lkt1ynbR7xhTUx')
   *  .pipe(takeUntilDestroyed(this._destroyRef))
   *  .subscribe({
   *    next: (event) => console.log('Updated:', event),
   *    error: (err) => console.error('Error:', err),
   *  });
   */
  onDocumentSnapshot(path: string) {
    return new Observable<AddDocumentSnapshotListenerCallbackEvent<DocumentData> | null>(
      (observer) => {
        let callbackId: string | undefined;

        FirebaseFirestore.addDocumentSnapshotListener(
          { reference: path },
          (event, error) => {
            this._ngZone.run(() => {
              if (error) {
                // console.error('Listener error:', error);
                observer.error(error);
              } else {
                observer.next(event);
              }
            });
          },
        )
          .then((id) => {
            callbackId = id;
          })
          .catch((err) => {
            observer.error(err);
          });

        // Teardown logic (unsubscribe)
        return () => {
          if (callbackId) {
            FirebaseFirestore.removeSnapshotListener({ callbackId });
          }
        };
      },
    );
  }

  /**
   * Emits when the document snapshot is updated.
   *
   * @example
   * this._capacitorFirebaseFirestoreService.onCollectionSnapshot('users')
   *  .pipe(takeUntilDestroyed(this._destroyRef))
   *  .subscribe({
   *    next: (event) => console.log('Updated:', event),
   *    error: (err) => console.error('Error:', err),
   *  });
   */
  onCollectionSnapshot(path: string) {
    return new Observable<AddCollectionSnapshotListenerCallbackEvent<DocumentData> | null>(
      (observer) => {
        let callbackId: string | undefined;

        FirebaseFirestore.addCollectionSnapshotListener(
          { reference: path },
          (event, error) => {
            this._ngZone.run(() => {
              if (error) {
                // console.error('Listener error:', error);
                observer.error(error);
              } else {
                observer.next(event);
              }
            });
          },
        )
          .then((id) => {
            callbackId = id;
          })
          .catch((err) => {
            observer.error(err);
          });

        // Teardown logic (unsubscribe)
        return () => {
          if (callbackId) {
            FirebaseFirestore.removeSnapshotListener({ callbackId });
          }
        };
      },
    );
  }
}
