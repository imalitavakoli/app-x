import { Route } from '@angular/router';
import { V1XUsersPageComponent } from './users/users.component';
import { V1XUsersAllPageComponent } from './users-all/users-all.component';
import { V1XUsersEditPageComponent } from './users-edit/users-edit.component';
import { V1XUsersNewPageComponent } from './users-new/users-new.component';
import { V1XUsersOnePageComponent } from './users-one/users-one.component';

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
