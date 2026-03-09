# Technical Functional Specification (TFS)

**Purpose**: Translate an approved **PRD** into a concrete, frontend-oriented technical plan. This document defines _how the feature will be built_ in our Nx + Angular workspace, which libraries are required, and what **public contracts** (methods, inputs, outputs, and etc.) each library must expose.

---

- **TFS Status** (Draft / Reviewed / Approved): Approved
- **Last Updated** (YYYY‑MM‑DD): 2026-02-21
- **Owner**: Ali

---

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## ℹ️Overview

### Functionality Name

ng-x-users

### Functionality Classification

Choose **exactly one** type.

- **Hybrid** – Uses `map`, `data-access`, `ui`, and `feature` libs
- **Abstract** – Uses `map` and `data-access` libs only
- **Visual** – Uses `ui` and `feature` libs only

**Selected type**: Hybrid

### Rationale

This functionality is classified as **Hybrid** because it involves both data fetching and UI presentation.  
Regarding data fetching, it requires to do CRUD operations on a resource.

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## 🔗Existing Dependencies & Reuse

### Used map / data-access libs

- 'map' libs:
  - `shared-map-ng-config` lib → `V2Config_MapDep` interface: Access to DEP config (which holds Base URL, Client ID, etc.) interface.

- 'data-access' libs:
  - `shared-data-access-ng-config` lib → `V2ConfigFacade` class → `configState$` observable: Access to DEP config (which holds Base URL, Client ID, etc.) loaded data.
  - `shared-data-access-ng-auth` lib → `V1AuthFacade` class → `authState$` observable: Access authentication state (which holds user's ID, token ID, etc.).

### Used ui / feature libs

- 'ui' libs:
  - `shared-ui-ng-popup` lib.

- 'feature' libs: _NONE_

### Used util libs

**What are 'util' libs?**  
These are libs that contain low-level utilities used by many libs and apps. They can contain services or non-technology (e.g., not Angular specific) related vanilla JS/TS utility functions.

**How to handle localization (i18n) in a 'ui' or 'feature' lib?**  
In 'ui' or 'feature' libs, we can use `TranslocoDirective` or `TranslocoService` to handle localization.  
e.g., in HTML we can do `*transloco="let t"`, and in TS we can do `this.translocoService.translate('key')`.

For 'util' libs, explain briefly _why_ reuse is appropriate.

- 'util' libs:
  - `shared-util-ng-bases` lib.
  - `shared-util-ng-bases-model` lib.
  - `shared-util-ng-services` lib → `V1TrackingService` class → `logEvent` method: Logs an event to Firebase Analytics. Useful in 'ui' & 'feature' libs.

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## 📚Library Breakdown

Include **only** libs relevant to the selected functionality classification.

- **What are 'map' libs?** These are libs that contain codes for interacting with backend or external resources. **Constraints:** They can import 'util', and 'map' types.
- **What are 'data-access' libs?** These are the libs that hold state management codes (i.e., NgRx related files, such as Actions, Reducer, Effects, and Selectors). **Constraints:** They can import 'util', 'map', and 'data-access' types.
- **What are 'ui' libs?** These are stupid libs! They only contain stylesheets, presentational components, directives, and pipes. **Constraints:** They can import 'util', 'map', and 'ui' types.
- **What are 'feature' libs?** These are smart (with access to data sources) libs! They are some smart components (which present an independent functionality) that can also access data sources through 'data-access' libs. They are the last piece of the puzzle to complete the logic of a functionality. **Constraints:** They can import 'util', 'map', 'data-access', 'ui', and other 'feature' libs (if necessarily).

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

---

### 🗺️'map' Library Specification

#### Lib Name

`shared-map-ng-x-users`

#### Exported Class

```ts
export class V1XUsers extends V1BaseMap {}
```

#### Methods (API Endpoints)

| Method                                                            | Returns                          | Description       |
| ----------------------------------------------------------------- | -------------------------------- | ----------------- |
| `getAll(url: string, lib = 'any')`                                | `Observable<V1XUsers_MapUser[]>` | Get all users     |
| `addOne(url: string, user: V1XUsers_MapUser, lib = 'any')`        | `Observable<V1XUsers_MapUser>`   | Add one user      |
| `addMany(url: string, users: V1XUsers_MapUser[], lib = 'any')`    | `Observable<V1XUsers_MapUser[]>` | Add many users    |
| `updateOne(url: string, user: V1XUsers_MapUser, lib = 'any')`     | `Observable<V1XUsers_MapUser>`   | Update one user   |
| `updateMany(url: string, users: V1XUsers_MapUser[], lib = 'any')` | `Observable<V1XUsers_MapUser[]>` | Update many users |
| `removeOne(url: string, id: number, lib = 'any')`                 | `Observable<number>`             | Remove one user   |
| `removeMany(url: string, ids: number[], lib = 'any')`             | `Observable<number[]>`           | Remove many users |
| `removeAll(url: string, lib = 'any')`                             | `Observable<void>`               | Remove all users  |

&nbsp;

For **each method**, specify:

&nbsp;

#### Method: `getAll`

- **HTTP Method**: `GET`

- **Endpoint**: `{url}/users`

- **Authentication**:
  - Public endpoint

- **Headers**:

```http
Content-Type: application/json
```

- **Request Body**:

```json
N/A
```

- **Sample Response** (illustrative only):

```json
// Scenario #1
[
  {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "created_at": "2022-05-01T00:00:00"
  }
]
```

- **Error Handling**

  When fetching data, errors may happen, and 'map' lib can log them. Here, we mention the errors that should be exceptions (not get logged): _NONE_

&nbsp;

#### Method: `addOne`

- **HTTP Method**: `POST`

- **Endpoint**: `{url}/users`

- **Authentication**:
  - Protected endpoint
  - `Authorization: Bearer <TOKEN>` required

- **Headers**:

```http
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

- **Request Body**:

```json
{
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz"
}
```

- **Sample Response** (illustrative only):

```json
// Scenario #1
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "created_at": "2022-05-01T00:00:00"
}
```

- **Error Handling**

  When fetching data, errors may happen, and 'map' lib can log them. Here, we mention the errors that should be exceptions (not get logged): _NONE_

&nbsp;

#### Method: `addMany`

- **HTTP Method**: `POST`

- **Endpoint**: `{url}/users`

- **Authentication**:
  - Protected endpoint
  - `Authorization: Bearer <TOKEN>` required

- **Headers**:

```http
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

