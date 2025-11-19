# Prompt Angular Executor: Build app FIN files

**Version:** 1.0  
**Revised:** 2025-11-18

---

&nbsp;

## Workspace specification

Workspace is a NX monorepo.
I have done the following:

- I generated a plugin in the workspace by running: `nx g @nx/plugin:plugin tools/ng-app-build-fin`. That's why you can see `tools/ng-app-build-fin` folder.
- I created an executor by running: `nx generate @nx/plugin:executor tools/ng-app-build-fin/src/executors/echo`. That's why you can see`tools/ng-app-build-fin/src/executors/echo/echo.ts` file.

&nbsp;

## Your Role

You are a NX monorepo specialist who can code NX executors in the workspace, according to this documentations: https://nx.dev/docs/extending-nx/local-executors

&nbsp;

## Workflow

- Read 'What to do' section.
- Understand what files should be updated/created.
- Understand what files you should read from.
- Start updating files based on your priority and understanding.
- Review the updated/created files to check for any probable errors/problems, and try to fix them (repeat this step until all errors/problems are fixed).

**Tip!** Do not ask me any further questions along the way, unless you're missing a file or you're feeling unclear about something that you have to do.

## What to do

Update `echo.ts` file of the executor (and other executor related files, such as `schema.d.ts` and `schema.json`) to do the steps explained below, when `runExecutor` function is called with the provided `options` argument.

**Tip!** Take care of each step in its own encapsulated function (create a new util file to keep all encapsulated function in it, if you wish).

### Step 1: Check `options` properties

Here are the `options` properties:

- `changelog` (required): Path to the CHANGELOG file of the project.
- `environmentsPath` (required): Path to the environments folder of the project which holds environment files such as `environment.development.ts`, `environment.ts`, etc.
- `projectName` (required): Project name.
- `projectBuildTarget` (required): Project build command (target) to run and compile the project.
- `handleGit` (optional, default is `false`): Define whether the Git related steps should be completed or skipped.

Check the `options` object, and based on that, do the following:

- If all required properties exist, continue.
- If not, stop the whole `runExecutor` process, as it failed.

### Step 2: (Git) Create FIN branch

Check the `options.handleGit` property, and based on that, do the following:

- If it's true, continue.
- It it's false, skip this step.

FIN branch naming convention: `[project-name]/v[x.x.x]`. e.g., `ng-boilerplate/v1.0.0`.

What's the project name?  
It's in `options.projectName` property.

What's the latest project's version?  
You can read it from the CHANGELOG. Find the latest project version that is mentioned beside the release date. e.g., `[2.0.0] - 2025-11-18`.

Continue to do the following:

- Create the FIN branch from the current branch.
- Switch to the FIN branch.
- Set the upstream branch (if you could without any errors).

### Step 3: Update environments files

For each file that can be founded in the environments folder (`options.environmentsPath`), do the following steps:

- If `environment` const could not be found, stop here (i.e., skip the current file's modifications).
- If `environment.version` property could not be found, stop here (i.e., skip the current file's modifications).
- If you're here in this step, it means that the previous steps are passed. So update the value of `version` property to put the latest project version that you previously have found in the CHANGELOG file.

### Step 4: Build project

Compile a new version of the project by running another executor:

- Call `runExecutor` (which is imported from `@nx/devkit`).
- Wait (`await`) until that function is done.

**FYI:** Another executor can run like this:

```ts
await runExecutor(
  { project: options.projectName, target: options.projectBuildTarget },
  {},
  context,
);
```

After running another executor, based based on that, do the following:

- If the executor could run successfully, continue.
- If not, stop the whole `runExecutor` process, as it failed.

### Step 5: Delete old FIN files

FIN folder path: `fin/apps/[project-name]/browser`. e.g., `fin/apps/ng-boilerplate/browser`.  
Delete everything in there, except `web.config` and `.htaccess` files (if they exist).

**FYI:** FIN folder holds the previous compiled files of the project.

### Step 6: Copy new dist files

dist folder path: `dist/apps/[project-name]/browser`. e.g., `dist/apps/ng-boilerplate/browser`.  
Copy everything from dist folder to the FIN folder.

### Step 7: (Git) Commit changes

Check the `options.handleGit` property, and based on that, do the following:

- If it's true, continue.
- It it's false, skip this step.

Commit message naming convention: `[project-name]/v[x.x.x]: [description]`. e.g., `ng-boilerplate/v1.1.0: updated auth page`.

Where's the commit message 'description' part?  
You can read it from the CHANGELOG, under the latest project version.  
The 'description' shouldn't be more than 50 characters. If it is, then truncate it.

Continue to do the following:

- Commit the changes.
- Push the changes (if you could without any errors).

&nbsp;

## Conclusion

We're done! Eventually we can finish the whole `runExecutor` process, as it succeeded (if it is not already stopped in one of the above steps).
