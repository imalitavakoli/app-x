# Workspace domain language

The authoritative glossary for this workspace's own vocabulary. One term per concept; alternatives we do **not** use are listed under `_Avoid_`.

**This file defines what a term _is_ — never how the system behaves.** Where a term has consequences (which libs a functionality may own, which registry a lib type gets, how a version migrates), the linked doc owns that. Skills and docs cite a term here instead of redefining it.

- **Adding or changing a term:** [docs/agents/context-md-format.md](docs/agents/context-md-format.md). This file carries **no `Last Verified`** — it is not verified against code; it is updated when a term changes.
- **Deep references:** [library types & their relationship](docs/getting-started/library-types-and-their-relationship.md) · [naming conventions](docs/guidelines/naming-conventions.md) · [folder structure](docs/introduction/folder-structure.md)

&nbsp;

## Workspace markers

**`x` marker**:
Marks something this workspace itself owns and provides, as opposed to third-party, plugin, or framework — `docs/x/` (our functionality docs), `x-*` skills (ours, not plugin or `nx-*`), and the `_x…` prefix on base-class members. **In a lib or app _name_ it additionally means Sample or Boilerplate** (below) — so the same letter reads two ways depending on where it sits.
_Avoid_: `custom-`, `internal-`, `our-`

&nbsp;

## Roles

**Workspace Specialist**:
The person accountable for the workspace itself rather than for any one feature — its docs, its agent configuration (`AGENTS.md`, `CONTEXT.md`, skills and agents), its Sample libs and Boilerplate apps, its base libs, and its workspace-wide files such as `package.json`. Anything else carrying workspace-wide risk is theirs too, or is decided with them.
_Avoid_: Maintainer, Architect, Tech lead, Owner

**Code Owner**:
A person or team listed in `CODEOWNERS` as the expert for one path of the repo — distinct from the Workspace Specialist, who is accountable for the whole.
_Avoid_: Reviewer, Maintainer, Owner (unqualified)

&nbsp;

## Libs & ownership

**Lib type**:
One of the eight kinds a library can be — `api`, `util`, `map`, `data-access`, `ui`, `feature`, `page`, `app` — which decides what it may import and what it may own.
_Avoid_: Layer, Category, Library kind

**Functionality**:
One product feature, owned by one or more libs that all share its name, and documented by its own `docs/x/{domain}/{name}/` specs. The unit our ACs, FRs and BRs belong to.
_Avoid_: Feature (when the documented unit is meant), Module, Domain

**Functionality name**:
The kebab string that names a functionality, its `docs/x/{domain}/{name}/` folder, and every lib it owns — e.g. `ng-chart`. It carries the technology prefix of the stack the functionality belongs to. Templates write it as `{name}`.
_Avoid_: Short name, Bare name, Feature name

**Lib name**:
A library's full Nx project name, `{scope}-{libtype}-{functionality-name}` — e.g. `shared-feature-ng-chart`. Never renamed after a consumer.
_Avoid_: Lib id, Package name

**Single-purpose lib**:
A lib holding **one** product concern, versioned as a whole (`src/lib/v1/`). A single-purpose `ui` or `feature` lib is a functionality.
_Avoid_: Cohesive lib, Focused lib

**Grab-bag lib**:
A lib holding several **unrelated** items that share only a technical kind (directives, pipes, animations), each versioned on its own (`src/lib/toggle-me-v1/`). Never a functionality.
_Avoid_: Bucket lib, Misc lib, Utility lib, Kitchen-sink lib

**Shared lib**:
A lib under `libs/shared/` usable by any app, and therefore versioned.
_Avoid_: Common lib, Global lib

**App-domain lib**:
A lib under `libs/{app-name}/`, belonging to one app, and therefore unversioned.
_Avoid_: Local lib, App-specific lib, Private lib

