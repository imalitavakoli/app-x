[🔙](../../README.md#introduction)

# Folder structure 📁

**How the workspace apps get compiled?**  
The building tool (CLI), reads `apps/{app-name}/project.json`, and that file has already defined the following inside of itself:

- `apps/{app-name}/src/main.ts` as the main file to load the app codes.
- `apps/{app-name}/src/index.html` as the index file to bring up the app itself.

**What are the workspace most important files and directories?**  
Although we may have many apps and libraries in the workspace, when building new functionality or updating existing code, it's important to understand the **high-level structure** of the workspace's files and directories.

This helps us identify where apps and libs are located, what types of libraries exist, where application assets and configurations (e.g., DEP configs) are stored, as well as where shared resources such as Base CSS styles, TailwindCSS configurations, and other core setup files reside.

```
x/
├── _OBS/                                           // Unused/legacy personal files. 🚫 AI agents MUST ignore this dir entirely (even SKILL.md/AGENTS.md inside it).
│   └── {developer-name}/                           // Holds the individuals or teams' OBS files.
├── .agents/                                        // Holds AI Agents related files (holds e.g., Skills, Hooks).
│   ├── _team/                                      // Committed state (prefs, registries), mirroring this dir: `_team/{kind}/{name}/`, e.g. `_team/skills/x-…/`. Gitignored counterpart: `_local/`.
│   ├── hooks/                                      // Holds our hook scripts — canonical for every agent; each agent's own settings file registers them.
│   └── skills/                                     // Holds our skills — canonical; some agents need a pointer stub in their own dir.
├── .claude/                                        // Holds Claude Code's own files (its settings, and the skill pointer stubs it needs).
│   └── plugins/                                    // Our plugin catalog (`marketplace.json`): pins the third-party plugin versions this repo runs, and lists any plugin we author. Plugin CODE is never committed here — installs land in the per-machine cache.
├── apps/                                           // Holds our apps.
├── apps/{app-name}/
│        ├── src/                                   // Holds the app's web source files (holds e.g., `index.html`, `main.ts`, and etc.)
│        │   ├── {prefix}assets/                    // Holds the app's assets, such as PWA icons, in-app icons/images, and etc.
│        │   │   ├── icons/                         // Holds the app's PWA icons.
│        │   │   ├── images/                        // Holds the app's in-app icons/images.
│        │   │   ├── DEP_config.development.json    // Holds the app's DEP config file (for development).
│        │   │   ├── DEP_config.json.json           // Holds the app's DEP config file.
│        │   │   └── DEP_style.css                  // Holds the app's DEP styles file (which holds the app's custom CSS variables and styles).
│        │   └── environments/                      // Holds the app's environment files.
│        └── requirements/                          // 🆔 The app's unit-test FR/BR registry (`APP-…` IDs). An app is not a functionality, so it gets no `docs/x/` specs.
├── apps/{app-name}-e2e/                            // Holds an app's e2e project (one per app).
│        ├── src/                                   // Holds the e2e specs, Page Objects (`support/page/`), and fixtures (`fixtures/`).
│        └── user-stories/                          // 🆔 The app's User Story (US) registry — a `describe` in any of its specs cites a US ID from here.
├── dist/apps/{app-name}/
│             ├── browser/                          // Holds the distribution files of an app.
│             └── server/                           // Holds the build-time generated files of an app which has app-shell. Can be deleted!
├── docs/                                           // Holds the workspace documentation — one folder per area (see this repo's README for the full index).
│   ├── agents/                                     // Holds the AI-agent docs: the Superpowers workflow paths, their shared rules and notation, and how to edit `AGENTS.md` / `CONTEXT.md`.
│   ├── superpowers/                                // Superpowers cycle artifacts (tracked defaults). Not the product PRD/TSD — those win on conflict.
│   │   ├── specs/                                  // `brainstorming` design docs (`YYYY-MM-DD-<topic>-design.md`).
│   │   └── plans/                                  // `writing-plans` implementation plans (`YYYY-MM-DD-<feature-name>.md`).
│   └── x/{domain}/{functionality-name}/            // Holds ONE functionality's specs, nested under its domain (`shared` or one app).
│       ├── PRD/                                    // 🆔 Product spec: the Acceptance Criteria (AC) an e2e `it` cites.
│       └── TSD/                                    // 🆔 Technical spec, per lib type per live version: the FRs (`describe`) and BRs (`it`) a unit test cites, plus the README's ID Index.
├── fin/apps/{app-name}/                            // Holds the final distribution files of an app (autmation tools may use them).
├── libs/                                           // Holds our libs.
│   ├── {app-name}/                                 // Holds libs of a specific app.
│   │   ├── data-access/                            // Holds 'data-access' lib of an app (holds e.g., 'users.actions.ts' and other NgRx files).
│   │   ├── feature/                                // Holds 'feature' lib of an app (holds e.g., 'profile-image.component.ts').
│   │   ├── map/                                    // Holds 'map' libs of an app (holds e.g., 'users.ts' file).
│   │   ├── page/                                   // Holds 'page' lib of an app (holds e.g., 'users.component.ts' and child pages).
│   │   ├── ui/                                     // Holds 'ui' lib (sometimes non-technology related lib) of an app (holds e.g., 'header.scss' file).
│   │   └── util/                                   // Holds 'util' lib of an app (holds e.g., 'users.service.ts' file).
│   └── shared/                                     // Holds shared libs (such as 'feature', 'ui', 'data-access', 'util', and 'map') across apps & other libs.
│       ├── api/                                    // Holds shared 'api' libs.
│       ├── map/ng-config                           // Holds shared DEP config API & Map interfaces (holds e.g., `V2Config_ApiDep` and `V2Config_MapDep`).
│       ├── ui/base                                 // Holds shared Base CSS styles. i.e., the styles that are applied on `html` and `body`, and available root CSS variables (such as `--e-primary-color`)
│       ├── ui/tailwindcss                          // Holds shared Base TailwindCSS config (`preset-tailwind.config.js`) and Base CSS styles and classes that use TailwindCSS `@apply` (such as `.e-container`).
│       ├── util/ng-bases                           // Holds shared Base classes for different types of libs.
│       └── util/ng-bases-model                     // Holds shared Base interfaces/types/mocks for different types of libs.
├── tools/                                          // Holds the NX workspace executors, generators, and some useful scripts that can act on our code base.
│   └── jest/                                       // Holds jest preset configs that will be read by `jest.preset.js`.
├── .eslintrc.json                                  // Defines the Eslint rules (library types constraints).
├── AGENTS.md                                       // Defines the AI agents' settings and instructions. Standing team `pref.*` values live here.
├── AGENTS.local.md                                 // Personal overlay on `AGENTS.md` (gitignored). Free-form; may restate `pref.*` keys.
├── CLAUDE.md                                       // Claude Code's entry point — it delegates to `AGENTS.md` (and `AGENTS.local.md`). Other AI tools read `AGENTS.md` directly.
├── CODEOWNERS                                      // Defines individuals or teams (code-owners) who are expert in a specific code area.
├── CONTEXT.md                                      // Defines the workspace's own vocabulary. Search it for a term in bold ('functionality', 'grab-bag', 'ID registry', 'burned', …) — it is a lookup surface, not a read-through doc.
├── README.md                                       // The repo's front page, and the index of every doc under `docs/`.
├── nx.json                                         // Defines the NX workspace default configurations.
└── tsconfig.base.json                              // Defines the TypeScript configurations and importable libraries alias paths.
```

&nbsp;

**🆔 The ID registries — all one shape.** Every folder marked 🆔 above is an **ID registry**: it holds the requirement IDs that test titles are written against, so that a test always traces back to a documented decision. They all share the same two files, so once you know one you know all of them:

| File           | Holds                                                                                                           |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| `README.md`    | the **live** entries — the only IDs a test may cite                                                             |
| `DECISIONS.md` | the **burned** ones — retired entries (and, per registry, merged ones or rejected approaches), kept for history |

Two rules hold across all of them: a requirement that no longer exists is **moved** to `DECISIONS.md`, never deleted; and its **number is never reused**, so an ID found in an old test title, commit or review comment always resolves to exactly one thing.

**One registry the tree above is too high-level to show:** a `util` lib's version folder — and each item folder of a grab-bag `ui` / `feature` lib — carries its own `requirements/` beside that folder's inner `README.md` (e.g. `libs/shared/util/ng-formatters/src/lib/date-format-v1/requirements/`). A new version folder starts by copying its predecessor's `DECISIONS.md`, because the ID key does not carry the version.

**Which lib gets which registry** is decided by lib type, not by location — that belongs to [library-types-and-their-relationship.md](../getting-started/library-types-and-their-relationship.md), which is authoritative on it. In short: a **functionality** (`map` / `data-access` / single-purpose `ui` / `feature` / `page`) gets `docs/x/{domain}/{name}/`; a `util`, product `app`, or grab-bag item gets a local `requirements/`; an `api` lib gets neither.

[🔙](../../README.md#introduction)
