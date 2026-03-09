---
name: x-prd
description: WHAT? Generate a PRD (Product Requirements Document) for a feature (functionality) that should be built. WHEN? Asked to generate (create) a PRD with the information that is provided, Product Strategy Document, Scope Document, Feature Document, or similar requests.
metadata:
  modifies-in: '/docs/agents/funs/'
  version: '1.1.0'
---

# PRD Generator

Generate a PRD (Product Requirements Document) for a feature (functionality) that should be built.

## When to Use This Skill

Asked to generate (create) a PRD with the information that is provided, Product Strategy Document, Scope Document, Feature Document, or similar requests.

## Role

You are a product owner writing a clear, professional PRD.

## Prerequisites

**Mandatory Prerequisites**: If missing, ask the user and STOP.

- A clear **feature description** (or equivalent supporting doc).

> ⚠️ **IMPORTANT:** Do not research the prerequisites; only use user-provided info.

## Mandatory Agent Instructions

- You MUST use the official template structure and section order exactly as provided in the template.
- Do NOT add/remove/rename template sections. **Allowed exceptions:**
  - "quote" helper texts are guidelines for you, but remove them from the final draft.
- Any step/sub-step that requires user input or approval is a hard gate: ask, wait, then continue.
- Do NOT merge/skip/improvise steps. Follow the workflow strictly.

## Workflow

1. Analyse
2. Generate Draft
3. Update Draft
4. Validate Draft
   - Review Checklist
   - Validation Process (Iterative Loop)
5. Summary

### 1. Analyse

Analyse:

- [PRD Template](./assets/template.md).
- User-provided feature description/supporting docs.

If any template section cannot be filled, name the missing section(s) and ask targeted questions.

### 2. Generate Draft

Create a draft that mirrors the template headings (content can be incomplete initially).

Ask the user where to save it:

- Target directory. Default: `/docs/agents/funs/`.
- File name. Default: `PRD_{functionality-name}.md`. e.g., `PRD_ng-chart.md`, `PRD_animation.md`.

If the file exists, ask before overwriting.

### 3. Update Draft

Fill the draft using the provided feature description, mapping details into the correct template sections.

General rules while filling:

- Replace placeholders (e.g., `{name}`, `{NAME-FR-01}`, `{NAME-BR-01}`) with one consistent feature key.
- Keep requirements and rules atomic + testable.
- Do not invent facts; if unsure, mark as an open question and ask.

### 4. Validate Draft

#### Review Checklist

Before finalization, verify the following:

- [ ] **Section(s):** All template sections exist (with their subsections), including:
  - Overview
  - Users
  - Permissions & Security
  - Data Requirements
  - Functional Requirements
  - User Experience & Flows
  - Business Rule Breakdown
  - Analytics & Tracking
  - Dependencies & Risks
  - Acceptance Criteria (High‑Level)
  - Open Questions
  - Appendices

#### Validation Steps (Iterative Loop)

1. Check the checklist above.
2. If any 'Section(s)' item fails:
   - Stop and edit the draft to fill the missing section(s).
   - Re-run step 4.1 (re-check the entire checklist).
3. If all pass: state that validation passed and continue to step 5 (Summary).

> ⚠️ **IMPORTANT:** Do NOT proceed to step 5 (Summary) until this validation loop confirms ALL checklist items are satisfied.

### 5. Summary

1. Present the draft to the user for review.
2. Provide a structured summary of any side-effects or follow-up actions (if any).
3. Incorporate any requested changes until the user confirms satisfaction.
