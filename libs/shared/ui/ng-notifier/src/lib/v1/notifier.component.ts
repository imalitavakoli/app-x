import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { V1ToggleMeDirective } from '@x/shared-ui-ng-directives';

/**
 * Show a notifier on a page that disappears after some seconds.
 *
 * @example
 * ```html
 * <x-notifier-v1 [show]="showNotifier" [closeAfter]="3000">
 *  Message is here!
 * </x-notifier-v1>
 * ```
 *
 * @export
 * @class V1NotifierComponent
 * @typedef {V1NotifierComponent}
 */
@Component({
  selector: 'x-notifier-v1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.scss'],
})
export class V1NotifierComponent {
  isOpen = false;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * CSS classes that are added to the holder.
   *
   * @type {string}
   */
  @Input() holderClasses = '';

  /**
   * Set after how many ms the notifier should get closed.
   *
   * @type {number}
   */
  @Input() closeAfter = 3000;

  /**
   * Define the default state of the notifier. The value that you provide can be
   * a `boolean`, `Observable`, or anything else that can be truthy or `null`,
   * or `undefined`.
   *
   * @type {unknown}
   */
  @Input() set show(value: unknown) {
    const isOpen = value ? true : false;

    // Guard: skip if the open/closed state hasn't actually changed.
    // Without this, every Angular change-detection cycle (including the
    // initial render where show=false) would schedule a stale timer.
    if (isOpen === this.isOpen) return;

    this.isOpen = isOpen;
    this._dispatchEvent();

    if (this.isOpen) {
      // Schedule the auto-close timer only when transitioning to OPEN.
      // At this point all sibling @Inputs (including closeAfter) have already
      // been applied by Angular, so this.closeAfter holds the correct value.
      this._scheduleAutoClose();
    } else {
      // Notifier was closed externally (e.g. parent set show=false).
      // Cancel any pending timer so it cannot fire after the fact.
      this._clearTimer();
    }
  }

  /**
   * Gets dispatched when the notifier is opened.
   *
   * @type {*}
   */
  @Output() opened = new EventEmitter<void>();

  /**
   * Gets dispatched when the notifier is closed.
   *
   * @type {*}
   */
  @Output() closed = new EventEmitter<void>();

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  // Holds the ID of the pending auto-close timer so it can be cancelled.
  // null means no timer is currently running.
  private _timerId: ReturnType<typeof setTimeout> | null = null;

  private _scheduleAutoClose(): void {
    // Always clear any existing timer first.
    // This prevents a previous timer (e.g. from a rapid show→hide→show sequence)
    // from closing the notifier sooner than expected.
    this._clearTimer();
    this._timerId = setTimeout(() => {
      this.isOpen = false;
      this._dispatchEvent();
    }, this.closeAfter); // closeAfter is read here, AFTER all @Inputs are set
  }

  private _clearTimer(): void {
    if (this._timerId !== null) {
      clearTimeout(this._timerId);
      this._timerId = null; // reset so we can safely check later
    }
  }

  private _dispatchEvent() {
    if (!this.isOpen) this.closed.emit();
    else this.opened.emit();
  }
}