- **Request Body**:

```json
[
  {
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz"
  }
]
```

- **Sample Response** (illustrative only):

```json
// Scenario #1
[
  {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "created_at": "2022-05-01T00:00:00"
  }
]
```

- **Error Handling**

  When fetching data, errors may happen, and 'map' lib can log them. Here, we mention the errors that should be exceptions (not get logged): _NONE_

&nbsp;

#### Method: `updateOne`

- **HTTP Method**: `PUT`

- **Endpoint**: `{url}/users/{id}`

- **Authentication**:
  - Protected endpoint
  - `Authorization: Bearer <TOKEN>` required

- **Headers**:

```http
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

- **Request Body**:

```json
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz"
}
```

- **Sample Response** (illustrative only):

```json
// Scenario #1
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "created_at": "2022-05-01T00:00:00"
}
```

- **Error Handling**

  When fetching data, errors may happen, and 'map' lib can log them. Here, we mention the errors that should be exceptions (not get logged): _NONE_

&nbsp;

#### Method: `updateMany`

- **HTTP Method**: `PUT`

- **Endpoint**: `{url}/users`

- **Authentication**:
  - Protected endpoint
  - `Authorization: Bearer <TOKEN>` required

- **Headers**:

```http
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

- **Request Body**:

```json
[
  {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz"
  }
]
```

- **Sample Response** (illustrative only):

```json
// Scenario #1
[
  {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "created_at": "2022-05-01T00:00:00"
  }
]
```

- **Error Handling**

  When fetching data, errors may happen, and 'map' lib can log them. Here, we mention the errors that should be exceptions (not get logged): _NONE_

&nbsp;

#### Method: `removeOne`

- **HTTP Method**: `DELETE`

- **Endpoint**: `{url}/users/{id}`

- **Authentication**:
  - Protected endpoint
  - `Authorization: Bearer <TOKEN>` required

- **Headers**:

