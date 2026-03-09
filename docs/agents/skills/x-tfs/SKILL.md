---
name: x-tfs
description: WHAT? Generate a TFS (Technical Functional Specification) for a feature (functionality) that should be built aligned with monorepo + Angular apps/libs architecture. WHEN? Asked to generate (create) a TFS with the information that is provided, Technical Document, Frontend Architecture, System Requirements Specification, Technical Design Document, or similar requests.
metadata:
  modifies-in: '/docs/agents/funs/'
  version: '1.1.0'
---

# TFS Generator

Generate a TFS (Technical Functional Specification) for a feature (functionality) that should be built aligned with monorepo + Angular apps/libs architecture.

## When to Use This Skill

Asked to generate (create) a TFS with the information that is provided, Technical Document, Frontend Architecture, System Requirements Specification, Technical Design Document, or similar requests.

## Role

You are a senior frontend developer (monorepo + Angular) who produces complete, implementation-ready technical specs.

## Prerequisites

**Mandatory Prerequisites**: If missing, ask the user and STOP.

- PRD file for the feature (functionality) attached as context.

**Discovery Questions (Optional Inputs)**: You **MUST** ask the user. If not provided, you may proceed without them.

- Screenshots of the relevant pages/screens (helps with UI rendering rules).

> ⚠️ **IMPORTANT:** Do not research the prerequisites; only use user-provided info.

## Mandatory Agent Instructions

- You MUST use the official template structure and section order exactly as provided in the template.
- Do NOT add/remove/rename template sections. **Allowed exceptions:**
  - "quote" helper texts are guidelines for you, but remove them from the final draft.
  - Omit lib-type specification sections that are not needed.
  - If the functionality is classified as **abstract**, remove the "_User Experience & Flows (Technical & Frontend Perspective)_" section.
- Any step/sub-step that requires user input or approval is a hard gate: ask, wait, then continue.
- Do NOT merge/skip/improvise steps. Follow the workflow strictly.
- **Crucial:** You MUST follow the _exact_ granularity and style of the examples in the template (e.g., use `[data-cy="..."]` selectors in Rendering Rules, not generic descriptions).

## Workflow

1. Analyse
2. Generate Draft
3. Update Draft
   1. Technical Name
   2. Fill "_Existing Dependencies & Reuse_" TFS section
   3. Fill "_Functionality Classification_" TFS section
   4. Fill "_'map' Library Specification_" TFS section
   5. Fill "_'data-access' Library Specification_" TFS section
   6. Fill "_'ui' Library Specification_" TFS section
   7. Fill "_'feature' Library Specification_" TFS section
   8. Fill "_User Experience & Flows (Technical & Frontend Perspective)_" TFS section
   9. Try to map remaining TFS sections
4. Validate Draft
   - Review Checklist
   - Validation Process (Iterative Loop)
5. Summary

### 1. Analyse

Analyse:

- [TFS Template](./assets/template.md).
- PRD.
- The following workspace documents:
  - `/docs/getting-started/library-types-and-their-relationship.md` (helpful for '_Functionality Classification_' TFS section).
  - `/docs/guidelines/naming-conventions.md`.
  - `/docs/guidelines/best-practices.md`.

### 2. Generate Draft

Create a draft that mirrors the template headings (content can be incomplete initially).

Ask the user where to save it:

- Target directory. Default: `/docs/agents/funs/`.
- File name. Default: `TFS_{functionality-name}.md`. e.g., `TFS_ng-chart.md`, `TFS_animation.md`.

If the file exists, ask before overwriting.

### 3. Update Draft

> ⚠️ **IMPORTANT:** Only include lib type specifications that are NEEDED for this functionality.
>
> - Skip 'map' section if: No new APIs OR existing 'map' libs already handle all endpoints (per "Existing Dependencies & Reuse")
> - Skip 'data-access' section if: No state management needed OR existing 'data-access' libs already handle it
> - Skip 'ui' section if: Only abstract functionality (no visual components) OR reusing existing 'ui' libs
> - Skip 'feature' section if: Only abstract functionality OR reusing existing 'feature' libs

