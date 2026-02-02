---
name: frontend-monorepo-ng-tfs-v1
description: What? Generate a TFS (Technical Functional Specification) for a feature (functionality) that should be built aligned with monorepo + Angular apps/libs architecture. When? Asked to generate (create) a TFS with the information that is provided, Technical Document, Frontend Architecture, System Requirements Specification, Technical Design Document, or similar requests.
license: Complete terms in LICENSE.txt
metadata:
  version: '1.0.0'
  release-date: '2025-01-30'
---

# TFS Generator

Generate a TFS (Technical Functional Specification) for a feature (functionality) that should be built aligned with monorepo + Angular apps/libs architecture.

## When to Use This Skill

Use this skill when:

- Asked to generate (create) a TFS with the information that is provided, Technical Document, Frontend Architecture, System Requirements Specification, Technical Design Document, or similar requests.

## Role

You, agent, are a senior frontend developer (experienced in monorepo + Angular workspaces), capable of producing complete technical documents.

## Prerequisites

**Mandatory Prerequisites** The following prerequisite(s) are MANDATORY to check, before starting the workflow. **If any of the conditions are not met, inform the user to provide them**.

- PRD file of the feature (functionality) MUST be attached as a context.

**Optional Prerequisites** The following prerequisite(s) are OPTIONAL to check, before starting the workflow. **If any of the conditions are not met, suggest providing them to the user**.

- Screenshots of pages/screens (helpful for UI specs).
- user-provided sample libs for each type (map, data-access, ui, feature).

## Mandatory Agent Instructions

- You MUST use the official template structure and section order exactly as provided in the template reference.
- Do NOT add, remove, or rename sections.
- If a step (or sub step) requires user input or confirmation, you MUST ask and wait for a response before proceeding.
- Do NOT merge, skip, or improvise steps. Follow the workflow strictly.

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

Analyse the following documents:

- [TFS Template Reference](./references/template.md) to understand what sections the TFS should have, and also read the guidelines and descriptions mentioned in it to help you prepare the TFS draft better and fill different sections more accurately.
- PRD.
- Workspace documents (if available) to learn more about:
  - 'library types and their relationship' (helpful for '_Functionality Classification_' TFS section).
  - 'naming conventions'.
  - 'best practices'.

### 2. Generate Draft

**Where to save the draft? Ask the user** for:

- Target directory. e.g., `/docs/agents/funs/`.
- File name. Recommended: `TFS_{functionality-name}.md`.
  **If a file already exists, notify the user before overwriting.**

### 3. Update Draft

> ⚠️ **IMPORTANT:** Only include lib type specifications that are NEEDED for this functionality.
>
> - Skip 'map' section if: No new APIs OR existing 'map' libs already handle all endpoints (per "Existing Dependencies & Reuse")
> - Skip 'data-access' section if: No state management needed OR existing 'data-access' libs handle it
> - Skip 'ui' section if: Only abstract functionality (no visual components) OR reusing existing 'ui' libs
> - Skip 'feature' section if: Only abstract functionality OR reusing existing 'feature' libs

Update the draft using available PRD description and TFS template.

#### 1. Technical Name

1. Convert PRD feature name to kebab-case.

2. Prefix with `ng-` (which stands for Angular), if the feature has logic. e.g., `ng-chart`.

3. Confirm with the user.

#### 2. Fill "_Existing Dependencies & Reuse_" TFS section

> ⚠️ **CONFIRM:** Ask user about existing libs (util, map, data-access, ui, feature) & recommendations for shared logic.

1. Ask which libs to use, including lib types, file names, class names, and functions. Format to use: `Question → Suggested answer`.  
   e.g., "Which 'util' lib(s) should be used for this functionality? Please provide the lib name(s), lib type(s), and any relevant file names, class names, or function names.".

2. Recommend what other parts of the business logic (according to the PRD) worth to be shared across other features (functionalities) in the workspace. Format to use: `Recommendation → Reason → Question → Options`.  
   e.g., "I recommend using a shared 'map' / 'data-access' lib called 'ng-meter' to fetch the list of meters; because according to the 'Overview' section of the PRD, this functionality will not be used only by this functionality (ng-chart). Would you like to implement this part of the logic as a separate functionality? (Y/N)".

3. Add approved libs to the section.

#### 3. Fill "_Functionality Classification_" TFS section

Determine type (e.g., Hybrid) based on the libs that the functionality requires to have for its own.

#### 4. Fill "_'map' Library Specification_" TFS section

> ⚠️ **CONFIRM:** Ask user about API endpoints (method, URL, auth, headers, body, response) & CRUD determination.

1. Ask API endpoints, HTTP methods, headers, body, responses. Format to use: `Question → Suggested answer`.  
   e.g., "Which API endpoints should be called? Please provide the HTTP method (e.g., GET), endpoint, authorization type (public or protected), required headers, request body, and sample response(s).".

2. Determine whether a CRUD operation is going to be made, and confirm with the user.

3. Based on '_Alternative / Edge Flows_' section of PRD, write '_Error Handling_' section for each method.

#### 5. Fill "_'data-access' Library Specification_" TFS section

Infer from 'map' section, and ensure at least one method per API call.

#### 6. Fill "_'ui' Library Specification_" TFS section

> ⚠️ **CONFIRM:** If MORE THAN 1 'ui' component, ask user approval before proceeding.

1. Based on '_User Experience & Flows_' section of PRD, understand how many components should be exported. If more than 1, confirm with the user. Format to use: `Recommendation → Reason → Question → Options`.  
   e.g., "I recommend exporting two components; because according to the 'User Experience & Flows' section of the PRD, the user should be navigated to another screen or page. Do you agree? (Y/N)".

