import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js';

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
 * An optional `forceEmailInputMode` input can be set to `true` to lock
 * the `inputmode` attribute to `"email"`, bypassing the automatic
 * email / tel detection heuristic. This is useful when both email and
 * phone are accepted but the majority of users are expected to enter an
 * email address.
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
 * Example forcing email inputmode:
 * ```html
 * <input [xFormValidateEmailOrTelV1]="true" [forceEmailInputMode]="true" ngModel name="input" />
 * ```
 *
 * Example with custom default countries:
 * ```html
 * <input [xFormValidateEmailOrTelV1]="true" [defaultCountries]="['SE', 'GB']" ngModel name="input" />
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
export class V1FormValidateEmailOrTelDirective implements Validator {
  @Input() xFormValidateEmailOrTelV1: boolean | string = true;

  /** When `true`, locks `inputmode` to `"email"` instead of auto-detecting. */
  @Input() forceEmailInputMode: boolean | string = false;

  /** Default countries for local phone number validation (without `+` prefix). */
  @Input() defaultCountries: CountryCode[] = [];

  constructor(private _el: ElementRef<HTMLInputElement>) {}

  private get _isEnabled(): boolean {
    // Handle both boolean and string "true"/"false" from template bindings
    return (
      this.xFormValidateEmailOrTelV1 !== false &&
      this.xFormValidateEmailOrTelV1 !== 'false'
    );
  }

  private get _isForceEmail(): boolean {
    return (
      this.forceEmailInputMode !== false && this.forceEmailInputMode !== 'false'
    );
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
    if (this._isForceEmail) {
      input.inputMode = 'email';
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
    const emailError = Validators.email(control);
    if (!emailError) {
      this._syncNativeValidity(false);
      return null;
    }

    // Check if it's a valid telephone number with an international prefix.
    if (isValidPhoneNumber(value)) {
      this._syncNativeValidity(false);
      return null;
    }

    // Check local numbers against default countries (e.g., 0735551234 → SE).
    if (this.defaultCountries.some((cc) => isValidPhoneNumber(value, cc))) {
      this._syncNativeValidity(false);
      return null;
    }

    this._syncNativeValidity(true);
    return { emailOrTel: true };
  }
}
