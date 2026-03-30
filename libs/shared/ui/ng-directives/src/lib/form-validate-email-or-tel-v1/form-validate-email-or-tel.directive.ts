import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js';

export enum InputMode {
  None = 'none',
  Text = 'text',
  Decimal = 'decimal',
  Numeric = 'numeric',
  Tel = 'tel',
  Search = 'search',
  Email = 'email',
  Url = 'url',
}

/**
 * V1FormValidateEmailOrTelDirective is a template-driven form validator that
 * accepts either a valid email address or a valid telephone number.
 *
 * When enabled, it:
 * 1. Validates the control value against Angular's built-in email validator
 *    first. If that fails, it falls back to telephone validation using
 *    `libphonenumber-js` (the value must be at least 11 characters long
 *    and pass `isValidPhoneNumber`).
 * 2. Keeps the host input as `type="text"` to avoid caret-jumping issues
 *    and instead switches the `inputmode` attribute (`email` / `tel`) so
 *    mobile users get the appropriate virtual keyboard.
 * 3. Syncs the validation result to the native Constraint Validation API
 *    via `setCustomValidity()`, so CSS pseudo-classes (`:valid` / `:invalid`)
 *    react live alongside Angular's `ng-valid` / `ng-invalid` classes.
 *
 * The directive is conditionally enabled via a boolean input binding.
 * When disabled (`false`), no validation, inputmode switching, or native
 * validity syncing is applied.
 *
 * An optional `defaultInputMode` input can be set to a specific
 * inputmode value (e.g. `"email"`) to lock the `inputmode` attribute,
 * bypassing the automatic email / tel detection heuristic. When empty
 * (default), the inputmode switches automatically based on the input value.
 *
 * Usage:
 * ```html
 * <input [xFormValidateEmailOrTelV1]="true" ngModel name="input" />
 * ```
 *
 * Example with conditional toggle:
 * ```html
 * <input [xFormValidateEmailOrTelV1]="shouldValidate" ngModel name="input" />
 * ```
 *
 * Example with a default inputmode:
 * ```html
 * <input [xFormValidateEmailOrTelV1]="true" defaultInputMode="email" ngModel name="input" />
 * ```
 *
 * Example with allowed country codes:
 * ```html
 * <input [xFormValidateEmailOrTelV1]="true" [allowedCountryCodes]="['SE', 'GB']" ngModel name="input" />
 * ```
 *
 * Example requiring production-grade email addresses (with domain dot):
 * ```html
 * <input [xFormValidateEmailOrTelV1]="true" [allowLocalEmails]="false" ngModel name="input" />
 * ```
 */

@Directive({
  selector: '[xFormValidateEmailOrTelV1]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: V1FormValidateEmailOrTelDirective,
      multi: true,
    },
  ],
})
export class V1FormValidateEmailOrTelDirective implements Validator, OnInit {
  @Input() xFormValidateEmailOrTelV1: boolean | string = true;

  /**
   * When set (e.g. `InputMode.Email` or `"email"`), locks `inputmode` to that value instead of auto-detecting.
   *
   * Note: The type uses `` `${InputMode}` `` instead of `InputMode` so that Angular templates can assign
   * plain string attributes (e.g. `defaultInputMode="email"`) without a type error.
   */
  @Input() defaultInputMode: `${InputMode}` | '' = '';

  /** When `true` (default), Angular's built-in email validator is used, which accepts local emails like `user@localhost`. When `false`, a stricter pattern is applied that requires a dot in the domain part (e.g. `user@example.com`). */
  @Input() allowLocalEmails = true;

  /** Allowed country codes for phone validation (e.g. `['SE', 'GB']`). When empty, all countries are accepted. */
  @Input() allowedCountryCodes: CountryCode[] = [];

  /**
   * Strict email pattern used when `allowLocalEmails` is `false`.
   * - Local part: 1-256 alphanumeric chars plus `+`, `.`, `_`, `%`, `-`, `'`
   * - Domain: at least two dot-separated labels, each starting and ending with
   *   an alphanumeric character (hyphens allowed in between).
   */
  private static readonly _STRICT_EMAIL_RE =
    /^[a-zA-Z0-9+._%\-']{1,256}@[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,63}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,25}[a-zA-Z0-9])?)+$/;

  constructor(private _el: ElementRef<HTMLInputElement>) {}

  ngOnInit() {
    if (this._isEnabled && this._hasDefaultInputMode) {
      this._el.nativeElement.inputMode = this.defaultInputMode;
    }
  }

  private get _isEnabled(): boolean {
    // Handle both boolean and string "true"/"false" from template bindings
    return (
      this.xFormValidateEmailOrTelV1 !== false &&
      this.xFormValidateEmailOrTelV1 !== 'false'
    );
  }

  private get _hasDefaultInputMode(): boolean {
    return !!this.defaultInputMode;
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Live inputmode & native validity sync                                    */
  /* //////////////////////////////////////////////////////////////////////// */

  @HostListener('input')
  onInput() {
    if (!this._isEnabled) return;
    const input = this._el.nativeElement;
    const value = input.value || '';

    // Switch inputmode so mobile keyboards adapt (no caret issues with this)
    if (this._hasDefaultInputMode) {
      input.inputMode = this.defaultInputMode;
    } else {
      input.inputMode = /^\+?\d/.test(value.trim()) ? 'tel' : 'email';
    }
  }

  /**
   * Sync Angular validation result with the native Constraint Validation API
   * so that CSS `:valid` / `:invalid` pseudo-classes reflect our validator.
   */
  private _syncNativeValidity(hasError: boolean) {
    const input = this._el.nativeElement;
    if (!input.setCustomValidity) return;
    input.setCustomValidity(hasError ? 'Invalid email or phone number' : '');
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Validation                                                               */
  /* //////////////////////////////////////////////////////////////////////// */

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this._isEnabled || !control.value) {
      this._syncNativeValidity(false);
      return null;
    }

    const value = (control.value as string).trim();

    // Check if it's a valid email
    const isValidEmail = this.allowLocalEmails
      ? !Validators.email(control)
      : V1FormValidateEmailOrTelDirective._STRICT_EMAIL_RE.test(value);

    if (isValidEmail) {
      this._syncNativeValidity(false);
      return null;
    }

    // Phone validation: when allowedCountryCodes is set, only those countries
    // are accepted. Otherwise any valid phone number is accepted.
    if (this.allowedCountryCodes.length > 0) {
      for (const country of this.allowedCountryCodes) {
        if (isValidPhoneNumber(value, country)) {
          this._syncNativeValidity(false);
          return null;
        }
      }
    } else if (isValidPhoneNumber(value)) {
      // No country restriction — accept any valid international number
      this._syncNativeValidity(false);
      return null;
    }

    this._syncNativeValidity(true);
    return { emailOrTel: true };
  }
}
