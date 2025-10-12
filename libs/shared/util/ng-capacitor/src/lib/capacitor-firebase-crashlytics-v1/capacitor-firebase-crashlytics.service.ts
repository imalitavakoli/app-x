import { inject, Injectable, NgZone } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';
import { FirebaseCrashlytics } from '@capacitor-firebase/crashlytics';

@Injectable({
  providedIn: 'root',
})
export class V1CapacitorFirebaseCrashlyticsService {
  /* General //////////////////////////////////////////////////////////////// */

  private readonly _ngZone = inject(NgZone);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Methods                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Enables/disables automatic data collection.
   *
   * NOTE: The value does not apply until the next run of the app.
   *
   * @async
   * @param {boolean} isEnabled
   * @returns {Promise<void>}
   */
  async setEnabled(isEnabled: boolean) {
    await FirebaseCrashlytics.setEnabled({
      enabled: isEnabled,
    });
  }

  /** Returns whether or not automatic data collection is enabled. */
  async isEnabled() {
    const { enabled } = await FirebaseCrashlytics.isEnabled();
    return enabled;
  }

  /** Forces a crash to test the implementation. */
  async crash(message: string) {
    await FirebaseCrashlytics.crash({ message });
  }

  async setUserId(id: number) {
    await FirebaseCrashlytics.setUserId({
      userId: id.toString(),
    });
  }

  /**
   * Adds a custom log message that is sent with your crash data to give
   * yourself more context for the events leading up to a crash. In simple
   * terms, before doing something sensitive, you call this method to log a
   * message, and then do the sensitive thing. If the app crashes, you'll see
   * the log message in the Firebase Crashlytics dashboard, which can help you
   * figure out what caused the crash.
   *
   * @async
   * @param {string} message
   * @returns {*}
   */
  async log(message: string) {
    await FirebaseCrashlytics.log({
      message: message,
    });
  }

  /**
   * Records a non-fatal exception. In simple terms, you can let Firebase
   * Crashlytics know about an error that occurred in your app, but didn't cause
   * it to crash! So instead of waiting for your app to actually crash, you can
   * record handled errors... like a failed API request, or an error you caught
   * in a try/catch block.
   *
   * @async
   * @param {string} message
   * @returns {Promise<void>}
   */
  async recordException(message: string) {
    await FirebaseCrashlytics.recordException({
      message,
    });
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Useful                                                                   */
  /* //////////////////////////////////////////////////////////////////////// */

  async didCrashOnPreviousExecution() {
    const { crashed } = await FirebaseCrashlytics.didCrashOnPreviousExecution();
    return crashed;
  }

  /**
   * Uploads any unsent reports to Crashlytics at next startup.
   *
   * NOTE: When automatic data collection is enabled, Crashlytics automatically
   * uploads reports at startup.
   *
   * @async
   * @returns {Promise<void>}
   */
  async sendUnsentReports() {
    await FirebaseCrashlytics.sendUnsentReports();
  }

  async deleteUnsentReports() {
    await FirebaseCrashlytics.deleteUnsentReports();
  }
}
