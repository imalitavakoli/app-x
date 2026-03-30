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
├── _OBS/                                           // Individuals or teams can freely put any unused files of their own in here.
│   ├── obs.settings (or __obs.settings)            // Holds the settings for `_OBS` directory.
│   └── {developer-name}/                           // Holds the individuals or teams' OBS files.
│       └── AGENTS.md (or __AGENTS.md)              // Holds the individuals or teams' personalized agent file.
├── apps/                                           // Holds our apps.
├── apps/{app-name}/
│        └── src/                                   // Holds the app's web source files (holds e.g., `index.html`, `main.ts`, and etc.)
│            ├── {prefix}assets/                    // Holds the app's assets, such as PWA icons, in-app icons/images, and etc.
│            │   ├── icons/                         // Holds the app's PWA icons.
│            │   ├── images/                        // Holds the app's in-app icons/images.
│            │   ├── DEP_config.development.json    // Holds the app's DEP config file (for development).
│            │   ├── DEP_config.json.json           // Holds the app's DEP config file.
│            │   └── DEP_style.css                  // Holds the app's DEP styles file (which holds the app's custom CSS variables and styles).
│            ├── environments/                      // Holds the app's environment files.
│            ├── environments/                      // Holds the app's environment files.
├── dist/apps/{app-name}/
│             ├── browser/                          // Holds the distribution files of an app.
│             └── server/                           // Holds the build-time generated files of an app which has app-shell. Can be deleted!
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
├── .eslintrc.json                                  // Defines the Eslint rules (library types constraints).
├── CODEOWNERS                                      // Defines individuals or teams (code-owners) who are expert in a specific code area.
├── nx.json                                         // Defines the NX workspace default configurations.
└── tsconfig.base.json                              // Defines the TypeScript configurations and importable libraries alias paths.
```

[🔙](../../README.md#introduction)
