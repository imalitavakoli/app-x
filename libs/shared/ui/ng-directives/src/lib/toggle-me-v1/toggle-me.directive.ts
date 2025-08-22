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
  selector: '[xToggleMeV1]',
  standalone: true,
})
export class V1ToggleMeDirective implements OnInit, OnDestroy {
  constructor(
    private _elRef: ElementRef,
    private _renderer: Renderer2,
  ) {}

  private _oldStatus = false;
  private _isOpen = false;
  private _selfUnlistener!: () => void;
  private _closerUnlistener!: () => void;
  private _docUnlistener!: () => void;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * The closer element that can close the element.
   *
   * @type {(HTMLElement | null)}
   */
  @Input() closer: HTMLElement | null = null;

  /**
   * Target element to change its CSS classes whenever the element toggles.
   *
   * @type {(HTMLElement | null)}
   */
  @Input() target: HTMLElement | null = null;

  /**
   * Target element's open CSS class.
   *
   * @type {string}
   */
  @Input() targetOpenClass = 'e-target--open';

  /**
   * Target element's close CSS class.
   *
   * @type {string}
   */
  @Input() targetCloseClass = 'e-target--close';

  /**
   * Element's open CSS class.
   *
   * @type {string}
   */
  @Input() openClass = 'e-open';

  /**
   * Element's close CSS class.
   *
   * @type {string}
   */
  @Input() closeClass = 'e-close';

  /**
   * Define whether the element should be toggled if user clicks the element
   * itself (NOT the inside elements of the element).
   *
   * NOTE: Setting this to false, will disable toggling the element when user
   * clicks the element! And this is something that you may not want to do in
   * most cases. But we've put this option here, just in case you need it.
   *
   * @type {boolean}
   */
  @Input() isSelfToggleEnable = true;

  /**
   * Define whether the element should be closed if user clicks outside of the
   * element.
   *
   * NOTE: If this is set to true, then our element will get closed if user
   * clicks outside of it (I mean the 'document' click listener will be set).
   *
   * @type {boolean}
   */
  @Input() isDocCloseEnable = true;

  /**
   * Define the default status of the element.
   *
   * @type {boolean}
   */
  @Input() set isOpen(value: boolean) {
    this._isOpen = value;
    this._setClasses();
    this._dispatchEvent();
  }

  /**
   * Gets dispatched when the status changes.
   *
   * @type {*}
   */
  @Output() statusChanged = new EventEmitter<{ status: 'open' | 'close' }>();

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit(): void {
    this._setClasses(); // Set default CSS classes
    if (this.closer) this._setCloserListener();
    if (this.isSelfToggleEnable) this._setSelfListener();
    if (this.isDocCloseEnable) this._setDocListener();
  }

  ngOnDestroy(): void {
    if (this._closerUnlistener) this._closerUnlistener();
    if (this._selfUnlistener) this._selfUnlistener();
    if (this._docUnlistener) this._docUnlistener();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  private _setCloserListener() {
    this._closerUnlistener = this._renderer.listen(
      this.closer,
      'click',
      (e: Event) => {
        // Close on closer element click.
        this._isOpen = false;

        // Set CSS classes & dispatch events based on `_isOpen`.
        this._setClasses();
        this._dispatchEvent();
      },
    );
  }

  private _setSelfListener() {
    this._selfUnlistener = this._renderer.listen(
      this._elRef.nativeElement,
      'click',
      (e: Event) => {
        // Understand if user clicked inside of the element or the element itself.
        const clickedSelf = e.target === this._elRef.nativeElement;
        const clickedInside =
          this._elRef.nativeElement.contains(e.target) &&
          e.target !== this._elRef.nativeElement;

        // Toggle ONLY IF user clicked the element itself and NOT inside of it.
        if (clickedSelf && !clickedInside) this._isOpen = !this._isOpen;

        // Set CSS classes & dispatch events based on `_isOpen`.
        this._setClasses();
        this._dispatchEvent();
      },
    );
  }

  private _setDocListener() {
    this._docUnlistener = this._renderer.listen(
      'document',
      'click',
      (e: Event) => {
        // Understand if user clicked inside of the element or the element itself.
        const clickedSelf = e.target === this._elRef.nativeElement;
        const clickedInside =
          this._elRef.nativeElement.contains(e.target) &&
          e.target !== this._elRef.nativeElement;
        let clickedSelfTarget;
        let clickedInsideTarget;

        // Understand if user clicked inside of the target or the target itself.
        if (this.target) {
          clickedSelfTarget = e.target === this.target;
          clickedInsideTarget =
            this.target.contains(e.target as Node) && e.target !== this.target;
        }

        // Close ONLY IF user clicks outside of the element.
        if (!clickedSelf && !clickedInside) {
          // If target exists, also check if user clicks outside of the target
          // and NOT the target... Why? Because we don't like to close the
          // toggle if user clicks in the target as well! Now this target can be
          // inside of the element itself, or even outside of it! Whatsoever, we
          // don't like to toggle, if the target is clicked too...
          if (this.target) {
            if (!clickedSelfTarget && !clickedInsideTarget)
              this._isOpen = false;
          } else {
            this._isOpen = false;
          }
        }

        // Set CSS classes & dispatch events based on `_isOpen`.
        this._setClasses();
        this._dispatchEvent();
      },
    );
  }

  private _setClasses() {
    if (!this._isOpen) {
      // Remove CSS classes
      const openClasses = this.openClass.split(' ');
      openClasses.forEach((cls) =>
        this._renderer.removeClass(this._elRef.nativeElement, cls),
      );
      if (this.target) {
        const tOpenClasses = this.targetOpenClass.split(' ');
        tOpenClasses.forEach((cls) =>
          this._renderer.removeClass(this.target, cls),
        );
      }

      // Add CSS classes
      const closeClasses = this.closeClass.split(' ');
      closeClasses.forEach((cls) =>
        this._renderer.addClass(this._elRef.nativeElement, cls),
      );
      if (this.target) {
        const tCloseClasses = this.targetCloseClass.split(' ');
        tCloseClasses.forEach((cls) =>
          this._renderer.addClass(this.target, cls),
        );
      }
    } else {
      // Remove CSS classes
      const closeClasses = this.closeClass.split(' ');
      closeClasses.forEach((cls) =>
        this._renderer.removeClass(this._elRef.nativeElement, cls),
      );
      if (this.target) {
        const tCloseClasses = this.targetCloseClass.split(' ');
        tCloseClasses.forEach((cls) =>
          this._renderer.removeClass(this.target, cls),
        );
      }

      // Add CSS classes
      const openClasses = this.openClass.split(' ');
      openClasses.forEach((cls) =>
        this._renderer.addClass(this._elRef.nativeElement, cls),
      );
      if (this.target) {
        const tOpenClasses = this.targetOpenClass.split(' ');
        tOpenClasses.forEach((cls) =>
          this._renderer.addClass(this.target, cls),
        );
      }
    }
  }

  private _dispatchEvent() {
    if (this._oldStatus === this._isOpen) return;

    if (!this._isOpen) this.statusChanged.emit({ status: 'close' });
    else this.statusChanged.emit({ status: 'open' });

    // Update `_oldStatus` value! Because if the 'document' click listener is
    // active, user may click it multiple times, and we don't like to dispatch
    // events on each click... So after we once dispatched the events, we set
    // `_oldStatus` to `_isOpen`.
    this._oldStatus = this._isOpen;
  }
}
