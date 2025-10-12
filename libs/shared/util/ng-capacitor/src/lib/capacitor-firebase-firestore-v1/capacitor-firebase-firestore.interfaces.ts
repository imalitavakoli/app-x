import {
  DocumentData,
  DocumentSnapshot,
  QueryCompositeFilterConstraint,
  QueryNonFilterConstraint,
} from '@capacitor-firebase/firestore';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface V1CapacitorFirebaseFirestore_DocumentSnapshot<T = DocumentData>
  extends DocumentSnapshot<T> {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface V1CapacitorFirebaseFirestore_QueryCompositeFilterConstraint
  extends QueryCompositeFilterConstraint {}

export type V1CapacitorFirebaseFirestore_QueryNonFilterConstraint =
  QueryNonFilterConstraint;
