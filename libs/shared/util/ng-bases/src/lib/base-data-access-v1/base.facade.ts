import { inject } from '@angular/core';
import { select, Store } from '@ngrx/store';

/**
 * Base class for 'data-access' lib's facade.
 *
 * @export
 * @class V1BaseFacade
 * @typedef {V1BaseFacade}
 */
export class V1BaseFacade {
  protected readonly _store = inject(Store);
}
