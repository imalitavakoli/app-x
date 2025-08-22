export type V1AuthPageContentWaiting = 'email' | 'bankid';

export interface V1AuthPageTplEvent {
  template: 'classic' | 'sample';

  /**
   * The event type.
   *
   * error: When an error occurs.
   * changeByUser: When the user changes something by interacting UI.
   * changeByLogic: When app itself changes something in the TS codes.
   *
   * @type {string}
   */
  eventType: 'error' | 'changeByUser' | 'changeByLogic';

  /**
   * This is usually the function name that emits the event.
   * e.g., 'onClickLogin'.
   *
   * @type {string}
   */
  eventName: string;

  /**
   * The value of the event.
   *
   * NOTE: If `eventType === 'error'`, then the value is an object of `V1TplError`.
   *
   * @type {(any | V1AuthPageTplError)}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eventValue: any | V1AuthPageTplError;
}

export interface V1AuthPageTplError {
  template: 'classic' | 'sample';
  lib: string; // The lib name (that got initialized in the template) which caused the error.
  key: string; // The lib's error key.
  value: string; // The lib's error value.
}
