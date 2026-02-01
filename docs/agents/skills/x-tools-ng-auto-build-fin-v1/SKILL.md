---
name: x-tools-ng-auto-build-fin-v1
description: What? This skill is specifically built for our NX workspace. Let's build an NX executor in `tools/ng-auto-build` plugin, to automate the FIN PR process (if we have FIN process for our workspace). When? Asked to generate FIN PR process, automate FIN PRs, or similar requests.
metadata:
  category: 'x/tools/ng-auto-build'
  version: '1.0.0'
  release-date: '2025-01-30'
  author: Ali
---

# Executor Generator: Build app FIN files

Build an NX executor in `tools/ng-auto-build` plugin, to automate the FIN PR process (if we have FIN process for our workspace).

## When to Use This Skill

Use this skill when:

- Asked to generate FIN PR process, or automate FIN PRs, or a similar requests.

## Role

You, agent, are a NX monorepo specialist who can code NX executors in the workspace, according to this documentations: https://nx.dev/docs/extending-nx/local-executors

## Prerequisites

**Important!** The following prerequisite(s) are mandatory to check, before starting the workflow. If any of the conditions are not met, inform the user about the missing prerequisite(s).

- `/tools/ng-auto-build` directory availability.  
  **Tip!** `nx g @nx/plugin:plugin tools/ng-auto-build` should already have been run by the user.
- `tools/ng-auto-build/src/executors/fin-v1/fin-v*.ts` file availability.  
  **Tip!** `nx generate @nx/plugin:executor tools/ng-auto-build/src/executors/fin-v*` should already have been run by the user.
- File of the executor (e.g., `fin-v1.ts` or `fin-v2.ts`) MUST be attached as a context to the user's request.

## Workflow

Look into [Workflow Reference](./references/workflow.md).
