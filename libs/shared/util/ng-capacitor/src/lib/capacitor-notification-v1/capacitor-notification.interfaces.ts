import {
  Token,
  PushNotificationSchema,
  ActionPerformed,
} from '@capacitor/push-notifications';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface V1CapacitorNotification_Token extends Token {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface V1CapacitorNotification_Notification
  extends PushNotificationSchema {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface V1CapacitorNotification_Action extends ActionPerformed {}