2. Based on step 1, and '_User Experience & Flows_' section of PRD, write '_Rendering Rules_' section for each exported component. Consider HTML hierarchy, semantics, and accessibility.

3. Based on step 1, and '_Functional Requirements_' & '_Business Rule Breakdown_' sections of PRD, write '_Functional Requirements & Business Rule Breakdown (Technical & Frontend Perspective)_' section for each exported component.
   - **Crucial:** You must respect the IDs from the PRD's '_Functional Requirements_' & '_Business Rule Breakdown_'.
   - **New Scenarios:** If you identify necessary scenarios not covered in the PRD, add them with **new, unique IDs** in the draft.

4. Based on step 1, and '_Analytics & Tracking_' section of PRD, write '_Analytics & Tracking_' section for each exported component.

5. Based on step 1, and '_Alternative / Edge Flows_' section of PRD, write '_Error Handling & Edge Cases_' section for each exported component.

6. Complete writing other sections for each exported component.

#### 7. Fill "_'feature' Library Specification_" TFS section

> ⚠️ **CONFIRM:** If MORE THAN 1 'feature' component, ask user approval before proceeding.

1. Infer from 'ui' section, understand how many components should be exported. If more than 1, confirm with the user. Format to use: `Recommendation → Reason → Question → Options`.  
   e.g., "I recommend exporting two components; because according to the 'ui' lib specification, we agreed to export two UI components. It also makes sense to have the corresponding 'feature' versions of those components as well. Do you agree? (Y/N)".

2. Based on step 1, and '_Analytics & Tracking_' section of PRD, write '_Analytics & Tracking_' section for each exported component.

3. Based on step 1, and '_Alternative / Edge Flows_' section of PRD, write '_Error Handling & Edge Cases_' section for each exported component.

4. Complete writing other sections for each exported component.

#### 8. Fill "_User Experience & Flows (Technical & Frontend Perspective)_" TFS section

When you're in this step, you already know:

- What methods 'map' libs should have.
- What methods/observables 'data-access' libs should have.
- What inputs/outputs/methods/properties 'ui' & 'feature' libs should have for any components that they export.

So you're ready to:

1. Complete writing '_Primary flow_' section of the TFS.

2. Add additional flows (if necessarily) according to '_Rendering Rules_' section of the 'ui' lib specification.

#### 9. Try to map remaining TFS sections

- Use PRD, workspace docs, and MCPs to populate each section.
- If info is missing, request details from the user.

### 4. Validate Draft

#### Review Checklist

**Before finalization, you MUST verify the following checklist:**

Review each item and confirm that it is satisfied:

- [ ] **Have you obtained user approval in: Technical Name (step 3.1)**
  - ✅ Confirmed: Technical name proposed and user approved?

- [ ] **Have you obtained user approval in: Existing Dependencies (step 3.2)**
  - ✅ Asked: Which 'util' libs to use?
  - ✅ Asked: Which 'map'/'data-access' libs to reuse?
  - ✅ Asked: Which 'ui'/'feature' libs to reuse?
  - ✅ Recommended: Any parts worth sharing across features?
  - ✅ Confirmed: User approved recommended shared libs (if any)?

- [ ] **Have you obtained user approval in: 'map' Library (step 3.4)**
  - ✅ Asked: API endpoints, methods, headers, body, responses?
  - ✅ Confirmed: CRUD operation determination?

- [ ] **Have you obtained user approval in: 'ui' Library (step 3.6)**
  - ✅ Confirmed: If MORE THAN 1 component should be exported, did you ask user to confirm? **(CRITICAL)**

- [ ] **Have you obtained user approval in: 'feature' Library (step 3.7)**
  - ✅ Confirmed: If MORE THAN 1 component should be exported, did you ask user to confirm? **(CRITICAL)**

- [ ] **Do CRITICAL section(s) in the template exist in the draft**
  - ✅ Exists: "Overview" section and sub sections?
  - ✅ Exists: "Library Breakdown" section and sub sections?
  - ✅ Exists: "User Experience & Flows (Technical & Frontend Perspective)" section and sub sections?

#### Validation Process (Iterative Loop)

1. **Check all items** - Go through the entire checklist above
2. **If ANY item which required 'user approval' is NOT checked ✅:**
   - Stop and ask user for the missing approval(s)
   - Wait for user response
   - **Return to step 1** (re-check the entire checklist)
3. **If ANY item which required 'CRITICAL section(s) in the template to exist in the draft' is NOT checked ✅:**
   - Stop and edit the draft to fill the missing section(s)
   - **Return to step 1** (re-check the entire checklist)
4. **If ALL items are checked ✅:**
   - Present summary: "I have confirmed all requirements are met. Ready to generate the final draft."
   - Proceed to step 4 (Generate Draft)

> ⚠️ **IMPORTANT:** Do NOT proceed to Generate Draft until this validation loop confirms ALL items are ✅.

### 5. Summary

1. Present the draft to the user for review.
2. Provide a structured summary of any side-effects or follow-up actions:
   1. **New Libraries Identification:**
      - If you recommended new shared libs (in Step 2.2), remind the user that they require their own PRD & TFS.
   2. **PRD Updates (New Scenarios):**
      - If you added new IDs/scenarios (in Step 2.6), list them (IDs + brief description) and suggest updating the PRD to reflect these technical discoveries.
3. Incorporate any requested changes until the user confirms satisfaction.
