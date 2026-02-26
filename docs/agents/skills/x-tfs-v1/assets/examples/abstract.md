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

ng-x-credit

### Functionality Classification

Choose **exactly one** type.

- **Hybrid** – Uses `map`, `data-access`, `ui`, and `feature` libs
- **Abstract** – Uses `map` and `data-access` libs only
- **Visual** – Uses `ui` and `feature` libs only

**Selected type**: Abstract

### Rationale

This functionality is classified as **Abstract** because it involves only data fetching.

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## 🔗Existing Dependencies & Reuse

### Used map / data-access libs

- 'map' libs: _NONE_

- 'data-access' libs: _NONE_

### Used ui / feature libs

- 'ui' libs: _NONE_

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
  - `shared-util-local-storage` lib → `v1LocalPrefGet` (get one of the user's preferences from local storage), `v1LocalPrefSet` (set one of the user's preferences to local storage) functions.

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

`shared-map-ng-x-credit`

#### Exported Class

```ts
export class V1XCredit {}
```

#### Methods (API Endpoints)

| Method                                                 | Returns                            | Description                  |
| ------------------------------------------------------ | ---------------------------------- | ---------------------------- |
| `getSummary(url: string, userId: number, lib = 'any')` | `Observable<V1XCredit_MapSummary>` | Get user credit summary data |
| `getDetail(url: string, userId: number, lib = 'any')`  | `Observable<V1XCredit_MapDetail>`  | Get user credit detail data  |

&nbsp;

For **each method**, specify:

&nbsp;

#### Method: `getSummary`

- **HTTP Method**: `GET`

- **Endpoint**: `{url}/users/{userId}/credit?type=summary`

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
  "user_id": 123,
  "status": "active", // Accepted values: "active" | "inactive" | "pending" | "completed" | "failed"
  "created_at": "2023-10-01T00:00:00"
}
```

- **Error Handling**

  When fetching data, errors may happen, and 'map' lib can log them. Here, we mention the errors that should be exceptions (not get logged): _NONE_

&nbsp;

#### Method: `getDetail`

- **HTTP Method**: `GET`

- **Endpoint**: `{url}/users/{userId}/credit?type=detail`

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
  "user_id": 123,
  "balance": 1000,
  "balance_currency": "USD", // Accepted values: "USD" | "EUR" | "GBP" | "SEK"
  "updated_at": "2023-10-01T00:00:00",
  "expired_at": "2024-10-01T00:00:00"
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

`shared-data-access-ng-x-credit`

#### Exported Facade Class

```ts
export class V1XCreditFacade {}
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

**Selected type**: 'multi-instance'

#### Public Methods

Facade methods, call their related actions (from the lib's Actions file) to update the state object.  
Some actions only need to update the state object in the Reducer file. We reference them as the ones that DO NOT have 'async behaviour'.  
On the other hand, some actions not only update the state object in the Reducer file, but also need to take care of some side effects in the Effect file. We reference them as the ones that DO have 'async behaviour'.

All actions (and accordingly the facade's methods) are considered to NOT have 'async behaviour', unless the following tasks should be done, when the action (facade's method) is called:

- Call 'map' lib's related method.
- Mutate Local Storage, cookies, or some data in SQLite.

| Method                                                           | async behaviour | Description                                                                                                                                                                                                |
| ---------------------------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setStyle(style: V1XCredit_Style)`                               | Yes             | Mutate Local Storage: Set `xCredit_lastSetStyle` property (its accepted values: "rounded" \| "sharp") as one of the user's preferences                                                                     |
| `checkIfAlreadySetStyle()`                                       | Yes             | Mutate Local Storage: Get value of `xCredit_lastSetStyle` property which is already saves as one of the user's preferences. If it was available, dispatch `setStyle` action to also define it in the store |
| `getSummary(url: string, userId: number, id = 'g', lib = 'any')` | Yes             | Call 'map' lib's related method: Get user credit summary of data                                                                                                                                           |
| `getDetail(url: string, userId: number, id = 'g', lib = 'any')`  | Yes             | Call 'map' lib's related method: Get user credit detail data                                                                                                                                               |
| `createIfNotExists(id: string)`                                  | No              | Create a new instance if it doesn't exist                                                                                                                                                                  |
| `reset(id: string)`                                              | No              | Reset one instance object to its initial state                                                                                                                                                             |
| `resetAll()`                                                     | No              | Reset the state                                                                                                                                                                                            |

#### Public Observables

| Observable                      | Type                                       | Description                                     |
| ------------------------------- | ------------------------------------------ | ----------------------------------------------- |
| `state$`                        | `Observable<reducer.V1XCredit_State>`      | The whole state object                          |
| `allEntities$`                  | `Observable<reducer.V1XCredit_Entity[]>`   | Entities array                                  |
| `lastSetStyle$`                 | `Observable<V1XCredit_Style \| undefined>` | Last style which was set ("rounded" \| "sharp") |
| `entity$(id = 'g')`             | `Observable<reducer.V1XCredit_Entity>`     | One entity                                      |
| `entityLoadedLatest$(id = 'g')` | `Observable<V1XCredit_Loadeds>`            | `loadedLatest` property of one entity           |
| `entityLoadeds$(id = 'g')`      | `Observable<V1XCredit_Loadeds>`            | `loadeds` property of one entity                |
| `entityDatas$(id = 'g')`        | `Observable<V1XCredit_Datas>`              | `datas` property of one entity                  |
| `entityHasError$(id = 'g')`     | `Observable<boolean>`                      | Check whether there is an error in one entity   |
| `hasEntity$(id = 'g')`          | `Observable<boolean>`                      | Check whether an entity exists                  |

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## ❓Open Technical Questions

_NONE_
