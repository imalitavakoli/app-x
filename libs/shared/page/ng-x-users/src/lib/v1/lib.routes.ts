import { Route } from '@angular/router';
import { V1XUsersPageComponent } from './x-users/x-users.component';
import { V1XUsersAllPageComponent } from './x-users-all/x-users-all.component';
import { V1XUsersEditPageComponent } from './x-users-edit/x-users-edit.component';
import { V1XUsersNewPageComponent } from './x-users-new/x-users-new.component';
import { V1XUsersOnePageComponent } from './x-users-one/x-users-one.component';

export const V1XUsersRoutes: Route[] = [
  {
    path: '',
    component: V1XUsersPageComponent,
    children: [
      { path: '', component: V1XUsersAllPageComponent },
      { path: 'new', component: V1XUsersNewPageComponent },
      { path: ':id', component: V1XUsersOnePageComponent },
      { path: ':id/edit', component: V1XUsersEditPageComponent },
    ],
  },
];
