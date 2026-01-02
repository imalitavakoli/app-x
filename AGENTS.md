<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors

<!-- nx configuration end-->

# Big Picture & Architecture

- This is an Nx-managed monorepo (see `nx.json`, `apps/`, `libs/`).
- Apps live in `apps/`, shared code in `libs/`. Each app/lib has its own `project.json`.
- Library types: `api`, `util`, `map`, `data-access`, `ui`, `feature`, `page`, `app` (see `/docs/getting-started/library-types-and-their-relationship.md`).
- Code is composed by plugging libs into apps, following a Lego-like modular approach.
- See `/docs/introduction/folder-structure.md` and `/docs/faq/directories-and-files.md` for directory conventions and `/docs/mindset/monorepo.md` for rationale.

# Developer Workflows

- **Always use Nx CLI** (`nx run`, `nx build`, `nx test`, etc.) for builds, tests, linting, and generation.
- Use `pnpm` as the package manager (see `pnpm-lock.yaml`).
- Common commands and workflows are documented in `/docs/guidelines/available-commands.md` and `/docs/guidelines/common-tasks.md`.
- For new libs/apps/components, use Nx generators (see `/docs/guidelines/available-commands.md`).
- For project graph or dependency issues, use Nx MCP tools (`nx_workspace`, `nx_project_details`).

# Project-Specific Conventions

- Naming, folder, and code style conventions are in `/docs/guidelines/naming-conventions.md`.
- PR rules and best practices: `/docs/guidelines/pr-rules.md`, `/docs/guidelines/best-practices.md`.
- Shared libraries are versioned and reused across apps (see `/docs/getting-started/library-types-and-their-relationship.md#versioning-shared-libs`).
- For Angular, see `/docs/guidelines/available-commands.md#angular-related` for generation and build patterns.

# Integration & Cross-Component Patterns

- Angular libs communicate via inputs and outputs, but indirect communications between nested components happens via the Communication service (a service in `shared-util-ng-services` lib) via well-defined interfaces; see `/docs/guidelines/common-tasks.md#add-new-communication-interface-for-a-lib`.
- External dependencies are managed via `pnpm` and referenced in each `package.json`.
- For mobile/web integration (Ionic, Capacitor, Electron), see `/docs/faq/boilerplate-apps.md`.

# MCP usage and priority

Use MCPs in the following order and scope:

- `nx-mcp`: Use it first for all workspace questions.
- `angular-cli`: Use it only for Angular-specific questions.
- `context7`: Use it only as a fallback for external docs.
- `figma-mcp`: Use it only for UI/design questions.

**Tip!** In the MCP configuration files, read the `description` property for each MCP server to learn more about their scope.
