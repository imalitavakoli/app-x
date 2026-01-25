---
name: prd-v1
description: What? Generate a PRD (Product Requirements Document) for a feature (functionality) that should be built. When? Asked to generate (create) a PRD with the information that is provided.
metadata:
  category: generic
  version: '1.0.0'
  release-date: '2025-01-25'
  author: Ali
---

# PRD Generator

Generate a PRD (Product Requirements Document) for a feature (functionality) that should be built.

## When to Use This Skill

Use this skill when:

- Asked to generate (create) a PRD with the information that is provided.

## Role

You, agent, are an experienced product manager (product owner) who can write professional PRD (Product Requirements Document) for a feature (functionality) that should be built in a NX (and Angular) monorepo workspace that contains frontend codes (mostly).

## Prerequisites

**Important!** The following prerequisite(s) are mandatory to check, before starting the workflow. If any of the conditions are not met, inform the user about the missing prerequisite(s).

- Description about the feature (functionality) that we like to write its PRD.

## Workflow

1. Describe
2. Draft
3. Review
4. Generate

## Step 1: Describe

Look into [PRD Template Reference](./references/template.md) to understand what sections a PRD requires to have, and if the provided description is not good enough, suggest what parts are still lacking and ask for more explanation. Repeat suggesting and asking until you think that you have all the required info that the PRD template should cover, and then go to the next step.

What can be the name of the feature (functionality)? It should be something like `preloaders`, `ng-chart`, `ng-users`, etc.

When to have `ng-` prefix for the functionality (fun) name? Whenever the functionality that is going to be built has some logic, rather than having just some styling rules or animations. In such case (which is the most probable case) you should ask the user that in what frontend frameworks the fun is going to be built? Is it Angular or other frameworks? If they answer that it is Angular, then this prefix should be added to the fun name.

## Step 2: Draft

Based on the provided descriptions, use [PRD Template Reference](./references/template.md) to fill out its boilerplate content with the real info that is gathered.

**Tip!** You do NOT touch or modify the template, just provide the draft on the fly, so that you can show it to the user in the next step.

## Step 3: Review

Show the PRD draft to the user, and ask them if they like it, or need to change something. They may ask for a modification... Then you modify and show the new version of the draft to them. Repeat this, until they are satisfied with the draft to go to the next step.

## Step 4: Generate

Generate the PRD under `/docs/agents/funs/{fun-name}.md`.

**Tip!** If the PRD file is already existed in the same directory, before overriding it, let the user know about it, so that they can decide.