Fill the draft using the PRD, mapping details into the correct template sections.

General rules while filling:

- Replace placeholders (e.g., `{name}`, `{NAME-FR-01}`, `{NAME-BR-01}`) with one consistent feature key.
- Keep requirements and rules atomic + testable.
- Do not invent facts; if unsure, mark as an open question and ask.

#### 1. Technical Name

1. Convert PRD feature name to kebab-case.
2. If the feature has logic, prefix with `ng-` (Angular). Example: `ng-chart`.
3. Ask the user to confirm the technical name.

#### 2. Fill "_Existing Dependencies & Reuse_" TFS section

> ⚠️ **CONFIRM:** Ask what existing libs to reuse (util/map/data-access/ui/feature) and what should be shared.

1. Ask which libs to use (lib type + lib name + key files/classes/functions).
   - Format: `Question → Suggested answer`.
   - Example: "Which util lib(s) should we reuse? Provide lib name/type and any relevant files/classes/functions."

2. Recommend which parts should become shared functionality across the workspace.
   - Format: `Recommendation → Reason → Question → Options`.
   - Example: "I recommend extracting meter fetching into shared map/data-access called 'ng-meter'; Because because according to the 'Overview' section of the PRD, this functionality will not be used only by this functionality (ng-chart); Would you like to implement this part of the logic as a separate functionality? (Y/N)"

3. Add approved libs to the section. If a lib is recommended but not available, flag it with `[RECOMMENDED]` keyword.

#### 3. Fill "_Functionality Classification_" TFS section

> ⚠️ **IMPORTANT:** After determining the type, read the matching example before continuing.

1. Based on step 3.2 and required libs, determine the functionality type (e.g., Hybrid).
2. Read the corresponding example TFS:
   - If Abstract, look at [abstract](./assets/examples/abstract.md).
   - If Visual, look at [visual](./assets/examples/visual.md).
   - If Hybrid, look at [hybrid](./assets/examples/hybrid.md).

#### 4. Fill "_'map' Library Specification_" TFS section

> ⚠️ **CONFIRM:** Ask for API contract details and confirm CRUD determination.

1. Ask for endpoints (method, URL, auth, headers, body, sample responses).
   - Format: `Question → Suggested answer`.
   - Example: "Which API endpoints should the 'map' library have? Please provide method (e.g., GET), URL, auth (public or protected), headers, body, and sample responses for each endpoint."

2. Determine whether a CRUD operation is going to be made, and confirm with the user.

3. Based on '_Alternative / Edge Flows_' section of PRD, write '_Error Handling_' section for each method.

#### 5. Fill "_'data-access' Library Specification_" TFS section

Infer from the 'map' section; ensure at least one method per API call.

#### 6. Fill "_'ui' Library Specification_" TFS section

> ⚠️ **CONFIRM:** If exporting more than 1 'ui' component, ask for explicit approval.

1. Based on '_User Experience & Flows_' section of PRD, understand how many components should be exported. If more than 1, confirm with the user. Format to use: `Recommendation → Reason → Question → Options`.  
   e.g., "I recommend exporting two components; because according to the 'User Experience & Flows' section of the PRD, the user should be navigated to another screen or page. Do you agree? (Y/N)".

2. Based on step 3.6.1, and '_User Experience & Flows_' section of PRD, write '_Rendering Rules_' section for each exported component.
   - Consider HTML hierarchy, semantics, and accessibility.
   - **Crucial:** You MUST use specific HTML selectors and attributes (e.g., `button[aria-label="Save"]`, `[data-cy="error-message"]`) as seen in the Template. Do NOT use generic terms like "Show a button" or "Render a list".

