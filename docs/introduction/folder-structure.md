[🔙](../../README.md#introduction)

# Folder structure 📁

**How the workspace apps run?** The building tool (CLI), reads `apps/{app-name}/project.json`, and that file has already defined the following inside of itself: `apps/{app-name}/src/main.ts` as the main file to load the app codes, and `apps/{app-name}/src/index.html` as the index file to bring up the app itself.

Below we have drawn only the map of important files and directories.

```
x/
├── _OBS/                     // Individuals or teams can freely put any unused files of their own in here.
├── apps/                     // Holds our apps.
├── dist/apps/{app-name}/
│             ├── browser/    // Holds the distribution files of an app.
│             └── server/     // Holds the build-time generated files of an app which has app-shell. Can be deleted!
├── fin/apps/{app-name}/      // Holds the final distribution files of an app (autmation tools may use them).
├── libs/                     // Holds our libs.
│   └── {app-name}/           // Holds libs of a specific app.
│   │   ├── data-access/      // Holds 'data-access' lib of an app (holds e.g., 'users.actions.ts' and other NgRx files).
│   │   ├── feature/          // Holds 'feature' lib of an app (holds e.g., 'profile-image.component.ts').
│   │   ├── map/              // Holds 'map' libs of an app (holds e.g., 'users.ts' file).
│   │   ├── page/             // Holds 'page' lib of an app (holds e.g., 'users.component.ts' and child pages).
│   │   ├── ui/               // Holds 'ui' lib (sometimes non-technology related lib) of an app (holds e.g., 'header.scss' file).
│   │   └── util/             // Holds 'util' lib of an app (holds e.g., 'users.service.ts' file).
│   └── shared/               // Holds shared libs (such as 'feature', 'ui', 'data-access', 'util', and 'map') across apps & other libs.
│       └── api/              // Holds shared 'api' libs.
├── tools/                    // Holds our probable NX workspace related codes.
├── .eslintrc.json            // Defines the Eslint rules.
├── CODEOWNERS                // Defines individuals or teams that are expert in a specific code area.
├── nx.json                   // Defines the workspace default configurations.
└── tsconfig.base.json        // Defines the TypeScript configurations.
```

[🔙](../../README.md#introduction)
