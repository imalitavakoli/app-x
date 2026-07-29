<!--
Template for `docs/x/{name}/TFS/ui.md` — the `ui` lib spec + its FR/BR.
Include this file only for visual functionalities (visual / visual+ / mixed / mixed+).
Lib name: `{domain}-ui-ng-{name}`. Remove `>` helpers from the final draft.
Repeat the `##### Component: …` block per exported component. Register every FR/BR ID in the README's 🧭 ID Index.
-->

### 🖼️ 'ui' Library Specification

> `ui` components are presentational, extend `V1BaseUiComponent`, and are driven by their parent `feature` via `state`/`dataType`.

#### Lib Name

`{domain}-ui-ng-{name}`

#### Exported Components

> How many components this lib exposes globally follows the PRD's User Experience & Flows:
>
> - **Multi-view** functionality (needs more than one view/screen/page) → export **more than one** component, one per view (not one component that switches views via `dataType`).
> - **Single-view** functionality (no switching between contents) → export **one** component; its `dataType` is optional with a fixed default that never changes (e.g. a list → `'all'`; one entity → `'one'`).
>
> The developer chooses multi- vs single-view; suggest the better fit. Each globally-exposed component lives in its own folder under the version folder.

##### Component: `V1{Name}Component`

```ts
@Component(...)
export class V1{Name}Component extends V1BaseUiComponent implements V1BaseUi_HasIt {}
```

###### Responsibility

> One paragraph: what it renders and which `state`/`dataType` values it handles.

###### Inputs

> Common (all `ui`): `state` (`loading|empty|data|success|failure`), `dataType` (`all|one|new|edit`).
>
> Then this component's inputs. **Each input's description IS its JSDoc.** Mark Required/Optional; give signal types (`InputSignal<…>` / `ModelSignal<…>`) and defaults. **Asset inputs** (a custom icon/image) are ordinary inputs with a **default path**, e.g. `icoInfo = input('./assets/images/libs/{domain}/{name}_ico-info.svg')` — the parent `feature` overrides them from DEP config.

###### Outputs

> Each output (`OutputEmitterRef<…>`). **Each description IS its JSDoc.** Outputs are emitted via **handler methods** in the component (not directly in the template), so unit tests can call the handler to assert the emit.

###### Rendering Rules

> What renders per `state` (and `dataType`), using exact `[data-cy="{lib}-v1_{component}_{part}"]` selectors. Reference the **translation keys** used for any heading/paragraph/label text, e.g. _"All" (via `{name}.all_h3`)_ or _"Hello No.123" (via `{name}.greeting_p` with `userId`)_. Include conditional hides and popups.

###### DEP Styles (CSS variables)

> The CSS variables this component exposes for theming (apps override them via brand/DEP config). Use `naming-conventions.md#styling`: `--e-{class}--{rule}` or `--e-{class}--{rule}--{light,dark}`, on the `e-{short-lib-name}` class. Defaults may reference the base `ui` lib's root CSS variables (e.g. `--e-primary-color`, `--e-night-color`, `--e-day-lighter-color`; all rgb triplets like `162 170 185`).
>
> Example:
>
> ```scss
> .e-{name} {
>   --e-{name}--bg-color: var(--e-day-lighter-color);
>   --e-{name}--color: var(--e-night-color);
> }
> ```

###### Functional Requirements & Business Rule Breakdown

> `describe`↔FR, `it`↔BR. Cover this component's **presentation and interaction** behaviour (everything except data fetching, which the `feature` owns). Derive the FR/BR from the PRD's ACs and this TFS's design; write `Given/When/Then` with exact `[data-cy]`/inputs/emitters; back-link each PRD AC it implements; add NEW unique IDs for technical scenarios (loading/error/visibility) not in the PRD. IDs scoped to the component (`{NAME}_{COMPONENT}_…`) and unique across the TFS folder.

###### Error Handling & Edge Cases

> Edge cases that lead to empty/message states in this component.

#### Helper Services

> Optional — only if this lib needs internal helpers. Each is an **Angular service** in `_util/{name}.service.ts` (prefer a service over a plain util class). Give Responsibility, Public API, and its own FR/BR IDs (`{NAME}_{HELPER-NAME}_FR-01` / `{NAME}_{HELPER-NAME}_BR-01` — same format as components).
