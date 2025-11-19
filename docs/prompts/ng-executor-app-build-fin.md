[🔙](../../README.md#prompts)

# Generate Angular Executor: Build app FIN files 💻

Generate an executor (for Angular apps) which can automate the FIN PR process (if we have FIN process for our workspace) in ~1 minute using LLM assistance.

**Note!** This prompt can be used only ONCE in your workspace! So if you already have used it to code your [NX executor](https://nx.dev/docs/extending-nx/local-executors), then you don't need to read this document anymore :)

&nbsp;

[🔝](#generate-angular-executor-build-app-fin-files-💻)

## Quick Start

### What You Need

- LLM prompt file (`docs/prompts/ng-executor-app-build-fin-v1.md.md`)
- Access to LLM (Claude, ChatGPT, etc.)

### Steps

1. Run `nx g @nx/plugin:plugin tools/ng-app-build-fin` to generate `ng-app-build-fin` NX plugin in the workspace.
2. Run `nx generate @nx/plugin:executor tools/ng-app-build-fin/src/executors/echo` to create an executor in the plugin.
3. **Start new LLM chat**
4. **Attach in this order:**
   - The prompt file.
   - `echo.ts` file of the executor.
5. **Ask LLM:**
   - Read the attached markdown file to understand what to do.
