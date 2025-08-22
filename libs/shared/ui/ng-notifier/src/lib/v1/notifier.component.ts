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
  imports: [CommonModule, V1ToggleMeDirective],
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.scss'],
})
export class V1NotifierComponent {
  isOpen = false;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

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
    this.isOpen = value ? true : false;
    this._dispatchEvent();
    this._autoClose();
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

  private _autoClose() {
    setTimeout(() => {
      this.isOpen = false;
      this._dispatchEvent();
    }, this.closeAfter);
  }

  private _dispatchEvent() {
    if (!this.isOpen) this.closed.emit();
    else this.opened.emit();
  }
}
