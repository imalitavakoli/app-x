# 'ng-x-users' functionality 'page' lib samples

Here are sample files from the 'page' library of the 'ng-x-users' functionality. Use them as inspiration when creating your own 'page' libraries.

```
libs/shared/page/ng-x-users/
├── src/
│   ├── lib/v1/
│   │   ├── x-users/ (parent)
│   │   │   ├── x-users.component.html
│   │   │   ├── x-users.component.scss
│   │   │   └── x-users.component.ts
│   │   ├── x-users-all/ (child)
│   │   │   ├── x-users-all.component.html
│   │   │   ├── x-users-all.component.scss
│   │   │   └── x-users-all.component.ts
│   │   ├── x-users-edit/
│   │   │   ├── x-users-edit.component.html
│   │   │   ├── x-users-edit.component.scss
│   │   │   └── x-users-edit.component.ts
│   │   ├── x-users-new/
│   │   │   ├── x-users-new.component.html
│   │   │   ├── x-users-new.component.scss
│   │   │   └── x-users-new.component.ts
│   │   ├── x-users-one/
│   │   │   ├── x-users-one.component.html
│   │   │   ├── x-users-one.component.scss
│   │   │   └── x-users-one.component.ts
│   │   ├── lib.routes.ts
│   │   └── README.md (inner)
│   ├── index.ts
│   └── test-setup.ts
├── .eslintrc.json
├── jest.config.ts
├── project.json
├── README.md (outer)
├── tsconfig.json
├── tsconfig.lib.json
└── tsconfig.spec.json
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `README.md` (outer) file

Outer `README.md` file of a lib is the one which rests outside of the `src` folder.
It just mentions a high-level explanation of what the lib holds and does.

```md
# shared-page-ng-x-users

This lib is a page for our app(s).

It initializes the required '_feature_' lib(s) to show the page contents.

We import this page in our app(s) `app.routes.ts` file.

**What functionalities this lib initializes?**

- ng-x-users
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `README.md` (inner) file

Inner `README.md` file of a lib is the one which rests inside of the `src` folder.  
It MUST include a ready-to-use code for copy-paste in the `app.routes.ts` file of the Boilerplate app(s) to demonstrate how to use the lib.

````md
# shared-page-ng-x-users

x-users v1.

## Implementation guide

Here's how to import it in the app's `app.routes.ts` file:

```ts
// apps/{app-name}/src/app/app.routes.ts

import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'x-users',
    loadChildren: () =>
      import('@x/shared-page-ng-x-users').then((m) => m.V1XUsersRoutes),
  },
];
```

## More

**Required URL Query Params (inputs):**

_None._

## Important requirements

_None._

## Running unit tests

Run `nx test shared-page-ng-x-users` to execute the unit tests.
````

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `lib.routes.ts` file

`lib.routes.ts` file defines the lib's routes array and exports it.

