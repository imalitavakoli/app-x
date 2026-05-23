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

ng-x-profile-image

### Functionality Classification

Choose **exactly one** type.

- **Hybrid** – Uses `map`, `data-access`, `ui`, and `feature` libs
- **Abstract** – Uses `map` and `data-access` libs only
- **Visual** – Uses `ui` and `feature` libs only

**Selected type**: Visual

### Rationale

This functionality is classified as **Visual** because it involves only UI presentation.  
Regarding data fetching, it reuses some already built 'map' and 'data-access' libs.

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
  - `shared-map-ng-x-credit` lib: To fetch credit summary of a user.

- 'data-access' libs:
  - `shared-data-access-ng-config` lib → `V2ConfigFacade` class → `configState$` observable: Access to DEP config (which holds Base URL, Client ID, etc.) loaded data.
  - `shared-data-access-ng-auth` lib → `V1AuthFacade` class → `authState$` observable: Access authentication state (which holds user's ID, token ID, etc.).
  - `shared-data-access-ng-x-credit` lib: To store credit summary data of a user.

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

### 🖼️'ui' Library Specification

#### Lib Name

`shared-ui-ng-x-profile-image`

#### Exported Components

##### Component: `V1XProfileImageComponent`

```ts
@Component(...)
export class V1XProfileImageComponent extends V1BaseUiComponent implements V1BaseUi_HasIt {}
```

###### Responsibility

View the user's profile image and credit summary.

###### Inputs

Here's the list of inputs that are **common for all** 'ui' components:

- `state` — Defines what elements should be shown in general, based on the value of the component's inputs. Accepted values: `"loading" | "empty" | "data" | "success" | "failure"`.
- `dataType` — Defines what type of data should be shown, when `state = data`. Accepted values: `"all" | "one" | "new" | "edit"`.

Here's the list of **this** component's inputs:

**Required**

- `creditSummary: InputSignal<V1XCredit_MapSummary>` — User's credit summary data

**Optional**

- `state: InputSignal<V1BaseUi_State>`. Default: `'loading'`.
- `dataType: InputSignal<V1BaseUi_DataType>`. Default: `'one'`. **This NEVER changes**.
- `imgAvatar: InputSignal<string>`. Default: `'./assets/images/libs/x-profile-image/img-profile.jpg'` — The default user's profile image.

###### Outputs

Here's the list of **this** component's outputs:

_NONE_

###### Rendering Rules

Define what should be rendered in HTML template based on `state` and `dataType`.

- `state = loading`:
  - `section[data-cy="x-profile-image-v1_profile-image_loading"]` — Loader / skeleton only

- `state = data`:
  - `section[data-cy="x-profile-image-v1_profile-image_data"]` — Holds the whole data section
    - `figure > img` — Holds the profile image
    - `div` — Shows `status` property of `creditSummary`

###### Functional Requirements & Business Rule Breakdown (Technical & Frontend Perspective)

In test cases, you may need to verify whether an element renders the correct translation key. In such situations, you can mock `TranslocoService`, since the component may use `TranslocoDirective` or `TranslocoService` to apply translation keys to its elements. This applies when translation keys are specified in the '_Rendering Rules_' section of the component.

- **XPROFILEIMAGE-FR-01** _(maps to PRD FR-01)_: Test 'state'; Based on defined inputs.
  - **XPROFILEIMAGE-BR-01**: Given none/some required inputs _(Arrange)_; Then `state = loading` _(Negative & boundary)_.
  - **XPROFILEIMAGE-BR-02**: Given ALL required inputs _(Arrange)_; Then `state = data` _(Act + Assert)_.
- **XPROFILEIMAGE-FR-02** _(maps to PRD FR-02)_: Test rendered elements; Based on 'state'.
  - **XPROFILEIMAGE-BR-03**: Given `state = loading` _(Arrange)_; Then `[data-cy="x-profile-image-v1_profile-image_loading"]` must be displayed _(Act + Assert)_.
  - **XPROFILEIMAGE-BR-04**: Given `state = data` _(Arrange)_; Then `[data-cy="x-profile-image-v1_profile-image_data"]` must be displayed _(Act + Assert)_.

###### Analytics & Tracking

- Events to be tracked: _NONE_

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

`shared-feature-ng-x-profile-image`

#### Exported Components

##### Component: `V1XProfileImageFeaComponent`

```ts
@Component(...)
export class V1XProfileImageFeaComponent extends V1BaseFeatureExtComponent implements V2BaseFeature_ExtHasIt {}
```

###### Responsibility

Initialize and interact with the corresponding 'ui' component + showing any probable 'data-access' lib errors.

###### Inputs

Here's the list of inputs that are **common for all** 'feature' components:

- `showErrors` — Defines whether probable errors should be shown or not.

Here's the list of **this** component's inputs:

**Required**

- `userId: InputSignal<number>` — User's ID.

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

###### Functional Requirements & Business Rule Breakdown (Technical & Frontend Perspective)

- **XPROFILEIMAGE-FR-01** _(maps to PRD FR-01)_: Test facade method calls; Based on defined inputs.
  - **XPROFILEIMAGE-BR-02**: Given ALL required inputs _(Arrange)_; Then `V1XUsersFacade` facade's `getAll` method must be called _(Act + Assert)_.

###### Analytics & Tracking

- Events to be tracked: _NONE_
- Success / failure signals:
  - `_xInitOrUpdateAfterAllDataReady` is called (internally handled), i.e., facade method(s) API call(s) succeeds; log `{name: 'handled_xInitOrUpdateAfterAllDataReady', params: {com: 'V1XProfileImageFeaComponent'}}`

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

### Component: `V1XProfileImageFeaComponent`

**Note added by the developer!**  
The following properties exist in this component to help us not to repeat ourselves:

- `readonly nameThis: string = 'V1XProfileImageFeaComponent';` — Name of this component.
- `readonly nameInstance_main: string = 'V1XProfileImageFeaComponent_main';` — One of the IDs of the multi-instance 'data-access' libs (e.g., main, secondary, etc.) that will be initialized in this component.

#### Primary flow

1. 'feature' component: It triggers (navigation, input, lifecycle) — lifecycle:
   - Whenever ALL required inputs of 'feature' lib are defined for the **very first time**, `_xInit` is called.
   - Whenever an input of 'feature' lib is updated, `_xUpdate` is called.

2. 'feature' component: It prepares multi-instance 'data-access' facade by creating new state object instances (in `_xInitPreBeforeDom`) — The following method(s) will be called:
   - `V1XCreditFacade` → `createIfNotExists(this.nameInstance_main)`

3. 'feature' component: It (in `_xDataFetch`) calls 'data-access' facade method(s) — The following method(s) will be called (**First time in this step? Then ONLY call independent data request(s)**):
   - `V1XCreditFacade` → `getSummary(this._baseUrl, this.userId(), this.nameInstance_main, this.nameThis)`

4. 'feature' component: It is already listening (waiting) for 'data-access' object state changes (in `_xFacadesPre`) — Listening to the following observable(s):
   - `V1XCreditFacade` → `entityLoadeds$(this.nameInstance_main)`

5. 'data-access' facade: Its method(s) invoke 'map' method(s) to call API (in their Effect file) — The following method(s) will be called:  
   **Note!** The following method(s) will be called **ONLY if their corresponding facade method(s) were called in step 3**:
   - `V1XCredit` → `getSummary`

6. 'data-access' effect(s): It is listening (waiting) for 'map' observable(s).
7. 'map' class: Its method(s) calls API and wait for response/error.
8. 'map' class: As soon as API response/error is ready, 'map' invokes 'data-access' effect(s), which leads to state object change that 'feature' is listening to.
9. 'feature' component: **If API response was successful, `_xInitOrUpdateAfterAllDataReady` is called and we continue the flow**, otherwise `_xFacadesAddErrorListeners` is called and the flow stops.
10. _This step is skipped for this 'feature' component!_ 'feature' component: By now, SOME data is already fetched successfully. Now, if some more data are required to be fetched, which were dependant to the already fetched data, then right from `_xInitOrUpdateAfterAllDataReady`, we start 3-9 steps again (BEFORE we continue the flow).  
    **Note!** In step 3, this time, we **ONLY call dependent data request(s)**. This loop continues until no more dependent data requests are needed.
11. 'feature' component: By now, ALL data is already fetched successfully. Now, we update the corresponding 'ui' component's inputs based on state object changes — The following input(s) will be updated:
    - If `V1XCreditFacade` → `entityDatas$(nameInstance_main)?.summary` state object property is changed, `creditSummary` input is updated.

12. Whenever ALL required inputs of 'ui' lib are defined, its `state` is changed from 'loading' to something else:
    - If `creditSummary` input is defined, `state` is `data`.

13. By now, data fetching is done, and UI's state is defined based on it, so user can do the following: _NONE_ (because there's NO interactive element in this 'feature' component)

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## ❓Open Technical Questions

_NONE_
