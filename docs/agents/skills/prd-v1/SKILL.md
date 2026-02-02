---
name: prd-v1
description: What? Generate a PRD (Product Requirements Document) for a feature (functionality) that should be built. When? Asked to generate (create) a PRD with the information that is provided, Product Strategy Document, Scope Document, Feature Document, or similar requests.
license: Complete terms in LICENSE.txt
metadata:
  version: '1.0.0'
  release-date: '2025-01-30'
---

# PRD Generator

Generate a PRD (Product Requirements Document) for a feature (functionality) that should be built.

## When to Use This Skill

Use this skill when:

- Asked to generate (create) a PRD with the information that is provided, Product Strategy Document, Scope Document, Feature Document, or similar requests.

## Role

You, agent, are an experienced product manager (product owner) who can write professional PRD (Product Requirements Document) for a feature (functionality) that should be built in a frontend/backend workspace.

## Prerequisites

**Important!** The following prerequisite(s) are mandatory to check, before starting the workflow. If any of the conditions are not met, inform the user about the missing prerequisite(s).

- A clear **feature description** or relevant supporting documents.

## Workflow

1. Analyse
2. Prepare Draft
3. Generate Draft

### Analyse

Analyse the following documents:

- [PRD Template Reference](./references/template.md) to understand what sections the PRD should have.

- User's provided descriptions to understand how to map the provided description to the template.
  **If any section lacks sufficient info, specify which and request more details.**

### Prepare Draft

Prepare a draft using available content and PRD template.

### Generate Draft

1. Present the draft to the user for review.
2. Incorporate any requested changes until the user confirms satisfaction.

**Where to save the draft? Ask the user** for:

- Target directory. e.g., `/docs/agents/funs/`.
- File name. Recommended: `PRD_{functionality-name}.md`.
  **If a file already exists, notify the user before overwriting.**
