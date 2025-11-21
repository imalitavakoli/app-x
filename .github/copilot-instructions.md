# Copilot Instructions for AI Coding Agents

## Big Picture & Architecture

- This is an Nx-managed monorepo (see `nx.json`, `apps/`, `libs/`).
- Apps live in `apps/`, shared code in `libs/`. Each app/lib has its own `project.json`.
- Library types: `api`, `util`, `map`, `data-access`, `ui`, `feature`, `page`, `app` (see `/docs/getting-started/library-types-and-their-relationship.md`).
- Code is composed by plugging libs into apps, following a Lego-like modular approach.
- See `/docs/introduction/folder-structure.md` for directory conventions and `/docs/mindset/monorepo.md` for rationale.

## Developer Workflows

- **Always use Nx CLI** (`nx run`, `nx build`, `nx test`, etc.) for builds, tests, linting, and generation.
- Use `pnpm` as the package manager (see `pnpm-lock.yaml`).
- Common commands and workflows are documented in `/docs/guidelines/available-commands.md` and `/docs/guidelines/common-tasks.md`.
- For new libs/apps/components, use Nx generators (see `/docs/guidelines/available-commands.md#generating-apps`).
- For project graph or dependency issues, use Nx MCP tools (`nx_workspace`, `nx_project_details`).

## Project-Specific Conventions

- Naming, folder, and code style conventions are in `/docs/guidelines/naming-conventions.md`.
- PR rules and best practices: `/docs/guidelines/pr-rules.md`, `/docs/guidelines/best-practices.md`.
- Shared libraries are versioned and reused across apps (see `/docs/getting-started/library-types-and-their-relationship.md#versioning-shared-libs`).
- For Angular, see `/docs/guidelines/available-commands.md#angular-related` for generation and build patterns.

## Integration & Cross-Component Patterns

- Angular libs communicate via inputs and outputs, but indirect communications between nested components happens via the Communication service (a service in `shared-util-ng-services` lib) via well-defined interfaces; see `/docs/guidelines/common-tasks.md#add-new-communication-interface-for-a-lib`.
- External dependencies are managed via `pnpm` and referenced in each `package.json`.
- For mobile/web integration (Ionic, Capacitor, Electron), see `/docs/faq/boilerplate-apps.md`.

## Key References

- `README.md` (workspace overview)
- `AGENTS.md` (AI agent guidelines)
- `/docs/` (detailed guides, patterns, and FAQs)
- `_pipeline/` (build/deploy scripts)
- `nx.json`, `project.json` (Nx config)

## Example: Test a Library

```sh
nx test shared-ui-ng-translations
```

---

For more, see `/docs/` and always prefer Nx/MCP tools for all major workflows.