3. Based on step 3.6.1, and '_Functional Requirements_' & '_Business Rule Breakdown_' sections of PRD, write '_Functional Requirements & Business Rule Breakdown (Technical & Frontend Perspective)_' section for each exported component.
   - **Scope:** Include **ALL** Functional Requirements & Business Rules **EXCEPT** the ones related to data fetching.
   - **Crucial:** You must respect the IDs from the PRD's '_Functional Requirements_' & '_Business Rule Breakdown_'. Usage of a PRD ID (e.g., `NAME-BR-01`) signifies you are implementing THAT specific rule. **Do NOT repurpose PRD IDs** for unrelated technical checks (e.g., do not use `NAME-BR-01` for a "loading state" check, if `NAME-BR-01` in PRD is about "User permissions").
   - **Uniqueness:** IDs must be unique across the exported 'ui' components. **Do NOT reset numbering** for each component (e.g., you cannot have `NAME-BR-01` in Component A and `NAME-BR-01` in Component B describing different things).
   - **New Scenarios:** For technical scenarios (loading, error states, specific UI interactions) not explicitly covered in the PRD, you MUST generate **NEW, UNIQUE IDs** (e.g., if PRD ends at `05`, start your technical rules at `06`).
   - **Test-Ready Syntax (Crucial):** Your output MUST serve as a direct blueprint for Unit Tests.
     - **Strict Structure:** Use `Given [Arrange]; When [Act]; Then [Assert]` syntax.
     - **Technical Specificity:** Reference exact Input signals (e.g., `state = loading`), DOM selectors (e.g., `[data-cy="error"]`), and Output emitters (e.g., `clickedDetails`).
     - **Forbidden:** Generic natural language like "User sees the list" or "Show an error" is BANNED. Use "Render `[data-cy='list-container']`" instead.

4. Based on step 3.6.1, and '_Analytics & Tracking_' section of PRD, write '_Analytics & Tracking_' section for each exported component.

5. Based on step 3.6.1, and '_Alternative / Edge Flows_' section of PRD, write '_Error Handling & Edge Cases_' section for each exported component.

6. Complete writing other sections for each exported component.

#### 7. Fill "_'feature' Library Specification_" TFS section

> ⚠️ **CONFIRM:** If exporting more than 1 'feature' component, ask for explicit approval.

1. Infer from 'ui' section, understand how many components should be exported. If more than 1, confirm with the user. Format to use: `Recommendation → Reason → Question → Options`.  
   e.g., "I recommend exporting two components; because according to the 'ui' lib specification, we agreed to export two UI components. It also makes sense to have the corresponding 'feature' versions of those components as well. Do you agree? (Y/N)".

2. Based on step 3.7.1, and '_Functional Requirements_' & '_Business Rule Breakdown_' sections of PRD, write '_Functional Requirements & Business Rule Breakdown (Technical & Frontend Perspective)_' section for each exported component.
   - **Scope:** **ONLY** include Functional Requirements & Business Rules which are related to data fetching.
   - **Crucial:** You must respect the IDs from the PRD's '_Functional Requirements_' & '_Business Rule Breakdown_'. Usage of a PRD ID (e.g., `NAME-BR-01`) signifies you are implementing THAT specific rule. **Do NOT repurpose PRD IDs** for unrelated technical checks (e.g., do not use `NAME-BR-01` for a "facade method call" check if `NAME-BR-01` in PRD is about "loading state").
   - **Uniqueness:** IDs must be unique across the exported 'feature' components. **Do NOT reset numbering** for each component (e.g., you cannot have `NAME-BR-01` in Component A and `NAME-BR-01` in Component B describing different things).
   - **New Scenarios:** For technical scenarios (loading, error states, specific UI interactions) not explicitly covered in the PRD, you MUST generate **NEW, UNIQUE IDs** (e.g., if PRD ends at `05`, start your technical rules at `06`).
   - **Test-Ready Syntax (Crucial):** Your output MUST serve as a direct blueprint for Unit Tests.
     - **Strict Structure:** Use `Given [Arrange]; When [Act]; Then [Assert]` syntax.
     - **Technical Specificity:** Reference exact Input signals (e.g., `userId = 123`), and Output emitters (e.g., `clickedDetails`).
     - **Forbidden:** Generic natural language like "fetches the detailed data" is BANNED. Use "Call `V1NameFacade` facade's `getInfo` method" instead.

