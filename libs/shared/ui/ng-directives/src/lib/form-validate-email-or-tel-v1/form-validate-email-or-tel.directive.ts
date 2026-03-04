import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';

/**
 * V1FormValidateEmailOrTelDirective is a template-driven form validator that
 * accepts either a valid email address or a valid telephone number.
 *
 * When enabled, it:
 * 1. Validates the control value against Angular's built-in email validator
 *    first. If that fails, it falls back to a telephone pattern (digits,
 *    spaces, dashes, dots, parentheses, and an optional leading `+`, with
 *    a minimum of 7 and maximum of 15 digit characters).
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
 * Usage:
 * ```html
 * <input [xFormValidateEmailOrTelV1]="true" ngModel name="input" />
 * ```
 *
 * Example with conditional toggle:
 * ```html
 * <input [xFormValidateEmailOrTelV1]="shouldValidate" ngModel name="input" />
 * ```
 */

const TEL_PATTERN = /^\+?[\d\s\-().]{7,15}$/;

/**
 * Heuristic: returns `true` when the trimmed value starts with `+` or a digit
 * and more than half of its characters are digits.
 */
function _looksLikeTel(value: string): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (!/^\+?\d/.test(trimmed)) return false;
  const digitCount = (trimmed.match(/\d/g) || []).length;
  return digitCount > trimmed.length / 2;
}

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

  constructor(private _el: ElementRef<HTMLInputElement>) {}

  private get _isEnabled(): boolean {
    // Handle both boolean and string "true"/"false" from template bindings
    return (
      this.xFormValidateEmailOrTelV1 !== false &&
      this.xFormValidateEmailOrTelV1 !== 'false'
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
    input.inputMode = value.trim()
      ? _looksLikeTel(value)
        ? 'tel'
        : 'email'
      : 'text';
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

    // Check if it's a valid telephone number
    if (TEL_PATTERN.test(value)) {
      this._syncNativeValidity(false);
      return null;
    }

    this._syncNativeValidity(true);
    return { emailOrTel: true };
  }
}
