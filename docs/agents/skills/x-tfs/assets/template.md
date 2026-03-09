# Technical Functional Specification (TFS)

**Purpose**: Translate an approved **PRD** into a concrete, frontend-oriented technical plan. This document defines _how the feature will be built_ in our Nx + Angular workspace, which libraries are required, and what **public contracts** (methods, inputs, outputs, and etc.) each library must expose.

---

- **TFS Status** (Draft / Reviewed / Approved): …
- **Last Updated** (YYYY‑MM‑DD): …
- **Owner**: …

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

> kebab-case name of the functionality, with prefix such as 'ng-' (which stands for Angular), if it's a technology-specific fun.

{name}

### Functionality Classification

Choose **exactly one** type.

- **Hybrid** – Uses `map`, `data-access`, `ui`, and `feature` libs
- **Abstract** – Uses `map` and `data-access` libs only
- **Visual** – Uses `ui` and `feature` libs only

**Selected type**: …

### Rationale

> Explain _why_ this classification applies (data fetching, UI presentation, reuse of existing APIs, etc.).

…

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## 🔗Existing Dependencies & Reuse

> List the libs that are already available in the workspace and will be reused in this functionality. Mention the libs' name (i.e., the one which is mentioned in `project.json` file of the lib).
> You can also specify more detailed info to specify what class and what method of the lib is used.  
> e.g., "`shared-util-ng-services` lib → `V1FormatterService` class → `formatNumFractionDigits` (format numbers for a lang), `getUnitCost` (get currency symbol) methods.".
>
> Reuse decisions are based on developer knowledge of the workspace.

> Tip! Recommended libs to be mentioned in this section, but are NOT already available in the workspace, MUST be flagged with `[RECOMMENDED]` keyword to emphasize that by the time that the TFS is approved, the lib was not still created.

### Used map / data-access libs

- 'map' libs:
  - `shared-map-ng-config` lib → `V2Config_MapDep` interface: Access to DEP config (which holds Base URL, Client ID, etc.) interface.
  - …