3. Based on step 3.7.1, and '_Analytics & Tracking_' section of PRD, write '_Analytics & Tracking_' section for each exported component.

4. Based on step 3.7.1, and '_Alternative / Edge Flows_' section of PRD, write '_Error Handling & Edge Cases_' section for each exported component.

5. Complete writing other sections for each exported component.

#### 8. Fill "_User Experience & Flows (Technical & Frontend Perspective)_" TFS section

> ⚠️ **IMPORTANT:** Only include this section if the functionality is NOT classified as abstract.

At this point you already know:

- What libs are going to be used for the functionality.
- What methods 'map' libs should have (if any).
- What methods/observables 'data-access' libs should have (if any).
- What inputs/outputs/methods/properties 'ui' & 'feature' libs should have for any components that they export.

So do the following for each 'feature' component:

1. Complete writing '_Primary flow_' section.
2. Add additional flows (if necessary) based on the corresponding 'ui' component rendering rules.

#### 9. Try to map remaining TFS sections

- Use PRD, workspace docs, and MCPs to populate each section.
- If info is missing, request details from the user.

### 4. Validate Draft

#### Review Checklist

Before finalization, verify the following:

- [ ] **Approval(s):** Have you obtained user approval(s) for Technical Name (step 3.1)
  - Confirmed: Technical name proposed and user approved?

- [ ] **Approval(s):** Have you obtained user approval(s) for Existing Dependencies (step 3.2)
  - Asked: Which 'util' libs to use?
  - Asked: Which 'map'/'data-access' libs to reuse?
  - Asked: Which 'ui'/'feature' libs to reuse?
  - Recommended: Any parts worth sharing across features?
  - Confirmed: User approved recommended shared libs (if any)?

- [ ] **Approval(s):** Have you obtained user approval(s) for 'map' Library (step 3.4)
  - Asked: API endpoints, methods, headers, body, responses?
  - Confirmed: CRUD operation determination?

- [ ] **Approval(s):** Have you obtained user approval(s) for 'ui' Library (step 3.6)
  - Confirmed: If MORE THAN 1 component should be exported, did you ask user to confirm? **(CRITICAL)**

- [ ] **Approval(s):** Have you obtained user approval(s) for 'feature' Library (step 3.7)
  - Confirmed: If MORE THAN 1 component should be exported, did you ask user to confirm? **(CRITICAL)**

- [ ] **Section(s):** All template sections exist (with their subsections), including:
  - Overview
  - Library Breakdown
  - User Experience & Flows (Technical & Frontend Perspective)

#### Validation Steps (Iterative Loop)

1. Check the checklist above.
2. If any 'Approval(s)' item fails:
   - Stop and ask user for the missing approval(s).
   - Wait for user response.
   - Re-run step 4.1 (re-check the entire checklist).
3. If any 'Section(s)' item fails:
   - Stop and edit the draft to fill the missing section(s).
   - Re-run step 4.1 (re-check the entire checklist).
4. If all pass: state that validation passed and continue to step 5 (Summary).

> ⚠️ **IMPORTANT:** Do NOT proceed to step 5 (Summary) until this validation loop confirms ALL checklist items are satisfied.

### 5. Summary

1. Present the draft to the user for review.
2. Provide a structured summary of any side-effects or follow-up actions:
   1. **New Libraries Identification:**
      - If you recommended new shared libs (in Step 3.2), remind the user that they require their own PRD & TFS.
   2. **PRD Updates (New Scenarios):**
      - If you added new **Functional Requirement** or **Business Rule** IDs (in Step 3.6.3 or 3.7.2), list them (IDs + brief description) and suggest updating the PRD to reflect these technical discoveries.
3. Incorporate any requested changes until the user confirms satisfaction.
