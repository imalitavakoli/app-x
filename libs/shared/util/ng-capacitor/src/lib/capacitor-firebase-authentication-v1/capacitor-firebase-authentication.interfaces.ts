import {
  SignInResult,
  GetIdTokenResult,
  User,
} from '@capacitor-firebase/authentication';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface V1CapacitorFirebaseAuthentication_SignInResult
  extends SignInResult {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface V1CapacitorFirebaseAuthentication_User extends User {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface V1CapacitorFirebaseAuthentication_GetIdTokenResult
  extends GetIdTokenResult {}