- 'data-access' libs:
  - `shared-data-access-ng-config` lib → `V2ConfigFacade` class → `configState$` observable: Access to DEP config (which holds Base URL, Client ID, etc.) loaded data.
  - `shared-data-access-ng-auth` lib → `V1AuthFacade` class → `authState$` observable: Access authentication state (which holds user's ID, token ID, etc.).
  - …

### Used ui / feature libs

- 'ui' libs:
  - [RECOMMENDED] `shared-ui-ng-modal` lib.
  - …

- 'feature' libs:
  - …

### Used util libs

> Functionalities **must not create their own 'util' libs**. Instead they reuse existing 'util' libs. And if something should be built that is NOT already existed in a 'util' lib, then again the developer must mention that 'util' lib name here and build it later.

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
  - …

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

`{scope}-map-{name}`

#### Exported Class

```ts
export class V1Name extends V1BaseMap {}
```

#### Methods (API Endpoints)

> Note!
>
> - One method = one type of data to be returned (in most cases an API endpoint is called, but the data can also come from a SQLite or Local Storage)
> - Interface **names matter**, structures are defined later

| Method                                              | Returns                      | Description             |
| --------------------------------------------------- | ---------------------------- | ----------------------- |
| `getInfo(url: string, userId: number, lib = 'any')` | `Observable<V1Name_MapInfo>` | Get user's generic info |

&nbsp;

For **each method**, specify:

> If data is coming from other resources (e.g., SQLite) and there's no API endpoint to call, **include only** 'Authentication', 'Sample Response', and 'Error Handling' sections.

&nbsp;

#### Method: `getInfo`

- **HTTP Method**: `GET`

- **Endpoint**: `{url}/info?user_id={userId}`

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
  "id": 1,
  "name": "Leanne Graham",
  "preview": "Sincere@april.biz"
}
```

- **Error Handling**

  When fetching data, errors may happen, and 'map' lib can log them. Here, we mention the errors that should be exceptions (not get logged):
  - `ERROR_CODE_SOMETHING`

&nbsp;

#### Method: `postSomething`

_(Repeat the same structure for each method)_

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

---

### 💾'data-access' Library Specification

#### Lib Name

`{scope}-data-access-{name}`

#### Exported Facade Class

```ts
export class V1NameFacade extends V1BaseFacade {}
```

#### 'State object structure' type

Based on how this 'data-access' lib is going to be used, its 'state object structure' can be different. In general, there are 3 'state object structure' types:

- _'single-instance'_ — It is suitable for storing one single data at the same time.  
  **Example:** You call a single API endpoint to fetch a response, so you would use a 'single-instance' state object to just simply store the response in the state object. If you call the API endpoint again, the response will replace the previous fetched data.  
  **Useful for:** The time that the lib is initialized by one single 'feature' lib, or multiple 'feature' libs, but NOT at the same time (i.e., not nin the same page).
- _'multi-instance'_ — It is suitable for storing multiple variation of data at the same time.  
  **Example:** You call a single API endpoint with different URL query parameters to fetch different responses, so you would use a 'multi-instance' state object to store each response in a separate instance of the same state object.  
  **Useful for:** The time that the lib is initialized by multiple 'feature' libs at the same time (i.e., in the same page).
- _'entity'_ — It is suitable for CRUD operations.  
  **Example:** You have 'users-all', 'users-edit', 'users-new', 'users-one' pages, and initialize 4 different exported components from a 'feature' lib in each page. And you have 4 different API endpoints to do CRUD operation, so you would use a 'entity' state object to update the stored entities properly.  
  **Useful for:** The time that the lib is initialized by a 'feature' lib that is suppose to do a CRUD operation.

**Selected type**: …

#### Public Methods

Facade methods, call their related actions (from the lib's Actions file) to update the state object.  
Some actions only need to update the state object in the Reducer file. We reference them as the ones that DO NOT have 'async behaviour'.  
On the other hand, some actions not only update the state object in the Reducer file, but also need to take care of some side effects in the Effect file. We reference them as the ones that DO have 'async behaviour'.

All actions (and accordingly the facade's methods) are considered to NOT have 'async behaviour', unless the following tasks should be done, when the action (facade's method) is called:

- Call 'map' lib's related method.
- Mutate Local Storage, cookies, or some data in SQLite.

| Method                                                        | async behaviour | Description                                            |
| ------------------------------------------------------------- | --------------- | ------------------------------------------------------ |
| `getInfo(url: string, userId: number, id = 'g', lib = 'any')` | Yes             | Call 'map' lib's related method: To get info of a user |
| `reset(id: string)`                                           | No              | Clears one instance object to its initial state        |
| `resetAll()`                                                  | No              | Clears the whole state object to its initial state     |

#### Public Observables

| Observable               | Type                                  | Description                    |
| ------------------------ | ------------------------------------- | ------------------------------ |
| `state$`                 | `Observable<reducer.V1Name_State>`    | The whole state object         |
| `allEntities$`           | `Observable<reducer.V1Name_Entity[]>` | Entities array                 |
| `entity$(id = 'g')`      | `Observable<reducer.V1Name_Entity>`   | One entity                     |
| `entityDatas$(id = 'g')` | `Observable<reducer.V1Name_Datas>`    | `datas` property of one entity |

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

---

### 🖼️'ui' Library Specification

#### Lib Name

`{scope}-ui-{name}`

#### Exported Components

> A 'ui' lib may export **multiple components** according to PRD 'User Experience & Flows' section.  
> In general, multi-view functionalities MUST export more than 1 components, but single-view ones should export only 1 component.
>
> **What's a multi-view functionality?** If the functionality requires more than 1 view/screen/page to display its content... Then such functionality should be considered as a multi-view one! For building the 'ui' lib of such functionalities, it's better to have 1 component for each view/screen/page, instead of implementing everything in one single component that needs to change its `dataType` input based on other inputs to switch between views/screens/pages.
>
> **What's a single-view functionality?** If the functionality doesn't need to navigate/switch between different contents, then it's a single-view functionality. When building the 'ui' lib of such functionalities, the `dataType` input NEVER changes, and it won't be a required input, but it is an optional one with a predefined value. e.g., if the functionality is going to show a list payments, then `dataType = all`; but if it's going to show one user's info, then `dataType = one`.
>
> **How to decide whether the functionality is multi-view or single-view?** It's up to the developer to choose how they want to organize their UI, lib's content, and components. This decision affects how other libs (e.g., the 'feature' lib that is going to initialize this 'ui' lib) interact with this lib.

> **Note!** Component's input/output/property/method descriptions will be used as part of their JSDoc description.

&nbsp;

##### Component: `V1Name1Component`

```ts
@Component(...)
export class V1Name1Component extends V1BaseUiComponent implements V1BaseUi_HasIt {}
```

###### Responsibility

…

###### Inputs

Here's the list of inputs that are **common for all** 'ui' components:

- `state` — Defines what elements should be shown in general, based on the value of the component's inputs. Accepted values: `"loading" | "empty" | "data" | "success" | "failure"`.
- `dataType` — Defines what type of data should be shown, when `state = data`. Accepted values: `"all" | "one" | "new" | "edit"`.

Here's the list of **this** component's inputs:

**Required**

- `data: InputSignal<V1Name_MapInfo[]>` — …
- …

**Optional**

- `state: InputSignal<V1BaseUi_State>`. Default: `'loading'`.
- `dataType: InputSignal<V1BaseUi_DataType>`. Default: `'all'`.
- `iconInfo: InputSignal<string>`. Default: `'./assets/images/libs/shared/icon-info.svg'` — …
- `showBtnReadMore: InputSignal<boolean>`. Default: `true` — …
- …

###### Outputs

Here's the list of **this** component's outputs:

- `clickedDetails: OutputEmitterRef<void>` — …
- …

###### Externally Read Properties

- `isUpdateNeeded: boolean` — …
- …

###### Externally Callable Methods

| Method    | Returns | Description                                          |
| --------- | ------- | ---------------------------------------------------- |
| `reset()` | `void`  | Resets all inputs/properties to their default values |

###### Rendering Rules

Define what should be rendered in HTML template based on `state` and `dataType`.

> Complementing PRD 'User Experience & Flows'.

- `state = loading` (whatever `dataType`):
  - `section[data-cy="lib-name-v1_component-name_loading"]` — Loader / skeleton only

- `state = empty`:
  - Heading
  - `section[data-cy="lib-name-v1_component-name_empty"]` — Holds the whole empty section

- `state = data`:
  - `dataType = all`:
    - Heading
    - `[data-cy="lib-name-v1_component-name_data-list"]` — Data list section
    - `button[data-cy="lib-name-v1_component-name_data-btn-view-details"]` — Button to view details
  - `dataType = one`:
    - Heading
    - `[data-cy="lib-name-v1_component-name_data-item"]` — Data item section

###### Functional Requirements & Business Rule Breakdown (Technical & Frontend Perspective)

> 'Functional Requirements' (e.g., NAME-FR-01) is complementing PRD 'Functional Requirements'. Typically map to **unit tests `describe()` blocks**.  
> 'Business Rule Breakdown' (e.g., NAME-BR-01) is complementing PRD 'Business Rule Breakdown'. Each item should map to **unit tests `it`**.
>
> Based on this component's responsibility, read PRD and do the following:
>
> 1. Pick the most related 'Functional Requirement' & 'Business Rule' for this component.
> 2. Put the picked 'Business Rule' items under the most related picked 'Functional Requirement' items.
> 3. Re-phrase 'Functional Requirement' & 'Business Rule' items to reflect to the correct rendered UI elements, inputs, outputs, and methods.

- **NAME-FR-01**: Test 'state'; Based on defined inputs.
  - **NAME-BR-01**: Given none/some required inputs _(Arrange)_; Then `state = loading` _(Negative & boundary)_.
  - **NAME-BR-02**: Given ALL required inputs _(Arrange)_; When `data = []` _(Act)_; Then `state = empty` _(Assert)_.
  - **NAME-BR-03**: Given ALL required inputs _(Arrange)_; When `data != []` _(Act)_; Then `state = data` _(Assert)_.
- **NAME-FR-02**: Test rendered elements; Based on 'state'.
  - **NAME-BR-04**: Given `state = loading` _(Arrange)_; Then `[data-cy="lib-name-v1_component-name_loading"]` must be displayed _(Act + Assert)_.
  - **NAME-BR-05**: Given `state = empty` _(Arrange)_; Then `[data-cy="lib-name-v1_component-name_empty"]` must be displayed _(Act + Assert)_.
  - **NAME-BR-06**: Given `state = data` & `dataType = all` _(Arrange)_; Then `[data-cy="lib-name-v1_component-name_data-list"]` must be displayed _(Act + Assert)_.
- **NAME-FR-03**: Test output emits; Based on interactions.
  - **NAME-BR-07**: Given `state = data` & `dataType = all` _(Arrange)_; When `button[data-cy="lib-name-v1_component-name_data-btn-view-details"]` is clicked _(Act)_; Then `clickedDetails` must be emitted _(Assert)_.

###### Analytics & Tracking

> These help in defining Analytics logs (e.g., Firebase Analytics).
>
> **Tip!** Components can simply have a `log` method to prepare logging to different analytic services, which can be implemented later.

- Events to be tracked:
  - When user clicks `button[data-cy="lib-name-v1_component-name_data-btn-view-details"]`; log `{name: 'clicked_viewDetails', params: {com: 'V1Name1Component'}}`
  - …

###### Error Handling & Edge Cases

In 'ui' components, we mention the edge case scenarios which lead to showing an empty state or a message in the UI:

- When `showBtnReadMore = false`; then `[data-cy="lib-name-v1_component-name_data-btn-placeholder"]` is shown.

&nbsp;

##### Component: `V1Name2Component`

_(Repeat the same structure for each component)_

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

---

### 🧩'feature' Library Specification

#### Lib Name

`{scope}-feature-{name}`

#### Exported Components

> A 'feature' lib may export **multiple components** according to the exported components of the 'ui' lib.  
> If the 'ui' exports more than 1 component, then the 'feature' lib will also export the same number of components and initialize the corresponding 'ui' component in each of those components.
>
> **How to decide whether the 'feature' lib should export more than 1 component?** It's up to the developer to choose how they want to initialize and interact with the 'ui' components in their 'feature' lib. This decision affects how other libs (e.g., the 'page' lib that is going to initialize this 'feature' lib) interact with this lib.

> **Note!** Component's input/output/property/method descriptions will be used as part of their JSDoc description.

&nbsp;

##### Component: `V1Name1FeaComponent`

```ts
@Component(...)
export class V1Name1FeaComponent extends V1BaseFeatureExtComponent implements V2BaseFeature_ExtHasIt {}
```

###### Responsibility

…

###### Inputs

Here's the list of inputs that are **common for all** 'feature' components:

- `showErrors` — Defines whether probable errors should be shown or not.

Here's the list of **this** component's inputs:

**Required**

- `userId: InputSignal<number>` — …
- …

**Optional**

- `showErrors: InputSignal<boolean>`. Default: `true`.
- `showBtnReadMore: InputSignal<boolean>`. Default: `true` — …
- …

###### Outputs

Here's the list of outputs that are **common for all** 'feature' components:

- `ready` — Emits only one time! When `_xInitOrUpdateAfterAllDataReady` is already called for the very first time.
- `allDataIsReady` — Emits each time (when an inputs is changed)! When `_xInitOrUpdateAfterAllDataReady` is already called.
- `hasError` — Emits when an error occurs while fetching data from a 'data-access' lib.

Here's the list of **this** component's outputs:

- `ready: OutputEmitterRef<void>`.
- `allDataIsReady: OutputEmitterRef<void>`.
- `hasError: OutputEmitterRef<{ key: string; value: string; }>`.
- `clickedDetails: OutputEmitterRef<void>` — …
- …

###### Externally Read Properties

- `isUpdateNeeded: boolean` — …
- …

###### Externally Callable Methods

| Method    | Returns | Description                                          |
| --------- | ------- | ---------------------------------------------------- |
| `reset()` | `void`  | Resets all inputs/properties to their default values |

###### Functional Requirements & Business Rule Breakdown (Technical & Frontend Perspective)

> 'Functional Requirements' (e.g., NAME-FR-01) is complementing PRD 'Functional Requirements'. Typically map to **unit tests `describe()` blocks**.  
> 'Business Rule Breakdown' (e.g., NAME-BR-01) is complementing PRD 'Business Rule Breakdown'. Each item should map to **unit tests `it`**.
>
> Based on this component's responsibility, read PRD and do the following:
>
> 1. Pick the most related 'Functional Requirement' & 'Business Rule' for this component.
> 2. Put the picked 'Business Rule' items under the most related picked 'Functional Requirement' items.
> 3. Re-phrase 'Functional Requirement' & 'Business Rule' items to reflect to the correct rendered UI elements, inputs, outputs, and methods.

- **NAME-FR-01**: Test facade method calls; Based on defined inputs.
  - **NAME-BR-03**: Given ALL required inputs _(Arrange)_; Then `V1NameFacade` facade's `getInfo` method must be called _(Act + Assert)_.
- **NAME-FR-03**: Test facade method calls; Based on interactions.
  - **NAME-BR-07**: Given ALL required inputs _(Arrange)_; When `V1Name1Component` emits `clickedDetails` _(Act)_; Then `V1NameFacade` facade's `getInfo` method must be called _(Assert)_.

###### Analytics & Tracking

> These help in defining Analytics logs (e.g., Firebase Analytics).
>
> **Tip!** Components can simply have a `log` method to prepare logging to different analytic services, which can be implemented later.

- Events to be tracked:
  - When `reset` method is called (externally/internally); log `{name: 'called_reset', params: {com: 'V1Name1FeaComponent'}}`
- Success / failure signals:
  - `_xInitOrUpdateAfterAllDataReady` is called (handled), i.e., facade method(s) API call(s) succeeds; log `{name: 'handled_xInitOrUpdateAfterAllDataReady', params: {com: 'V1Name1FeaComponent'}}`
  - …

###### Error Handling & Edge Cases

In 'feature' components, `hasError` output will be emitted, whenever an error is detected in the state object of the initialized 'data-access' libs (in `_xFacadesAddErrorListeners`). So API calls error handling will happen by default. Here, we mention the state object errors that should be exceptions (not get emitted), and the edge case scenarios which lead to showing an empty state or a message in the UI.

- Consider the following as error exceptions:
  - When listening to `V1NameFacade.entity$(id = 'V1NameFeaComponent_main')`; if `state.errors.info = 'ERROR_CODE_SOMETHING'`.
- Consider the following as edge cases:
  - When `showBtnReadMore = false`; then `[data-cy="lib-name-v1_component-name_data-btn-placeholder"]` is shown.

&nbsp;

##### Component: `V1Name2FeaComponent`

_(Repeat the same structure for each component)_

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

> Complementing PRD 'User Experience & Flows'. Describes **how each 'feature' component executes technically**.

> **Tip!** 'feature' components NEVER navigate (change page)! So if in 'User Experience & Flows' section of PRD, it is mentioned that the user should be navigated to another page (based on a response of an API call, config, user action, etc.), then it means that the 'feature' component should emit an output, and that's it! It's actually the 'page' lib's responsibility (which initializes the 'feature' component) to navigate to another page.

&nbsp;

### Component: `V1Name1FeaComponent`

> Based on:
>
> - "_Existing Dependencies & Reuse_" section.
> - This 'feature' component specifications.
> - This 'feature' component's corresponding 'ui' component specifications.
> - 'map' & 'data-access' libs specifications (if the functionality is classified as a 'hybrid' one).
> - PRD 'User Experience & Flows'.
>
> Do the following:
>
> 1. Pick the most related 'User Experience & Flows'.
> 1. Fill out the 'Primary flow' section below, according to what is asked in the picked 'User Experience & Flows' items.

#### Primary flow

1. 'feature' component: It triggers (navigation, input, lifecycle) — lifecycle:
   - Whenever ALL required inputs of 'feature' lib are defined for the **very first time**, `_xInit` is called.
   - Whenever an input of 'feature' lib is updated, `_xUpdate` is called.

2. 'feature' component: It prepares multi-instance 'data-access' facade by creating new state object instances (in `_xInitPreBeforeDom`) — The following method(s) will be called:
   - `V1NameFacade` → `createIfNotExists('V1Name1FeaComponent_main')`
   - …

3. 'feature' component: It (in `_xDataFetch`) calls 'data-access' facade method(s) — The following method(s) will be called (**First time in this step? Then ONLY call independent data request(s)**):
   - `V1NameFacade` → `getInfo(this._baseUrl, this._userId, 'V1Name1FeaComponent_main', 'V1Name1FeaComponent')`  
     Dependent data request(s):
     - `V1Something1Facade` → `getSomething1(this._baseUrl, alreadyFetchedData.blahblah, 'V1Name1FeaComponent')`  
       Dependent data request(s):
       - `V1Something2Facade` → `getSomething2(this._baseUrl, alreadyFetchedData.blahblah, 'V1Name1FeaComponent')`
   - `V1SomethingFacade` → `getSomething(this._baseUrl, 'V1Name1FeaComponent')`
   - `V1SomethingElseFacade` → `getSomethingElse(this._baseUrl, 'V1Name1FeaComponent')`
   - …

4. 'feature' component: It is already listening (waiting) for 'data-access' object state changes (in `_xFacadesPre`) — Listening to the following observable(s):
   - `V1NameFacade` → `entityLoadeds$('V1Name1FeaComponent_main')`
   - `V1Something1Facade` → `loadeds$`
   - `V1Something2Facade` → `loadeds$`
   - `V1SomethingFacade` → `loadeds$`
   - …

5. 'data-access' facade: Its method(s) invoke 'map' method(s) to call API (in their Effect file) — The following method(s) will be called:  
   **Note!** The following method(s) will be called **ONLY if their corresponding facade method(s) were called in step 3**:
   - `V1Name` → `getInfo`
   - `V1Something1` → `getSomething1`
   - `V1Something2` → `getSomething2`
   - `V1Something` → `getSomething`
   - …

6. 'data-access' effect(s): It is listening (waiting) for 'map' observable(s).
7. 'map' class: Its method(s) calls API and wait for response/error.
8. 'map' class: As soon as API response/error is ready, 'map' invokes 'data-access' effect(s), which leads to state object change that 'feature' is listening to.
9. 'feature' component: **If API response was successful, `_xInitOrUpdateAfterAllDataReady` is called and we continue the flow**, otherwise `_xFacadesAddErrorListeners` is called and the flow stops.
10. 'feature' component: By now, SOME data is already fetched successfully. Now, if some more data are required to be fetched, which were dependant to the already fetched data, then right from `_xInitOrUpdateAfterAllDataReady`, we start 3-9 steps again (BEFORE we continue the flow).  
    **Note!** In step 3, this time, we **ONLY call dependent data request(s)**. This loop continues until no more dependent data requests are needed.
11. 'feature' component: By now, ALL data is already fetched successfully. Now, we update the corresponding 'ui' component's inputs based on state object changes — The following input(s) will be updated:
    - If `V1NameFacade` → `entityDatas$('V1Name1FeaComponent_main')?.info` state object property is changed, `data` input is updated.
    - If `V1Something` → `datas$?.something` state object property is changed, … input is updated.
    - If … → … state object property is changed, … input is updated.
    - If … → … observable is changed, … input is updated.

12. Whenever ALL required inputs of 'ui' lib are defined, its `state` is changed from 'loading' to something else:
    - If … input is defined and equal to …, `state` is …, and `dataType` is ….
    - …

13. By now, data fetching is done, and UI's state is defined based on it, so user can do the following:
    - In 'ui' component, if `state = data` & `dataType = one`:
      - `button[data-cy="lib-name-v1_component-name_data-btn-view-details"]` is clicked: Emits `clickedViewDetails: OutputEmitterRef<void>`.
      - `[data-cy="lib-name-v1_component-name_data-msg-warning"]` is shown.
      - …

#### Flow when `button[data-cy="lib-name-v1_component-name_data-btn-view-details"]` is clicked (user interaction)

Side effect of this output (button click) is 'routing' but it will happen **outside of the functionality**.  
How? 'feature' lib is listening to this output, and emits the same output, and eventually the page that initialized the 'feature' lib is listening to the output and in its handler, takes care of the routing.

#### Flow when `[data-cy="lib-name-v1_component-name_data-msg-warning"]` is shown (logic decision)

We show the data, but also show `[data-cy="lib-name-v1_component-name_data-btn-read-more"]` to click and be navigated to an external site to read more about the shown message.

#### Flow when …

_(Repeat the same structure for each non-primary flow)_

&nbsp;

### Component: `V1Name2FeaComponent`

_(Repeat the same structure for each 'feature' component)_

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## ❓Open Technical Questions

- …
- …