```ts
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
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `V1XUsersPageComponent` component files

Files related to `V1XUsersPageComponent` component (`''` route).

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

### `x-users.component.ts` file

`''` route's component (the parent).

```ts
import {
  AfterContentChecked,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { LottieComponent } from 'ngx-lottie';

import { V1CapacitorCoreService } from '@x/shared-util-ng-capacitor';
import { V2BasePageParentExtXUsersComponent } from '@x/shared-util-ng-bases-consumer';
import { V1XUsers_MapUser } from '@x/shared-map-ng-x-users';
import { V1PopupComponent } from '@x/shared-ui-ng-popup';
import { V1XUsersFeaComponent } from '@x/shared-feature-ng-x-users';

@Component({
  selector: 'x-x-users-page-v1',
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    LottieComponent,
    V1PopupComponent,
    V1XUsersFeaComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class V1XUsersPageComponent extends V2BasePageParentExtXUsersComponent {
  /* General //////////////////////////////////////////////////////////////// */

  capacitorCoreService = inject(V1CapacitorCoreService);

  /* Starter lib #1: X Users //////////////////////////////////////////////// */

  @ViewChild('xUsersFea', { static: false })
  override starterLib1_xUsersFeaCom!: V1XUsersFeaComponent;

  /* Other lib: Blahblah //////////////////////////////////////////////////// */

  //...

  /* //////////////////////////////////////////////////////////////////////// */
  /* X lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xInitOtherLibs(): void {
    this._initBlahblah();
  }

  protected override _xUpdateOtherLibs(): void {
    this._updateBlahblah();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Starter lib #1: X Users                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  override onXUsersSelectedUser(user: V1XUsers_MapUser) {
    super.onXUsersSelectedUser(user);

    console.log('Selected User (parent):', user);

    // Navigate to the selected user page.
    // NOTE: In 'one', child page we are NOT overriding `onXUsersSelectedUser`
    // function! Because here in this 'all' page, we're immediately navigating
    // to 'one' page as soon as a user is selected! So basically 'one' page
    // gets initialized each time this function is called (i.e., a new user is
    // selected), and we already have access to the page's `id` in its route...
    // So it doesn't make sense to also listen to the user selection event, that
    // is overriding this function.
    // This is also true about other child pages, except 'all' page which is
    // already part of the parent page's UI.
    //
    // NOTE: At the end of the day, all of this depends on your logic! Maybe in
    // your apps, you don't like to navigate to the 'one' page when a user is
    // selected, and instead you prefer to listen to the user change event
    // (i.e., overriding this function in the child pages) and do some other
    // stuff in there.
    this._router.navigate(['./', user.id], { relativeTo: this._route });
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Other lib: Blahblah                                                      */
  /* //////////////////////////////////////////////////////////////////////// */

  private _initBlahblah() {
    //...
  }

  private _updateBlahblah() {
    //...
  }
}
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

### `x-users.component.html` file

`x-users.component.ts` component's HTML template.

```html
<!-- /////////////////////////////////////////////////////////////////////// -->
<!-- Starter lib #1: X Users                                                 -->
<!-- /////////////////////////////////////////////////////////////////////// -->

<ng-template #xUsersFeaTpl>
  <x-x-users-fea-v1
    #xUsersFea
    [showErrors]="false"
    (ready)="onReadyStarterLib1()"
    (hasError)="xOnError({ page: 'parent', lib: 'xUsersFea', error: $event })"
    (selectedUser)="onXUsersSelectedUser($event)"
  ></x-x-users-fea-v1>
</ng-template>

<!-- /////////////////////////////////////////////////////////////////////// -->
<!-- Other lib: Blahblah                                                     -->
<!-- /////////////////////////////////////////////////////////////////////// -->

<ng-template #blahblahFeaTpl>
  <section>Blahblah</section>
</ng-template>

<!-- /////////////////////////////////////////////////////////////////////// -->
<!-- PAGE MAIN STRUCTURE                                                     -->
<!-- /////////////////////////////////////////////////////////////////////// -->

<main>
  <!-- Title -->
  @if (capacitorCoreService.getPlatform() === 'desktop') {
  <header
    *transloco="let t; prefix: 'menu_options'"
    class="relative flex items-center justify-between pb-[32px] pt-[32px]"
  >
    <div class="mx-auto">
      <h1 class="text-[1.625rem] font-bold">Users</h1>
    </div>
  </header>
  }

  <!-- Starter lib #1: X Users -->
  <section class="pt-6">
    <div class="e-container">
      <ng-container *ngTemplateOutlet="xUsersFeaTpl"></ng-container>
    </div>
  </section>

  <section class="e-container mt-8">
    @if ($isReadyStarterLib1()) {
    <!-- Sub page -->
    <router-outlet></router-outlet>
    }
  </section>
</main>

<!-- /////////////////////////////////////////////////////////////////////// -->
<!-- Show errors                                                             -->
<!-- /////////////////////////////////////////////////////////////////////// -->

@if ($errors() && $errors().length > 0) {
<x-popup-v1
  *transloco="let t"
  [isHeadEnable]="true"
  [isOpen]="true"
  (closed)="$errors.set([])"
>
  <div slot="head">
    <i class="bi bi-exclamation-triangle-fill mr-2"></i>
    <span class="font-semibold">{{ t('common.error') }}</span>
  </div>

  <div slot="body">
    <ng-lottie
      width="100%"
      height="180px"
      containerClass="e-ani"
      [options]="{
          path: (configFacade.dataConfigDep$ | async)?.assets?.gfxError,
          loop: false,
        }"
    ></ng-lottie>
    <p class="p m-6 text-center">
      {{ t('common.error_desc') }} @for (error of $errors(); track $index) {
      <!-- Parent page ///////////////////////////////////////////////// -->

      @if (error.page === 'parent') { Parent:
      <small class="e-ecode">{{ error.lib }}, {{ error.error.key }}</small>
      }

      <!-- All page //////////////////////////////////////////////////// -->

      @if (error.page === 'all') { All:
      <small class="e-ecode">{{ error.lib }}, {{ error.error.key }}</small>
      }

      <!-- Edit page /////////////////////////////////////////////////// -->

      @if (error.page === 'edit') { Edit:
      <small class="e-ecode">{{ error.lib }}, {{ error.error.key }}</small>
      }

      <!-- New page //////////////////////////////////////////////////// -->

      @if (error.page === 'new') { New:
      <small class="e-ecode">{{ error.lib }}, {{ error.error.key }}</small>
      }

      <!-- One page //////////////////////////////////////////////////// -->

      @if (error.page === 'one') { One:
      <small class="e-ecode">{{ error.lib }}, {{ error.error.key }}</small>
      } }
    </p>
  </div>
</x-popup-v1>
}
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `V1XUsersAllPageComponent` component files

Files related to `V1XUsersAllPageComponent` component (`''` route).

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

### `x-users-all.component.ts` file

`''` route's component (the child).

```ts
import { Component, OnDestroy, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';

import { V2BasePageChildExtXUsersComponent } from '@x/shared-util-ng-bases-consumer';
import { V1XUsers_MapUser } from '@x/shared-map-ng-x-users';

@Component({
  selector: 'x-x-users-all-page-v1',
  imports: [RouterModule],
  templateUrl: './users-all.component.html',
  styleUrls: ['./users-all.component.scss'],
})
export class V1XUsersAllPageComponent extends V2BasePageChildExtXUsersComponent {
  /* General //////////////////////////////////////////////////////////////// */

  protected override _pageName = 'Users';
  protected override _urlRoot = '/x-users';

  /* Lib: Blahblah ////////////////////////////////////////////////////////// */

  // ...

  /* //////////////////////////////////////////////////////////////////////// */
  /* X lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xInitPre(): void {
    super._xInitPre();
  }

  protected override _xInit(): void {
    super._xInit();

    // Init other libs.
    this._initBlahblah();
  }

  /** This function is called by `onXUsersSelectedUser` when a new user is selected in the UI. */
  private _update(): void {
    this._updateBlahblah();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lib: X Users                                                             */
  /* //////////////////////////////////////////////////////////////////////// */

  override onXUsersSelectedUser(user: V1XUsers_MapUser) {
    super.onXUsersSelectedUser(user);

    console.log('Selected User (all child):', user);

    // Update other libs.
    this._update();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lib: Blahblah                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  private _initBlahblah() {
    //...
  }

  private _updateBlahblah() {
    //...
  }
}
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

### `x-users-all.component.html` file

`x-users-all.component.ts` component's HTML template.

```html
Users 'all' page.
<br />
You may like to list all of the entities here in this page.
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `V1XUsersEditPageComponent` component files

Files related to `V1XUsersEditPageComponent` component (`':id/edit'` route).

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

### `x-users-edit.component.ts` file

`':id/edit'` route's component.

```ts
import { Component, OnDestroy, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';

import { V2BasePageChildExtXUsersComponent } from '@x/shared-util-ng-bases-consumer';
import { V1XUsers_MapUser } from '@x/shared-map-ng-x-users';

@Component({
  selector: 'x-x-users-edit-page-v1',
  imports: [RouterModule],
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss'],
})
export class V1XUsersEditPageComponent extends V2BasePageChildExtXUsersComponent {
  /* General //////////////////////////////////////////////////////////////// */

  protected override _pageName = 'Users';
  protected override _urlRoot = '/x-users';

  /* Lib: Blahblah ////////////////////////////////////////////////////////// */

  // ...

  /* //////////////////////////////////////////////////////////////////////// */
  /* X lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xInitPre(): void {
    super._xInitPre();
  }

  protected override _xInit(): void {
    super._xInit();

    // Init other libs.
    this._initBlahblah();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lib: Blahblah                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  private _initBlahblah() {
    //...
  }
}
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

### `x-users-edit.component.html` file

`x-users-edit.component.ts` component's HTML template.

```html
Users 'edit' page.
<br />
Selected user ID: {{ $id() }}
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `V1XUsersNewPageComponent` component files

Files related to `V1XUsersNewPageComponent` component (`'new'` route).

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

### `x-users-new.component.ts` file

`'new'` route's component.

```ts
import { Component, OnDestroy, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';

import { V2BasePageChildExtXUsersComponent } from '@x/shared-util-ng-bases-consumer';
import { V1XUsers_MapUser } from '@x/shared-map-ng-x-users';

@Component({
  selector: 'x-x-users-new-page-v1',
  imports: [RouterModule],
  templateUrl: './users-new.component.html',
  styleUrls: ['./users-new.component.scss'],
})
export class V1XUsersNewPageComponent extends V2BasePageChildExtXUsersComponent {
  /* General //////////////////////////////////////////////////////////////// */

  protected override _pageName = 'Users';
  protected override _urlRoot = '/x-users';

  /* Lib: Blahblah ////////////////////////////////////////////////////////// */

  // ...

  /* //////////////////////////////////////////////////////////////////////// */
  /* X lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xInitPre(): void {
    super._xInitPre();
  }

  protected override _xInit(): void {
    super._xInit();

    // Init other libs.
    this._initBlahblah();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lib: Blahblah                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  private _initBlahblah() {
    //...
  }
}
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

### `x-users-new.component.html` file

`x-users-new.component.ts` component's HTML template.

```html
Users 'new' page.
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `V1XUsersOnePageComponent` component files

Files related to `V1XUsersOnePageComponent` component (`':id'` route).

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

### `x-users-one.component.ts` file

`':id'` route's component.

```ts
import { Component, OnDestroy, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';

import { V2BasePageChildExtXUsersComponent } from '@x/shared-util-ng-bases-consumer';
import { V1XUsers_MapUser } from '@x/shared-map-ng-x-users';

@Component({
  selector: 'x-x-users-one-page-v1',
  imports: [RouterModule],
  templateUrl: './users-one.component.html',
  styleUrls: ['./users-one.component.scss'],
})
export class V1XUsersOnePageComponent extends V2BasePageChildExtXUsersComponent {
  /* General //////////////////////////////////////////////////////////////// */

  protected override _pageName = 'Users';
  protected override _urlRoot = '/x-users';

  /* Lib: Blahblah ////////////////////////////////////////////////////////// */

  // ...

  /* //////////////////////////////////////////////////////////////////////// */
  /* X lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xInitPre(): void {
    super._xInitPre();
  }

  protected override _xInit(): void {
    super._xInit();

    // Init other libs.
    this._initBlahblah();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lib: Blahblah                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  private _initBlahblah() {
    //...
  }
}
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

### `x-users-one.component.html` file

`x-users-one.component.ts` component's HTML template.

```html
Users 'one' page.
<br />
Selected user ID: {{ $id() }}

<section class="my-2 flex gap-2">
  <a
    class="e-btn bg-eprimary hover:bg-eprimary-lighter"
    [routerLink]="['/x-users', $id(), 'edit']"
  >
    Edit User
  </a>

  <a
    class="e-btn bg-epositive hover:bg-epositive-lighter"
    [routerLink]="['/x-users', 'new']"
  >
    New User
  </a>
</section>
```
