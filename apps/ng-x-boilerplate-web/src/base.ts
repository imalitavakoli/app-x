/* You can add global scripts to this file */

export {};

/* ////////////////////////////////////////////////////////////////////////// */
/* shared-ui-framework8                                                       */
/* ////////////////////////////////////////////////////////////////////////// */

// We need to have a global `initializeF8BlocksManually` variable, in order to
// disable the auto initialization of the F8 plugins.
declare global {
  interface Window {
    initializeF8BlocksManually: boolean;
  }
}
window.initializeF8BlocksManually = true;