**Domain**:
The horizontal ownership slice a lib or a functionality belongs to — `shared`, or exactly one app's name. The same string as the Nx `domain:` tag.
_Avoid_: Scope (unqualified), Tenant

**Sample lib**:
A lib whose name carries the `x` marker (`ng-x-profile-info`, `ng-x-users`) — a complete reference functionality kept as inspiration. Consumers copy it to start their own work; modifying it in place is the **Workspace Specialist's** call.
_Avoid_: Demo lib, Example lib, Playground lib, Test lib

**Boilerplate app**:
An app whose name carries the `x` marker (`ng-x-boilerplate-web`) — a working app kept as a starting point. Consumers copy it; modifying it in place is the **Workspace Specialist's** call.
_Avoid_: Template app, Starter app, Scaffold app, Demo app

**Base lib**:
A shared lib providing the classes, interfaces and root styles other libs build on — the per-lib-type base classes a component extends, their models, and the workspace's base CSS. Maintained by the Workspace Specialist.
_Avoid_: Core lib, Foundation lib, Abstract lib (that word names a functionality type)

**Natural entry lib**:
The one lib a consumer imports to use a functionality, decided by its functionality type.
_Avoid_: Entry point, Public lib, Main lib

**Companion work**:
A lib outside this cycle's functionality that the cycle must create or update for it to work — a `util`/`api`/`app`, a grab-bag, or another functionality's lib.
_Avoid_: Dependency work, Side work, Prerequisite lib

&nbsp;

## Functionality types

**Abstract**:
A functionality with no UI — it exposes data. Owns `data-access`.
_Avoid_: Headless, Data-only, Logic functionality

**Visual** / **Visual+**:
A functionality that renders but owns no `data-access`. `visual+` also owns a `page`.
_Avoid_: Presentational, Dumb functionality

**Mixed** / **Mixed+**:
A functionality that both renders and owns `data-access`. `mixed+` also owns a `page`.
_Avoid_: Full-stack functionality, Smart functionality

&nbsp;

## Requirements & IDs

**PRD — Product Requirements Document**:
A functionality's product spec, living in `docs/x/{domain}/{name}/PRD/`. Holds the Acceptance Criteria.
_Avoid_: Product Requirement Document, product spec (as the document name)

**TSD — Technical Specification Document**:
A functionality's technical spec, living in `docs/x/{domain}/{name}/TSD/`. Holds each owned lib's Functional Requirements and Business Rules.
_Avoid_: TFS, Technical Feature Spec, tech spec (as the document name)

**AC — Acceptance Criterion**:
One observable, product-level outcome of a functionality, living in its `PRD/README.md`. The unit an e2e `it` cites.
_Avoid_: Requirement (unqualified), Criteria, Scenario

**FR — Functional Requirement**:
One capability of one lib, living in its TSD lib file. The unit a unit-test `describe` cites.
_Avoid_: Feature requirement, Spec item

**BR — Business Rule**:
One observable behaviour of one lib, written `Given / When / Then`. The unit a unit-test `it` cites.
_Avoid_: Rule (unqualified), Test case, Assertion

**US — User Story**:
A story grouping the ACs a user pursues in one journey, living in an e2e app's `user-stories/README.md`. May span functionalities. The unit an e2e `describe` cites.
_Avoid_: Epic, Journey, Flow

**ID registry**:
A folder that holds requirement IDs and nothing else — `README.md` for live entries, `DECISIONS.md` for burned ones. Every `PRD/`, `TSD/`, `user-stories/` and `requirements/` is one. Bare "registry" always means this.
_Avoid_: Spec folder, Requirements doc, Index

**Live** (of an entry):
Present in a registry's `README.md`; the only entries a test may cite.
_Avoid_: Active, Current, Open

**Burned** (of an ID):
Recorded in a registry's `DECISIONS.md` and never reusable, so the number always resolves to one thing.
_Avoid_: Deprecated, Deleted, Archived, Reserved