```http
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

- **Request Body**:

```json
N/A
```

- **Sample Response** (illustrative only):

```json
// Scenario #1
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "created_at": "2022-05-01T00:00:00"
}
```

- **Error Handling**

  When fetching data, errors may happen, and 'map' lib can log them. Here, we mention the errors that should be exceptions (not get logged): _NONE_

&nbsp;

#### Method: `removeMany`

- **HTTP Method**: `DELETE`

- **Endpoint**: `{url}/users`

- **Authentication**:
  - Protected endpoint
  - `Authorization: Bearer <TOKEN>` required

- **Headers**:

```http
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

- **Request Body**:

```json
[1]
```

- **Sample Response** (illustrative only):

```json
// Scenario #1
{
  "deletedCount": 1
}
```

- **Error Handling**

  When fetching data, errors may happen, and 'map' lib can log them. Here, we mention the errors that should be exceptions (not get logged): _NONE_

&nbsp;

#### Method: `removeAll`

- **HTTP Method**: `DELETE`

- **Endpoint**: `{url}/users`

- **Authentication**:
  - Protected endpoint
  - `Authorization: Bearer <TOKEN>` required

- **Headers**:

```http
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

- **Request Body**:

```json
N/A
```

- **Sample Response** (illustrative only):

```json
// Scenario #1
{
  "deletedCount": 1
}
```

- **Error Handling**

  When fetching data, errors may happen, and 'map' lib can log them. Here, we mention the errors that should be exceptions (not get logged): _NONE_

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

---

### 💾'data-access' Library Specification

#### Lib Name

`shared-data-access-ng-x-users`

#### Exported Facade Class

```ts
export class V1XUsersFacade extends V1BaseFacade {}
```

#### 'State object structure' type

Based on how this 'data-access' lib is going to be used, its 'state object structure' can be different. In general, there are 3 'state object structure' types:

- _'single-instance'_ — It is suitable for storing one single data at the same time.  
  **Example:** You call a single API endpoint to fetch a response, so you would use a 'single-instance' state object to just simply store the response in the state object. If you call the API endpoint again, the response will replace the previous fetched data.  
  **Useful for:** The time that the lib is initialized by one single 'feature' lib, or multiple 'feature' libs, but NOT at the same time (i.e., not in the same page).
- _'multi-instance'_ — It is suitable for storing multiple variation of data at the same time.  
  **Example:** You call a single API endpoint with different URL query parameters to fetch different responses, so you would use a 'multi-instance' state object to store each response in a separate instance of the same state object.  
  **Useful for:** The time that the lib is initialized by multiple 'feature' libs at the same time (i.e., in the same page).
- _'entity'_ — It is suitable for CRUD operations.  
  **Example:** You have 'users-all', 'users-edit', 'users-new', 'users-one' pages, and initialize 4 different exported components from a 'feature' lib in each page. And you have 4 different API endpoints to do CRUD operation, so you would use a 'entity' state object to update the stored entities properly.  
  **Useful for:** The time that the lib is initialized by a 'feature' lib that is suppose to do a CRUD operation.

**Selected type**: 'entity'

#### Public Methods

Facade methods, call their related actions (from the lib's Actions file) to update the state object.  
Some actions only need to update the state object in the Reducer file. We reference them as the ones that DO NOT have 'async behaviour'.  
On the other hand, some actions not only update the state object in the Reducer file, but also need to take care of some side effects in the Effect file. We reference them as the ones that DO have 'async behaviour'.

All actions (and accordingly the facade's methods) are considered to NOT have 'async behaviour', unless the following tasks should be done, when the action (facade's method) is called:

- Call 'map' lib's related method.
- Mutate Local Storage, cookies, or some data in SQLite.

| Method                                                            | async behaviour | Description                                          |
| ----------------------------------------------------------------- | --------------- | ---------------------------------------------------- |
| `getAll(url: string, lib = 'any')`                                | Yes             | Triggers API call via 'map' lib to get all users     |
| `setSelectedId(id: number)`                                       | No              | Select a user by id                                  |
| `addOne(url: string, user: V1XUsers_MapUser, lib = 'any')`        | Yes             | Triggers API call via 'map' lib to add one user      |
| `addMany(url: string, users: V1XUsers_MapUser[], lib = 'any')`    | Yes             | Triggers API call via 'map' lib to add many users    |
| `updateOne(url: string, user: V1XUsers_MapUser, lib = 'any')`     | Yes             | Triggers API call via 'map' lib to update one user   |
| `updateMany(url: string, users: V1XUsers_MapUser[], lib = 'any')` | Yes             | Triggers API call via 'map' lib to update many users |
| `removeOne(url: string, id: number, lib = 'any')`                 | Yes             | Triggers API call via 'map' lib to remove one user   |
| `removeMany(url: string, ids: number[], lib = 'any')`             | Yes             | Triggers API call via 'map' lib to remove many users |
| `removeAll(url: string, lib = 'any')`                             | Yes             | Triggers API call via 'map' lib to remove all users  |

#### Public Observables

| Observable          | Type                                           | Description                |
| ------------------- | ---------------------------------------------- | -------------------------- |
| `state$`            | `Observable<reducer.V1XUsers_State>`           | The whole state object     |
| `allEntities$`      | `Observable<V1XUsers_MapUser[]>`               | Entities array             |
| `selectedEntity$`   | `Observable<V1XUsers_MapUser \| undefined>`    | Selected entity            |
| `crudActionLatest$` | `Observable<V1XUsers_CrudAction \| undefined>` | Last CRUD action           |
| `loaded$`           | `Observable<boolean>`                          | Whether the data is loaded |
| `error$`            | `Observable<string \| undefined>`              | Error message              |

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

---

### 🖼️'ui' Library Specification

#### Lib Name

`shared-ui-ng-x-users`

#### Exported Components

**Note added by the developer!**  
Currently we only build the users dropdown visually. New/Edit/Delete user abilities will be built in the future.

##### Component: `V1XUsersComponent`

```ts
@Component(...)
export class V1XUsersComponent extends V1BaseUiComponent implements V1BaseUi_HasIt {}
```

###### Responsibility

View a dropdown to show a list of users, and let the user select one of them.

###### Inputs

Here's the list of inputs that are **common for all** 'ui' components:

- `state` — Defines what elements should be shown in general, based on the value of the component's inputs. Accepted values: `"loading" | "empty" | "data" | "success" | "failure"`.
- `dataType` — Defines what type of data should be shown, when `state = data`. Accepted values: `"all" | "one" | "new" | "edit"`.

Here's the list of **this** component's inputs:

**Required**

- `users: InputSignal<V1XUsers_MapUser[]>` — The list of users to be displayed in the dropdown.

**Optional**

- `state: InputSignal<V1BaseUi_State>`. Default: `'loading'`.
- `dataType: InputSignal<V1BaseUi_DataType>`. Default: `'all'`. **This NEVER changes**.
- `defaultSelectedUser: InputSignal<V1XUsers_MapUser | undefined>`. Default: `undefined` — The default selected user.

###### Outputs

Here's the list of **this** component's outputs:

- `selectedUser: OutputEmitterRef<V1XUsers_MapUser>` — Emitted when the user selects a user from the dropdown.

###### Rendering Rules

Define what should be rendered in HTML template based on `state` and `dataType`.

- `state = loading`:
  - `section[data-cy="x-users-v1_users_loading"]` — Loader / skeleton only

- `state = empty`:
  - `section[data-cy="x-users-v1_users_empty"]` — Holds the whole empty section

- `state = data`:
  - `section[data-cy="x-users-v1_users_data"]` — Holds the whole data section
    - `div.e-dropdown` — Holds the whole dropdown content
      - `button[data-cy="x-users-v1_users_data-btn-dropdown"]` — Dropdown button
      - `div.e-dropdown__container` — Dropdown container
        - `ul[data-cy="x-users-v1_users_data-list"]` — List of users
          - `li` — List item
            - `input[data-cy="x-users-v1_users_data-list-item-input"]` — Radio button to select a user
            - `label.e-list__btn` — Label to display user name

###### Functional Requirements & Business Rule Breakdown (Technical & Frontend Perspective)

- **XUSERS-FR-01**: Test 'state'; Based on defined inputs.
  - **XUSERS-BR-01**: Given none/some required inputs _(Arrange)_; Then `state = loading` _(Negative & boundary)_.
  - **XUSERS-BR-02**: Given ALL required inputs _(Arrange)_; When `users = []` _(Act)_; Then `state = empty` _(Assert)_.
  - **XUSERS-BR-03**: Given ALL required inputs _(Arrange)_; When `users != []` _(Act)_; Then `state = data` _(Assert)_.
- **XUSERS-FR-02**: Test rendered elements; Based on 'state'.
  - **XUSERS-BR-04**: Given `state = loading` _(Arrange)_; Then `[data-cy="x-users-v1_users_loading"]` must be displayed _(Act + Assert)_.
  - **XUSERS-BR-05**: Given `state = empty` _(Arrange)_; Then `[data-cy="x-users-v1_users_empty"]` must be displayed _(Act + Assert)_.
  - **XUSERS-BR-06**: Given `state = data` _(Arrange)_; Then `[data-cy="x-users-v1_users_data"]` must be displayed _(Act + Assert)_.
- **XUSERS-FR-03**: Test output emits; Based on interactions.
  - **XUSERS-BR-07**: Given `state = data` _(Arrange)_; When `input[data-cy="x-users-v1_users_data-list-item-input"]` is clicked _(Act)_; Then `selectedUser` must be emitted _(Assert)_.

###### Analytics & Tracking

- Events to be tracked:
  - When user clicks `input[data-cy="x-users-v1_users_data-list-item-input"]`; log `{name: 'selected_user', params: {com: 'V1XUsersComponent'}}`

###### Error Handling & Edge Cases

In 'ui' components, we mention the edge case scenarios which lead to showing an empty state or a message in the UI: _NONE_

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

---

### 🧩'feature' Library Specification

#### Lib Name

`shared-feature-ng-x-users`

#### Exported Components

**Note added by the developer!**  
Currently we only build the users dropdown visually. New/Edit/Delete user abilities will be built in the future.

##### Component: `V1XUsersFeaComponent`

```ts
@Component(...)
export class V1XUsersFeaComponent extends V1BaseFeatureExtComponent implements V2BaseFeature_ExtHasIt {}
```

###### Responsibility

Initialize and interact with the corresponding 'ui' component + showing any probable 'data-access' lib errors.

###### Inputs

Here's the list of inputs that are **common for all** 'feature' components:

- `showErrors` — Defines whether probable errors should be shown or not.

Here's the list of **this** component's inputs:

**Required**

_NONE_

**Optional**

- `showErrors: InputSignal<boolean>`. Default: `true`.

###### Outputs

Here's the list of outputs that are **common for all** 'feature' components:

- `ready` — Emits only one time! When `_xInitOrUpdateAfterAllDataReady` is already called for the very first time.
- `allDataIsReady` — Emits each time (when an inputs is changed)! When `_xInitOrUpdateAfterAllDataReady` is already called.
- `hasError` — Emits when an error occurs while fetching data from a 'data-access' lib.

Here's the list of **this** component's outputs:

- `ready: OutputEmitterRef<void>`.
- `allDataIsReady: OutputEmitterRef<void>`.
- `hasError: OutputEmitterRef<{ key: string; value: string; }>`.
- `selectedUser: OutputEmitterRef<V1XUsers_MapUser>` — Emitted when the user selects a user from the dropdown.

###### Functional Requirements & Business Rule Breakdown (Technical & Frontend Perspective)

- **XUSERS-FR-01**: Test facade method calls; Based on defined inputs.
  - **XUSERS-BR-03**: Given ALL required inputs _(Arrange)_; Then `V1XUsersFacade` facade's `getAll` method must be called _(Act + Assert)_.
- **XUSERS-FR-03**: Test facade method calls; Based on interactions.
  - **XUSERS-BR-07**: Given ALL required inputs _(Arrange)_; When `V1XUsersComponent` emits `selectedUser` _(Act)_; Then `V1XUsersFacade` facade's `setSelectedId` method must be called _(Assert)_.

###### Analytics & Tracking

- Events to be tracked: _NONE_
- Success / failure signals:
  - `_xInitOrUpdateAfterAllDataReady` is called (internally handled), i.e., facade method(s) API call(s) succeeds; log `{name: 'handled_xInitOrUpdateAfterAllDataReady', params: {com: 'V1XUsersFeaComponent'}}`

###### Error Handling & Edge Cases

In 'feature' components, `hasError` output will be emitted, whenever an error is detected in the state object of the initialized 'data-access' libs (in `_xFacadesAddErrorListeners`). So API calls error handling will happen by default. Here, we mention the state object errors that should be exceptions (not get emitted), and the edge case scenarios which lead to showing an empty state or a message in the UI.

- Consider the following as error exceptions: _NONE_
- Consider the following as edge cases: _NONE_

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## 🧳User Experience & Flows (Technical & Frontend Perspective)

**For a 'visual' or 'hybrid' functionality:**  
'feature' components are the last piece of the puzzle to complete the functionality.

**For an 'abstract' functionality:**  
We don't have 'feature' or 'ui' components! And accordingly this section should be skipped.

**How a functionality can be used when it's built (no matter what the functionality classification type is)?**  
'page' libs (which are initialized in apps) will initialize multiple functionalities in themselves to complete the overall user experience for an app.  
If it's a 'visual' or 'hybrid' functionality, they will initialize the 'feature' components.  
If it's an 'abstract' functionality, they will initialize the 'data-access' facade.

&nbsp;

### Component: `V1XUsersFeaComponent`

**Note added by the developer!**  
The following properties exist in this component to help us not to repeat ourselves:

- `readonly nameThis: string = 'V1XUsersFeaComponent';` — Name of this component.

#### Primary flow

1. 'feature' component: It triggers (navigation, input, lifecycle) — lifecycle:
   - Whenever ALL required inputs of 'feature' lib are defined for the **very first time**, `_xInit` is called.
   - Whenever an input of 'feature' lib is updated, `_xUpdate` is called.

2. 'feature' component: It prepares multi-instance 'data-access' facade by creating new state object instances (in `_xInitPreBeforeDom`) — The following method(s) will be called: _NONE_ (because there's NO multi-instance 'data-access' facade in this 'feature' component)

3. 'feature' component: It (in `_xDataFetch`) calls 'data-access' facade method(s) — The following method(s) will be called (**First time in this step? Then ONLY call independent data request(s)**):
   - `V1XUsersFacade` → `getAll(this._baseUrl, this.nameThis)`

4. 'feature' component: It is already listening (waiting) for 'data-access' object state changes (in `_xFacadesPre`) — Listening to the following observable(s):
   - `V1XUsersFacade` → `loadeds$`

5. 'data-access' facade: Its method(s) invoke 'map' method(s) to call API (in their Effect file) — The following method(s) will be called:  
   **Note!** The following method(s) will be called **ONLY if their corresponding facade method(s) were called in step 3**:
   - `V1XUsers` → `getAll`

6. 'data-access' effect(s): It is listening (waiting) for 'map' observable(s).
7. 'map' class: Its method(s) calls API and wait for response/error.
8. 'map' class: As soon as API response/error is ready, 'map' invokes 'data-access' effect(s), which leads to state object change that 'feature' is listening to.
9. 'feature' component: **If API response was successful, `_xInitOrUpdateAfterAllDataReady` is called and we continue the flow**, otherwise `_xFacadesAddErrorListeners` is called and the flow stops.
10. _This step is skipped for this 'feature' component!_ 'feature' component: By now, SOME data is already fetched successfully. Now, if some more data are required to be fetched, which were dependant to the already fetched data, then right from `_xInitOrUpdateAfterAllDataReady`, we start 3-9 steps again (BEFORE we continue the flow).  
    **Note!** In step 3, this time, we **ONLY call dependent data request(s)**. This loop continues until no more dependent data requests are needed.
11. 'feature' component: By now, ALL data is already fetched successfully. Now, we update the corresponding 'ui' component's inputs based on state object changes — The following input(s) will be updated:
    - If `V1XUsersFacade` → `allEntities$` observable is changed, `users` input is updated.

12. Whenever ALL required inputs of 'ui' lib are defined, its `state` is changed from 'loading' to something else:
    - If `users` input is defined and equal to `[]`, `state` is `empty`.
    - If `users` input is defined and NOT equal to `[]`, `state` is `data`.

13. By now, data fetching is done, and UI's state is defined based on it, so user can do the following:
    - In 'ui' component, if `state = data`:
      - `input[data-cy="x-users-v1_users_data-list-item-input"]` is clicked: Emits `selectedUser: OutputEmitterRef<V1XUsers_MapUser>`.

#### Flow when `input[data-cy="x-users-v1_users_data-list-item-input"]` is clicked (user interaction)

Side effect of this output (radio button click) is 'routing' but it will happen **outside of the functionality**.  
How? 'feature' lib is listening to this output, and emits the same output, and eventually the page that initialized the 'feature' lib is listening to the output and in its handler, takes care of the routing.

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## ❓Open Technical Questions

_NONE_
