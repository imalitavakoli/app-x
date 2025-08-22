import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[xLongPressMeV1]',
  standalone: true,
})
export class V1LongPressMeDirective {
  constructor(
    private _elRef: ElementRef,
    private _renderer: Renderer2,
  ) {}

  private pressTimer?: ReturnType<typeof setTimeout>;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Input() longPressDur = 500; // milliseconds
  @Output() longPress = new EventEmitter<void>();

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  private _startPressTimer() {
    this._clearPressTimer(); // clear previous just in case
    this.pressTimer = setTimeout(() => {
      this.longPress.emit();
    }, this.longPressDur);
  }

  private _clearPressTimer() {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      this.pressTimer = undefined;
    }
  }

  // Desktop events
  @HostListener('mousedown') onMouseDown() {
    this._startPressTimer();
  }

  @HostListener('mouseup') onMouseUp() {
    this._clearPressTimer();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this._clearPressTimer();
  }

  // Mobile events
  @HostListener('touchstart') onTouchStart() {
    this._startPressTimer();
  }

  @HostListener('touchend') onTouchEnd() {
    this._clearPressTimer();
  }

  @HostListener('touchcancel') onTouchCancel() {
    this._clearPressTimer();
  }
}
