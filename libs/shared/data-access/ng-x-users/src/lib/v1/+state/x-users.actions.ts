import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { V1XUsers_MapUser } from '@x/shared-map-ng-x-users';

export const XUsersActions = createActionGroup({
  source: 'V1XUsers',

  events: {
    /* Set/Update/Delete entities /////////////////////////////////////////// */

    getAll: props<{ url: string }>(),
    getAllSuccess: props<{ users: V1XUsers_MapUser[] }>(),

    addOne: props<{ url: string; user: V1XUsers_MapUser }>(),
    addOneSuccess: props<{ user: V1XUsers_MapUser }>(),

    addMany: props<{ url: string; users: V1XUsers_MapUser[] }>(),
    addManySuccess: props<{ users: V1XUsers_MapUser[] }>(),

    updateOne: props<{ url: string; user: V1XUsers_MapUser }>(),
    updateOneSuccess: props<{ user: Update<V1XUsers_MapUser> }>(),

    updateMany: props<{ url: string; users: V1XUsers_MapUser[] }>(),
    updateManySuccess: props<{ users: Update<V1XUsers_MapUser>[] }>(),

    removeOne: props<{ url: string; id: number }>(),
    removeOneSuccess: props<{ id: number }>(),

    removeMany: props<{ url: string; ids: number[] }>(),
    removeManySuccess: props<{ ids: number[] }>(),

    removeAll: props<{ url: string }>(),
    removeAllSuccess: emptyProps(),

    failure: props<{ error: string }>(),

    /* Other actions //////////////////////////////////////////////////////// */

    setSelectedId: props<{ id: number }>(),
  },
});
