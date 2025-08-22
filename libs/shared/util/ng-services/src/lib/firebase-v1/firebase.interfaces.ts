export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
  databaseURL?: string;

  // Any other key might also be possible, according to the Firebase SDK updates.
  [key: string]: any;
}