**Last Verified**:
The date a doc was last checked against shipped code — stamped even when nothing changed. Older than the code's last commit means unverified, not wrong.
_Avoid_: Last updated, Reviewed on, Last checked

&nbsp;

## Lifecycle outcomes

Every requirement resolves to exactly one of these when a doc is verified against what shipped.

**Added**:
A requirement the docs did not have; a fresh ID is minted.
_Avoid_: New, Created

**Amended**:
The same outcome, described wrongly — corrected **under its existing ID**.
_Avoid_: Updated, Edited, Revised, Fixed

**Retired**:
The behaviour no longer exists — the entry moves to `DECISIONS.md` and its number burns.
_Avoid_: Removed, Deleted, Deprecated, Dropped

**Merged** (User Stories only):
A story absorbed by another; its ID burns and points at the successor.
_Avoid_: Combined, Folded, Consolidated

**Unchanged**:
The docs already match what shipped. A real outcome to record, not an absence of one.
_Avoid_: No-op, Skipped, N/A

&nbsp;

## Reuse

**Reuse boundary**:
The line between a lib we own and a lib we consume. Requirements follow the lib that owns the behaviour, never the lib that asked for it.
_Avoid_: Ownership line, Lib contract

**`[TO-CREATE]`**:
A reuse entry for a lib that does not exist yet. Exact spelling — it must stay greppable.
_Avoid_: `[NEW]`, `[MISSING]`, `[TBD]`

**`[TO-UPDATE]`**:
A reuse entry for a lib that exists but must gain something for us. Exact spelling.
_Avoid_: `[UPDATE REQUIRED]`, `[NEEDS CHANGE]`, `[MODIFY]`

&nbsp;

## App & styling conventions

**DEP config**:
Per-app runtime configuration a `feature` lib reads through the config `data-access` lib, rather than hardcoding.
_Avoid_: App config, Settings, Env config, Registry (that word is reserved for an ID registry)

**DEP assets**:
Per-app icon/image paths a `ui` lib receives as inputs, resolved from DEP config.
_Avoid_: Static assets, Images

**DEP styles**:
The CSS variables a `ui` lib exposes for an app to override — `--e-{class}--{rule}`.
_Avoid_: Theme variables, Custom properties, Overrides

**`data-cy`**:
The stable test-id attribute e2e and unit tests select on — `{lib}-v{n}_{component}_{part}`. Never a CSS class or visible text.
_Avoid_: Test id, Selector, `data-testid`

**`e-` class**:
The workspace CSS class prefix, `e-{short-lib-name}` — carrying **no** version segment even for a versioned lib.
_Avoid_: Versioned class (`e-popup-v2`), BEM block

&nbsp;

## Hooks

**Hook**:
Two senses, both in active use. A **🪝 workflow hook** is a point in the Superpowers lifecycle where this workspace attaches steps, carrying an ID like `A1` or `B1`. A **hook script** is an executable this workspace registers with an agent harness to run on a harness lifecycle event.
_Avoid_: lifecycle hook, Claude hook, agent hook

&nbsp;

## Skills

**Skill kind**:
Which of seven jobs one of our own `x-*` skills does — `writer`, `helper`, `scaffolder`, `editor`, `enricher`, `reviewer`, `runner` — each an agent noun, stated twice: as the last segment of the skill's name and as `kind:` in its `metadata`. A property of our skills only: skills also arrive from plugins and other sources, and those carry no kind. Distinct from a **Lib type**, which is what "kind" means of a library.
_Avoid_: Skill type, Skill category, Skill flavour, Skill role

&nbsp;

## Flagged ambiguities

Terms **in use but not settled** — recorded so a contested one is not silently coined twice. Unlike a PRD's or TSD's Open Questions, nothing here blocks: resolve one when the work makes the answer obvious, then move it into the body above. Format rules: [docs/agents/context-md-format.md](docs/agents/context-md-format.md).

**None currently.** The section stays so a contested term has a home the moment one appears.
