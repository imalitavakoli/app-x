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

**Important!** The following prerequisite(s) are mandatory to check, before starting the workflow. If any of the conditions are not met, inform the user about the missing prerequisite(s).

- PRD file of the feature (functionality) MUST be attached as a context.
- **Optional!** Screenshots of pages/screens (helpful for UI specs).
- **Optional!** user-provided sample libs for each type ('map', 'data-access', 'ui', 'feature').

## Mandatory Agent Instructions

- You MUST use the official template structure and section order exactly as provided in the template reference.
- Do NOT add, remove, or rename sections.
- If a step (or sub step) requires user input or confirmation, you MUST ask and wait for a response before proceeding.
- Do NOT merge, skip, or improvise steps. Follow the workflow strictly.

## Workflow

1. Analyse
2. Prepare Draft
   1. Technical Name
   2. Fill "_Existing Dependencies & Reuse_" TFS section
   3. Fill "_Functionality Classification_" TFS section
   4. Fill "_'map' Library Specification (if applicable)_" TFS section
   5. Fill "_'data-access' Library Specification (if applicable)_" TFS section
   6. Fill "_'ui' Library Specification (if applicable)_" TFS section
   7. Fill "_'feature' Library Specification (if applicable)_" TFS section
   8. Fill "_User Experience & Flows (Technical & Frontend Perspective)_" TFS section
   9. Try to map remaining TFS sections
3. Generate Draft

### Analyse

Analyse the following documents:

- [TFS Template Reference](./references/template.md) to understand what sections the TFS should have.
- PRD.
- Workspace documents (if available) to learn more about:
  - 'library types and their relationship' (helpful for '_Functionality Classification_' TFS section).
  - 'naming conventions'.
  - 'best practices'.

### Prepare Draft

Prepare a draft using available PRD description and TFS template.

**Consider this, when preparing the TFS draft:**
Of course each lib type specification in the TFS should exist ONLY IF that lib type should be built for the functionality.  
e.g., if there's NO API endpoint to call for the functionality, or there are some API endpoints to call, but such APIs are already implemented in the 'map' libs that are defined in '_Existing Dependencies & Reuse_' section, then there's no need to have '_'map' Library Specification (if applicable)_' section of the TFS at all.

#### 1. Technical Name

1. Convert PRD feature name to kebab-case.

2. Prefix with `ng-` (which stands for Angular), if the feature has logic. e.g., `ng-chart`.

3. Confirm with the user.

#### 2. Fill "_Existing Dependencies & Reuse_" TFS section

1. Ask which libs to use, including lib types, file names, class names, and functions. Format to use: `Question → Suggested answer`.  
   e.g., "Which 'util' lib(s) should be used for this functionality? Please provide the lib name(s), lib type(s), and any relevant file names, class names, or function names.".

2. Recommend what other parts of the business logic (according to the PRD) worth to be shared across other features (functionalities) in the workspace. Format to use: `Recommendation → Reason → Question → Options`.  
   e.g., "I recommend using a shared 'map' / 'data-access' lib called 'ng-meter' to fetch the list of meters; because according to the 'Overview' section of the PRD, this functionality will not be used only by this functionality (ng-chart). Would you like to implement this part of the logic as a separate functionality? (Y/N)".

3. Add approved libs to the section.

#### 3. Fill "_Functionality Classification_" TFS section

Determine type (e.g., Hybrid) based on the libs that the functionality requires to have for its own.

#### 4. Fill "_'map' Library Specification (if applicable)_" TFS section

1. Ask API endpoints, HTTP methods, headers, body, responses. Format to use: `Question → Suggested answer`.  
   e.g., "Which API endpoints should be called? Please provide the HTTP method (e.g., GET), endpoint, authorization type (public or protected), required headers, request body, and sample response(s).".

2. Determine whether a CRUD operation is going to be made, and confirm with the user.

3. Based on '_Alternative / Edge Flows_' section of PRD, write '_Error Handling_' section for each method.

#### 5. Fill "_'data-access' Library Specification (if applicable)_" TFS section

Infer from 'map' section, and ensure at least one method per API call.

#### 6. Fill "_'ui' Library Specification (if applicable)_" TFS section

1. Based on '_User Experience & Flows_' section of PRD, understand how many components should be exported. If more than 1, confirm with the user. Format to use: `Recommendation → Reason → Question → Options`.  
   e.g., "I recommend exporting two components; because according to the 'User Experience & Flows' section of the PRD, the user should be navigated to another screen or page. Do you agree? (Y/N)".

2. Based on sub step 1, and '_User Experience & Flows_' section of PRD, write '_Rendering Rules_' section for each exported component. Consider HTML hierarchy, semantics, and accessibility.

3. Based on sub step 1, and '_Functional Requirements_' & '_Business Rule Breakdown_' sections of PRD, write '_Functional Requirements & Business Rule Breakdown (Technical & Frontend Perspective)_' section for each exported component.

4. Based on sub step 1, and '_Analytics & Tracking_' section of PRD, write '_Analytics & Tracking_' section for each exported component.

5. Based on sub step 1, and '_Alternative / Edge Flows_' section of PRD, write '_Error Handling & Edge Cases_' section for each exported component.

6. Complete writing other sections for each exported component.

#### 7. Fill "_'feature' Library Specification (if applicable)_" TFS section

1. Infer from 'ui' section, understand how many components should be exported. If more than 1confirm with the user. Format to use: `Recommendation → Reason → Question → Options`.  
   e.g., "I recommend exporting two components; because according to the 'ui' lib specification, we agreed to export two UI components. It also makes sense to have the corresponding 'feature' versions of those components as well. Do you agree? (Y/N)".

2. Based on sub step 1, and '_Analytics & Tracking_' section of PRD, write '_Analytics & Tracking_' section for each exported component.

3. Based on sub step 1, and '_Alternative / Edge Flows_' section of PRD, write '_Error Handling & Edge Cases_' section for each exported component.

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

### Generate Draft

1. Present the draft to the user for review.
2. Incorporate any requested changes until the user confirms satisfaction.

**Where to save the draft? Ask the user** for:

- Target directory. e.g., `/docs/agents/funs/`.
- File name. Recommended: `TFS_{functionality-name}.md`.
  **If a file already exists, notify the user before overwriting.**

**Remind the user:**
In '_Draft_' > step 2 ('_Existing Dependencies & Reuse_') > step 2.3: Did the user approve some recommended libs to be added? Then remind them that any recommended lib must also have PRD & TFS created separately.
