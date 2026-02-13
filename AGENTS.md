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

&nbsp;

# Big Picture & Architecture

- This is an Nx-managed monorepo (see `nx.json`, `apps/`, `libs/`).
- Apps live in `apps/`, shared code in `libs/`. Each app/lib has its own `project.json`.
- Library types: `api`, `util`, `map`, `data-access`, `ui`, `feature`, `page`, `app` (see `/docs/getting-started/library-types-and-their-relationship.md`).
- Code is composed by plugging libs into apps, following a Lego-like modular approach.
- See `/docs/introduction/folder-structure.md` for directory conventions.

&nbsp;

# Project-Specific Conventions

- Naming, folder, and code style conventions are in `/docs/guidelines/naming-conventions.md`.
- Best practices: `/docs/guidelines/best-practices.md`.
- Shared libraries are versioned and reused across apps (see `/docs/getting-started/library-types-and-their-relationship.md#versioning-shared-libs`).
- For Angular, see `/docs/guidelines/available-commands.md#angular-related` for generation and build patterns.

&nbsp;

# Integration & Cross-Component Patterns

- Angular libs communicate via inputs and outputs, but indirect communications between nested components happens via the Communication service (a service in `shared-util-ng-services` lib) via well-defined interfaces; see `/docs/guidelines/common-tasks.md#add-new-communication-interface-for-a-lib`.
- External dependencies are managed via `pnpm` and referenced in each `package.json`.
- For decision about how to use 3rd-party frameworks, see `/docs/faq/boilerplate-apps.md#organizing`.

# Developer Workflows

- **Always use Nx CLI** (`nx run`, `nx build`, `nx test`, etc.) for builds, tests, linting, and generation.
- Use `pnpm` as the package manager.
- Before editing codes, **remember that this workspace follows [Skills-First Workflow](#skills-first-workflow)**.
- For project graph or dependency issues, use Nx MCP tools (`nx_workspace`, `nx_project_details`).

## Skills-First Workflow

**MANDATORY:** Before responding to any request, follow the following steps. Goal is to identify which skill(s) are most relevant to the request.

1. **Read skills** (`docs/agents/skills/`): List all available skills (`SKILL.md` files).
2. **Scan metadata**: Review ONLY the metadata section of each skill (specially `name` and `description`) to find relevant ones to the request.
3. **Select skill**: Choose the skill(s) that best matches the request.
4. **Deep dive**: Read the complete `SKILL.md` file with all references, assets, and scripts
5. **Execute**: Follow the skill's documented approach.

### Rules

- ✅ **Always** check skills directory first before using your own knowledge.
- ✅ Read complete skill documentation including references, assets, and scripts.
- ✅ Follow the skill's procedures exactly.
- ❌ **Never** skip the skills check.
- ❌ Don't assume or improvise without consulting skills first.

### Other considerations

- Do not ask the user for clarification about the meaning of a request if a relevant skill exists—always follow the skill's documented approach first.
- If multiple skills seem relevant: Choose the one that most directly addresses the primary request.
- If there are multiple versions for the chosen skill: Choose the latest version.
- If no skill matches: Inform that no existing skill covers this scenario and continue to proceed with general knowledge.

## MCP Usage Priority

**Use MCPs in this order based on your query:**

1. **`nx-mcp`**: First choice for all workspace, build, and project structure questions
2. **`angular-cli`**: Angular-specific features, components, and CLI operations
3. **`figma-mcp`**: UI/design questions and Figma integration
4. **`context7`**: External documentation lookup (fallback only)

### Rules

- ✅ Follow the priority order - start with `nx-mcp` for workspace queries
- ✅ Use the most specific MCP for the task (Angular questions → `angular-cli`)
- ✅ Check MCP config `description` property to understand each server's scope
- ❌ Don't skip to `context7` without trying workspace-specific MCPs first
