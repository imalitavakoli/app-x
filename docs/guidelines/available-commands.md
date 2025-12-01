[🔙](../../README.md#guidelines)

# Available commands 🏃

There are numerous commands available to assist you in development and generating new content. Below, we highlight some of the most useful ones.

&nbsp;

[🔝](#available-commands-🏃)

## Updating the whole workspace

To keep the workspace dependencies up to date and take advantage of the latest standards in the technologies you're using, it's recommended to update the entire workspace from time to time. This section explains how to do it.

### Workspace Specialist: How to update the whole workspace

- Update your machine's globally installed [Node.js](https://nodejs.org/en), [pnpm](https://pnpm.io/), and [NX](https://nx.dev/) versions.

- Run `nx migrate latest` to prepare the workspace for an automatic update to the latest version of frameworks, dependencies, libraries, codes, and configurations. After running this command, `package.json` will be modified, and `migrations.json` will be generated (if there are pending migrations). No other changes will occur.

- Run `pnpm install` to update the installed local dependencies.  
  **Tip!** Before running this command, feel free to delete your previously saved `pnpm-lock.yaml` file. Because we're going to do a major update on almost all of the dependencies.

- Run `pnpm exec nx migrate --run-migrations` to update the workspace files!  
  **Note!** Before executing this command, review the `package.json` and `migrations.json` files to ensure their contents are appropriate. Only then should you proceed to run this command to update everything. Finally, you can remove the `migrations.json` file as it's no longer needed.

- _Optional!_ Run `pnpm exec nx migrate --run-migrations --interactive` for a more interactive update process! Sometimes you may need to temporarily opt-out from certain migrations if the workspace isn't ready. By using the `--interactive` flag (or manually adjusting `migrations.json`), you can select which migrations to accept.

- _Optional!_ Run `pnpm exec nx migrate --run-migrations --create-commits` to update the workspace and create commits for each step! Depending on the update size and workspace, the migration process may generate numerous changes requiring review. With the `--create-commits` flag, NX will automatically create a separate commit for each successfully completed migration (with a default commit prefix of `chore: [nx migration]`). This not only distinguishes NX migration commits from manual file edits, but also ensures each step of the migration has passed tests successfully.

### Workspace Specialist: What should be considered

When migrating the workspace, not all dependencies in the `package.json` file may be updated to their latest major versions. So before running `pnpm install` command, you may need to write their latest version in `package.json` file manually. Here are some notes to keep in mind:

- Whenever you wanna update a dependency, run `pnpm info <package> version` to see what is your target's package's latest version, in order to write that specific version in `package.json` file.
- Remember to update `@angular-builders/custom-webpack`, and `@angular/cli` to match with the major version of `@angular/core`.
- **Capacitor/Ionic related updates**: Whenever updating Capacitor plugins, it's worthy to also update `@capacitor/assets`, `@capacitor/cli`, `@ionic/angular`, and `ionicons`.
- **Tailwindcss related updates**: Whenever updating `tailwindcss`, it's worthy to also update `tailwindcss-scoped-preflight`, `prettier-plugin-tailwindcss`, `@tailwindcss/forms`, and `daisyui`.
- **Transloco related updates**: Whenever updating `@jsverse/transloco`, it's worthy to also update `@jsverse/transloco-keys-manager`.

**Note!** Of course, after updating dependency packages to their latest versions (such as Capacitor or TailwindCSS), you should also review their '_Upgrade Guides_'. This will help you identify any required changes in related workspace files and be aware of potential breaking changes.

**Note!** After completing the migration, make sure to serve apps to confirm everything works as expected. It's also a good idea to test the generation commands to ensure that libs and components can still be generated normally.

### How to update the whole workspace as a team member

After the Workspace Specialist updates the workspace and merges the changes into 'master', you, as a team member, should also update the dependencies on your machine:

- Update your machine's globally installed [Node.js](https://nodejs.org/en), [pnpm](https://pnpm.io/), and [NX](https://nx.dev/) versions to match with the versions that the Workspace Specialist specifies. e.g., if the NX version should be 21.5.1, you can run `npm install -g nx@21.5.1` (or `npm add --global nx@21.5.1`) to install the exact version.
- Run `pnpm install --frozen-lockfile` to update the installed local dependencies.

&nbsp;

[🔝](#available-commands-🏃)

## Commands schema

All of the available commands in the workspace are based on the following schema.

**Note!** NX calls commands that need to be run as 'targets' in `nx.json` and `apps/{app-name}/project.json`. Each target will be run by an executor, and each executor has its own options.

- Run `nx run [project]:[target]` to run an executor. i.e., run the targets (tasks) that are defined in `nx.json` and `apps/{app-name}/project.json`.  
  e.g., `nx run ng-boilerplate:build`.

- _Optional!_ Run `nx [target] [project]` to again run an executor (alternative way), as long as the target name doesn't conflict with an existing NX CLI target.  
  e.g., `nx build ng-boilerplate`.

- _Optional!_ Run `nx [target] [project] --configuration=[configuration]` to run an executor with a specific configuration.  
  e.g., `nx build ng-boilerplate --configuration=production`.

- _Optional!_ Run `nx [target] [project] --[optionNameInCamelCase]=[value]` to run an executor with a specific option.  
  e.g., `nx build ng-boilerplate --outputPath=some/other/path`.

If we like to run our own custom target that needs to run a single shell command, our `apps/{app-name}/project.json` 'targets' section, should look like the following.

```json
"targets": {
  "my-simple-command": {
    "executor": "nx:run-commands",
    "options": {
      "command": "ls apps"
    }
  }
}
```

There is a shorthand for the `nx:run-commands` executor, so alternatively our `apps/{app-name}/project.json` can look like the following. [Click here](https://nx.dev/reference/project-configuration#external-dependencies) to learn more.

```json
"targets": {
  "my-simple-command": {
    "command": "ls apps"
  }
}
```

- Run `nx run-many -t [target1] [target2] -p [project1] [project2]` to run multiple targets in parallel for some projects.  
  e.g., `nx run-many -t build test lint -p ng-boilerplate`.

- Run `nx run-many -t [target1] [target2]` to run multiple targets in parallel for all projects.

&nbsp;

**Note!** In `apps/{app-name}/project.json` we can define our app's 'targets' and their dependencies. For example, our app may depend on a library _(Project Graph: app -> lib)_. However, when we run `nx run-many -t build -p app lib`, the build task will run in parallel for both the app and the lib _(Current Task Graph: app, lib)_. But in 'targets', we can change this behavior and instruct NX to run the build task of the lib before running the app build task _(Supposed Task Graph: app > lib)_. How can we achieve this? By modifying our build task options as follows: `"build": {"dependsOn": ["^build"], ...}`.

&nbsp;

[🔝](#available-commands-🏃)

## Useful

- Run `nx list` to get a list of available plugins.

- Run `nx graph` to run the monorepo graph. It shows you your apps and libs, and their relationships with each other.

- Run `nx graph --file=output.json` to export the monorepo graph to JSON.

- Run `nx test projname` to run project's tests.

- Run `nx lint projname` to run project's linting.

- Run `nx e2e projname-e2e` to run project's e2e tests.

- Run `nx g @nx/workspace:move --project=libname --destination=new/path` to move a lib to a new location in the workspace. You don't need to be too anxious about choosing the exact right folder structure for your libs from the beginning! As your workspace grows, you may need to move stuff around, and you can do that simply by calling this command.

&nbsp;

[🔝](#available-commands-🏃)

## Angular related

Here are the Angular related commands.

&nbsp;

### General

- Run `nx list @nx/angular` to get a list of all available commands that you can run for Angular apps or libraries.

- Run `nx g @nx/angular:app-shell --project=appname` to add [app-shell](https://angular.io/guide/app-shell) to an app.

- Run `nx g @nx/angular:setup-tailwind appname` to generate [Tailwind CSS](https://tailwindcss.com/) configuration for an app.  
  **Note!** We only need to configure 'Tailwind CSS' for our apps and not libs. Why? Because when we generate the 'Tailwind CSS' files by running this command, NX itself configures `apps/{app-name}/tailwind.config.js` file in a way that it can also read the libs that get lazy loaded inside of our app.

&nbsp;

- Run `nx g @nx/angular:storybook-configuration projname` to generate [StoryBook](https://storybook.js.org/) configuration for a project (app or lib).  
  **Tip!** We add stories only for 'feature' and 'ui' libs most of the times. Why? Because apps themselves don't have any component (as they lazy load pages from their own related libs), and other types of libs (such as 'data-access' or 'util' libs) are not UI (User Interface) related!

- Run `nx g @nx/angular:stories projname` to generate stories for any other components that have been added to a project later on.

**Tip!** As we already know, for serving an app we can run `nx serve appname`. But to visit the served app on your mobile devices (you may need it for the times that you're developing mobile apps), you can (1) run `ipconfig` and see what's your machine's local IP address (IPv4 Address / Wi-Fi interface's local IP); (2) then run `nx serve appname --host 0.0.0.0 --disable-host-check --port 4200`. In this way, you can visit `http://192.168.x.x:4200` on your mobile device's browser to visit the locally served app.

&nbsp;

### Generating apps

- Run `nx g @nx/angular:app --name=appname --directory=apps/appname` to generate an Angular app in the `apps` folder of the workspace.  
  **Note!** By default 'ESLint' linter, 'Jest' unit test runner, and 'Cypress' E2E test runner will be generated for the app. You can run the following commands: `nx serve appname`, `nx build appname`, `nx test appname`, `nx lint appname`, `nx e2e appname`.

&nbsp;

### Generating libs

- **'api' lib**: Run `nx g @nx/angular:lib --name=shared-api-feature-ng-controllers --directory=libs/shared/api/feature-ng-controllers --tags=type:api,type:api/feature,domain:shared` to generate a lib named 'feature-ng-controllers' as a 'api' lib.

- **'page' lib**: Run `nx g @nx/angular:lib --name=appname-page-items --routing --lazy --directory=libs/appname/page/items --parent=apps/appname/src/app/app.routes.ts --tags=type:page,domain:appname` to generate a lib named 'items' as a 'page' lib. This lib is app specific (as the project's name & path shows) and acts as a 'view' (page) in the app.  
  **Note!** Pages can have multiple components inside of themselves and have child routes to load each component in a single route.  
  **Tip!** According to the options we pass through when running the command, NX may not be able to update `apps/{app-name}/src/app/app.routes.ts` file correctly, so that the app's route file can refer to the page's route file's route array! So we should edit the app's route file manually then.  
  **Tip!** For generating a shared page, we can run `nx g @nx/angular:lib --name=shared-page-ng-items --routing --directory=libs/shared/page/ng-items --tags=type:page,domain:shared`.

- **'feature' lib**: Run `nx g @nx/angular:lib --name=shared-feature-ng-chart --directory=libs/shared/feature/ng-chart --tags=type:feature,domain:shared` to generate a lib named 'chart' as a 'feature' lib.  
  **Note!** In the above example, we generated a shared Angular lib. Of course if we were generating an app specific lib, then the lib name was `appname-feature-chart` and its directory was `libs/appname/feature/chart`. See? In such case, we eliminate the `ng` prefix from the lib name and directory, because the lib is already under an Angular app folder. This is true about any other type of libs.

- **'ui' lib**: Run `nx g @nx/angular:lib --name=shared-ui-ng-button --directory=libs/shared/ui/ng-button --tags=type:ui,domain:shared` to generate a lib named 'button' as a 'ui' lib.

- **'data-access' lib**: Run `nx g @nx/angular:lib --name=shared-data-access-ng-config --directory=libs/shared/data-access/ng-config --tags=type:data-access,domain:shared` to generate a lib named 'config' as a 'data-access' lib.  
  **Note!** '_data-access_' libs usually only hold NgRx feature state codes.

- **'util' lib**: Run `nx g @nx/angular:lib --name=shared-util-formatters --directory=libs/shared/util/formatters --tags=type:util,domain:shared` to generate a lib named 'formatters' as a 'util' lib.  
  **Note!** In the above example, we generated a shared non-technology related (non-Angular) lib which just simply holds some utility functions. Of course if we were generating an Angular utility lib (such as a service), then the lib name was `shared-util-ng-formatters` and its directory was `libs/shared/util/ng-formatters`.

- **'map' lib**: Run `nx g @nx/angular:lib --name=shared-map-ng-config --directory=libs/shared/map/ng-config --tags=type:map,domain:shared` to generate a lib named 'config' as a 'map' lib.

&nbsp;

**Important!** When we generate an Angular lib, the command itself may automatically (depending on the options we pass through) generate a component or `*.module.ts` file inside the lib for us as well. However, for '_data-access_', '_util_', or '_map_' libs, we don't need such files! We can simply delete them and instead generate our own Angular services or paste our own NgRx codes inside those libs to handle our desired jobs.

&nbsp;

### Generating components, services, directives, pipes, and other stuff in apps or libs

Now that we have our apps and libs, we can generate stuff inside them!

**Tip!** As we will explain in the '_FAQ about some directories & files_' section about the `apps` & `libs` directory, we should generate other stuff in the `libs` folder most of the time, rather than the `apps` folder.

- Run `nx g @nx/angular:component my-component --directory=libs/collective/type/projdirname/src/lib` to generate a **component**.  
  **Note!** By running `nx g`, you are actually running the generator command of NX itself. `@nx/angular` specifies the name of the plugin installed in the workspace, and `:component` specifies the name of the generator.

- Run `nx g @nx/angular:service my-service --project=libname` to generate a **service**.  
  **Note!** This command actually falls back to `@schematics/angular`! If you try to invoke a generator that is not present in `@nx/angular`, the request will automatically be forwarded to `@schematics/angular`.

- Run `nx g @nx/angular:directive my-directive --directory=libs/collective/type/projdirname/src/lib` to generate a **directive**.

- Run `nx g @nx/angular:pipe my-pipe --directory=libs/collective/type/projdirname/src/lib` to generate a **pipe**.

- Run `nx g @nx/angular:guard my-guard --project=libname --implements=CanActivate` to generate a **guard**.

- Run `nx g @nx/angular:interceptor my-interceptor --project=libname` to generate a **interceptor**.

&nbsp;

### Generating NgRx (our apps' root store & state feature) related files

[NgRx](https://ngrx.io/docs) is a reactive State management system for Angular apps.

Here's how NgRx works in simple terms:

- We create a store, i.e., a place where our data is stored (`apps/{app-name}/src/app/+state/index.ts`).
- Our store holds our whole app state (Object), and app state holds features that are reducers (the type of each key in our Object is a reducer).
- Each feature can be selected in our components, so that it can be shown somewhere in our templates.
- Components, based on their logic, can dispatch different actions.
- Now features, whose type is actually reducers, are always listening to those actions.
- So when an action occurs, the reducer that is listening to that specific action changes its initial state (do synchronous task).
- Eventually, when the initial state of a selected feature changes, the template gets updated. And that's it!
- Optionally, there might be effects! They are also listening to actions, and can do asynchronous tasks.

&nbsp;

- Run `nx g @nx/angular:ngrx-root-store appname` to add NgRx Root Store to our apps. i.e., the targeted app's `apps/{app-name}/src/app/app.config.ts` file will be modified.

- Run `nx g @ngrx/schematics:feature +state/statename --project=libname` to generate NgRx app state related files. i.e., we generate the state's files in a '_data-access_' lib that we've already generated (we should have run Angular lib generation command already to host our NgRx files inside it), and refer to the `reducer` object and `State` interface inside the `state-name.reducer.ts` file in our app's global store (`apps/{app-name}/src/app/+state/index.ts`).

- Run `nx g @nx/angular:ngrx-feature-store items --facade --parent=libs/appname/page/items/src/lib/lib.routes.ts` to add NgRx Feature Store to our '_page_' libs.  
  **Tip!** In this example, we used `items` name as our lib name.  
   **Note!** After running this command, our lib's `libs/{app-name}/page/items/src/lib/lib.routes.ts` file will be modified, and `+state` folder (with all of the NgRx codes inside it) and `items.models.ts` file will be created beside the `lib.routes.ts` file. Now we can simply cut them (`+state` folder and `items.models.ts` file) and put them in our related '_data-access_' lib (`libs/{app-name}/data-access/items/src/lib`) directory. Why do that? To keep things in their place! A '_page_' lib is only responsible for holding an app's page (and its own child pages), and a '_data-access_' lib is only responsible for holding that page's feature store.

&nbsp;

### Schema

- Run `pnpm add [package] && nx g [package]:ng-add --project=[app-name]` to install an Angular library in one of the existing Angular projects.

- _Optional!_ Run `nx g @nx/angular:component [my-component] --project=[lib-name] --dry-run` to just see the command's reports activity without running the command for real! i.e., by adding `--dry-run` flag to our command, we can see what files the command is going to change in our project if we call it without the flag.

- **Generating a lib schema**: Run `nx g @nx/angular:lib collective-type-name --directory=libs/collective/type/name` to generate an Angular lib in the `libs` folder of the workspace.  
  **Important!** The name schema `collective-type-name` is used for the lib. We should stick to this pattern to create unique project names within our workspace. `collective` can be one of the following: `shared, app-name`. `type` can be one of the following: `feature, page, data-access, map, ui, util`.  
  **Note!** By default 'ESLint' linter, 'Jest' unit test runner will be generated for the lib. The generated component inside of the lib will be standalone and use `.scss` styles. And you can run the following commands for it: `nx test lib-name`, `nx lint lib-name`.

&nbsp;

[🔝](#available-commands-🏃)

## Generating non-technology related libs

Here are the commands to generate vanilla JavaScript libs. Such libs can hold `.js`, `.ts`, `.css`, and `.scss` files inside of themselves and get shared among different apps and libs.

- Run `nx g @nx/js:library shared-ui-not-found --directory=libs/shared/ui/not-found --tags=type:ui,domain:shared` to generate a lib named 'not-found' as a 'ui' lib. This lib is not app specific.  
  **Tip!** Obviously if the 'ui' lib you're going to generate doesn't have a JS or TS file (only contains styles), its alias name path in the `tsconfig.base.json` file is not needed.

- Run `nx g @nx/js:library shared-util-detect-device --directory=libs/shared/util/detect-device --tags=type:util,domain:shared` to generate a lib named 'detect-device' as a 'util' lib. This lib is not app specific.

&nbsp;

**Note!** Non-technology related 'ui' libs usually hold `.css` or `.scss` files. So we can just simply delete the auto-generated `.ts` class that the command generated for us. Obviously we can delete all of the '_testing_', '_eslint_', and '_tsconfig_' files (and just keep `project.json` and `README.md`). Of course, we can also remove the alias name path to the lib that has been automatically added in the `tsconfig.base.json` file. Now instead of all of those files, we can put our own style files in the `libs/shared/ui/{lib-name}/src/lib/{version}` folder. And inside of the `libs/shared/ui/{lib-name}/src/lib/{version}` folder, we can have an `index.scss` file that simply imports all of the UI `.scss` files. Then this `index.scss` file can be used inside of other projects (apps or libs).

**Tip!** How to use non-technology related 'ui' libs (that hold style files) inside of our Angular apps or libs? The Angular projects must add `stylePreprocessorOptions` option in their `project.json` file:

```json
"targets": {
  "build": {
    "options": {
      "stylePreprocessorOptions": {
        "includePaths": [ "libs/shared/ui" ]
      }
    }
  }
}
```

Then we can import the UI styles in the project's `.scss` files: `@use '{lib-name}/src/lib/{version}';`.

The `stylePreprocessorOptions` option with its child option (`includePaths`) actually tells that whenever we are building the project, it should prefix the paths that we've provided whenever it's importing a `.scss` file. It acts as an alias.

&nbsp;

[🔝](#available-commands-🏃)

## _Optional!_ Installing & connecting to NX Cloud

NX understands our apps' structure and their dependencies. For example, it knows that our A app depends on B lib, so if we wanna build our A app, the B lib must get built first! NX knows what to build first and caches the built data, so next time that we wanna build our app, it gets built faster! Now NX offers another service called "[NX Cloud](https://nx.dev/nx-cloud/intro/what-is-nx-cloud)"! It enables free distributed computation caching.

NX Cloud has free and priced plans. So anyhow... If we'd like to have it for our repo, we can install it like this:

- Run `nx connect` to install the latest version of `nx-cloud` in the workspace, connect to the NX Cloud Account, and enable DTE in [the CI workflow](https://nx.dev/recipes/ci). [Click here](https://nx.dev/core-features/distribute-task-execution) to learn more.

- _Optional!_ Run `nx connect-to-nx-cloud` to connect the workspace to the NX Cloud Account. [Click here](https://nx.dev/core-features/remote-cache) to learn more.

Now, what if we were using NX Cloud, made a PR to our repo, and would like to build, test, or run any other targets for all of our projects that have been affected by our update in the codes? That's when the `nx affected` command can be helpful:

- Run `nx affected -t [target1] [target2]` to run multiple targets in parallel for all affected projects, NOT all projects! For example, if you have lots of apps & libs in our workspace. Now you have edited one of your libs and made a PR for your Git repo, and would like to run your test task to test all of the apps and other libs that are depending on that... Because you may not want to mention each project one by one in your command... Right? So shall you run `nx run-many -t test`? Nope, because the workspace is big, and this command can take so much time! So what shall you do? You can run `nx affected -t test`! NX behind the scenes knows your Project Graph: _( (app1, app2) -> lib )_, so it itself will run `nx run-many -t test -p app1 app2 lib` command for you! Easy and nice!

- Run `nx affected:graph` to see what is affected by our PR.

- Run `nx affected:test` to run tests for current changes.

- Run `nx affected:e2e` to run e2e tests for current changes.

**Tip!** Although NX Cloud and its distributed computation caching can be fun, companies need to investigate whether it's something that they really need to go for or not, according to many factors, such as their current requirement, budget, CI workflow, and app development process.

**Note!** Let's also mention that NX Cloud can shine if we wanna build all of our projects at once... If all we want is to just build projects independently, then build times may not take too long even without NX Cloud.

[🔙](../../README.md#guidelines)
