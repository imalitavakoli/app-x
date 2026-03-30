# shared-util-ng-capacitor

v1.

`V1CapacitorKeyboardService` gives access to the most common functionalities.

## Implementation guide

```ts
import { DestroyRef, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  V1CapacitorKeyboardService,
} from '@eliq/shared-util-ng-capacitor';

private readonly _destroyRef = inject(DestroyRef);
private readonly _capacitorKeyboardService = inject(V1CapacitorKeyboardService);

/* Methods ////////////////////////////////////////////////////////////////// */

// Useful when everything should be destroyed...
this._capacitorKeyboardService.removeAllListeners();

/* Listeners //////////////////////////////////////////////////////////////// */

this._capacitorKeyboardService.onKeyboardWillShow
  .pipe(takeUntilDestroyed(this._destroyRef))
  .subscribe((e) => {
    console.log('Keyboard will show!', e.keyboardHeight);
  });

this._capacitorKeyboardService.onKeyboardWillHide
  .pipe(takeUntilDestroyed(this._destroyRef))
  .subscribe(() => {
    console.log('Keyboard will hide!');
  });

this._capacitorKeyboardService.onKeyboardDidShow
  .pipe(takeUntilDestroyed(this._destroyRef))
  .subscribe((e) => {
    console.log('Keyboard did show!', e.keyboardHeight);
  });

this._capacitorKeyboardService.onKeyboardDidHide
  .pipe(takeUntilDestroyed(this._destroyRef))
  .subscribe(() => {
    console.log('Keyboard did hide!');
  });
```
