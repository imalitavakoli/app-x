[🔙](../../README.md#guidelines)

# PR (Pull Request) Rules 📏

**Our workspace is like a city**! It has rules to keep it clean and functional. Without these rules, our city would be a mess! **Our city is our home** 🏠  
In this documentation, we are explaining all rules of our workspace, such as folder structures, naming conventions, best practices for writing comments, and more. Making PRs and code modifications is no exception. So in this section, we discuss these rules.

&nbsp;

[🔝](#pr-pull-request-rules-📏)

## Code Modification PRs

Here's the process for making source code modification PRs.

&nbsp;

- `1` **Before starting, inform the Workspace Specialist & Code Owners** about the codes you intend to modify. This could be done through a short meeting, a written message, or a screencast explaining your intentions. As the saying goes, 'two heads are better than one'. Even if you know the standards and how to achieve your goal, seeking advice can still be beneficial.  
  **Tip!** You can skip this step if you are the ONLY Code Owner of the parts you want to modify, even for substantial modifications. However, large modifications (that cannot be broken down into smaller pieces) are rare and should be avoided if possible.

&nbsp;

- `2` **Before beginning your project, check out the workspace's 'shared' libraries**. This involves examining the `libs/shared` directory and `package.json` file. Whether you're building a new app/lib or modifying an existing project, this step helps you familiarize yourself with the latest installed and ready-to-use libraries in the workspace. This way, you can make better coding decisions. For instance, if you need to use a 'LocalStorage' facade, you don't have to reinvent the wheel. You can simply utilize the existing shared '_util_' libraries available in the current workspace.

&nbsp;

- `3` If you're in this step, it means investigations & consultations are already done, and code modifications are needed. So **create a new task** for every semantic (meaningful) modification in our codebase.  
  **Task naming conventions:** `x: [description]`, `x/apps/[short-app-name]: [description]`, or `x/libs/[lib-type]/[short-lib-name]: [description]`. For example, `x: update deps`, `x/apps/boilerplate: add simple auth page`, `x/libs/feature,ui/chart: update readme`.  
  **Tip!** Tasks are usually small. For instance, task `x/apps/boilerplate: add simple auth page` may only modify 7 files and add 4 files.

&nbsp;

- `4` Fetch the latest modifications from the 'master' branch to your local machine, then **create a new branch** from 'master' for every task.  
  **Branch naming convention:** `(task-ticket-num)x:[description]`, `(task-ticket-num)x/apps/[short-app-name]:[description]`, or `(task-ticket-num)x/libs/[lib-type]/[short-lib-name]:[description]`. For example, `(TEA-4600)x:update-deps`, `(TEA-4600)x/apps/boilerplate:add-simple-auth-page`, `(TEA-4600)x/libs/feature,ui/chart:update-readme`.

&nbsp;

- `5` Make your modifications in your branch, and **commit every little semantic modification** with a brief description.  
  **Commit naming convention:** `x: [description]`, `x/apps/[short-app-name]: [description]`, or `x/libs/[lib-type]/[short-lib-name]: [description]`. For example, `x: updated deps`, `x/apps/boilerplate: added simple auth page`, `x/libs/feature,ui/chart: updated readme`.  
  **Important!** If you have updated `package.json` or `pnpm-lock.yaml` files, you must inform the Workspace Specialist or EM (Engineering Manager), because updating the workspace packages is sensitive and might break the pipeline processes (if there's any automation defined).  
  **Note!** Always remember to keep the `README.md` file and documentation of the app/lib you've modified up-to-date. Here's the best practice: (1) Before changing any code, update the docs accordingly; (2) make your code modifications; (3) review the docs again to ensure they reflect the final changes. This way, the documentation stays current.

&nbsp;

- `6` **Switch to the 'master' branch and fetch origin** to ensure you have the latest version of the 'master' branch locally on your machine. Follow these steps:
  - If you already had the latest version, switch back to your own branch and simply create a PR (and add reviewers) to merge your branch with the 'master' branch.
  - If you fetched origin and found yourself behind the latest changes on the 'master' branch, pull origin, switch back to your own branch, merge new commits from 'master' into your own branch, and then: (1) If there were no conflicts, you are ready to create a PR (and add reviewers) to merge your branch with the 'master' branch. (2) If there were conflicts, discuss them with the Code Owner, whom you have conflicts with, to decide whose modifications should be retained.  
    **Tip!** Conflicts rarely occur when developers respect the 'CODEOWNERS' concept and teams are synchronized when working on different parts of the repository.

&nbsp;

- `7` **Inform the Workspace Specialist & Code Owners again before making a PR**. This can be done through a short meeting, written message, or screencast explaining your changes. While some PRs may seem self-explanatory, as our workspace grows, even the smallest changes in the codebase become sensitive and should be thoroughly understood by Workspace Specialist & Code Owners. This approach not only helps Code Owners review your code more easily and quickly but also keeps everyone informed about the latest changes in our workspace.  
  **Tip!** This approach also helps us make better coding decisions in the future. When we explain everything in detail to others, including aspects we didn't initially consider necessary, it helps us remember our actions (facilitating easier and faster coding on the same parts of the project in the future) and prompts us to reconsider our approach. Sometimes, this re-thinking process reveals opportunities for improving our code and prompts us to plan refactoring tasks sooner rather than later.  
  **Tip!** This step should not be skipped in normal/large code modifications, even if you're confident in your understanding. It's generally beneficial to keep this step in place, but you may optionally skip it if (1) you're the ONLY Code Owner of the parts you want to modify, even for substantial modifications, and (2) you're comfortable with the possibility that the other front-end developer you add as the reviewer may not fully understand your code modifications.

&nbsp;

- `8` **Create a PR and add Code Owners as reviewers**. Even if you're the Code Owner, it's beneficial to have another front-end developer familiar with your project review your PR. In the PR description, include: (1) a summary of your changes, (2) any new errors/warnings in UX or during app compilation, and (3) the link to the related task.  
  **Tip!** Remember to delete the branch once it's approved to keep our repository clean without any non-active branches.  
  **Note!** PRs should ideally be small, containing modifications in no more than 20 files. Small PRs are easier and faster to review and merge. If you realize a task is bigger than anticipated, stop adding features and functionalities, make your code stable (ensuring it doesn't introduce bugs when compiled), create your PR, and complete the task. Then start the 'code modification' process again by creating a new task (or tasks) for the remaining work.

&nbsp;

- `9` **Merge your PR** when it's approved by reviewers.  
  **Tip!** Remember to close the source branch after merging.

  After creating your PR:
  - If it's approved by reviewers, proceed to merge it with the 'master' branch.
  - If it's rejected, return to your code, make modifications, commit the changes to update your PR, and mention the reviewer who rejected it in a comment on the PR.

&nbsp;

[🔝](#pr-pull-request-rules-📏)

## FIN PRs

Here we outline the process for creating an app `fin` directory PR.  
In our workspace, releasing a new version of an app involves compiling the app and then copying the compiled files from `dist/apps/{app-name}/browser` to `fin/apps/{app-name}/browser`. Files in the `dist` folder are ignored in git, but files in the `fin` folder are committed. Later on, pipelines (automation tools) can use FIN files to have access to a specific compiled version of an app, in order to change the app's assets and prepare it for different brands (clients).

**Important!** The `fin` folder is updated ONLY when releasing a new version of an app. This means you may need to complete multiple tasks and merge 'Code modification PR' branches before releasing a new version of an app.

**Note!** What is `web.config` in the `fin` folder? It's an XML-based configuration file used in Azure web apps. If the app will be deployed on an Apache-based web server, a `.htaccess` config file should be in the `fin` folder instead.

**Tip!** Depending on your workspace setup, you can delete the `fin` folder and completely skip the 'FIN PR' process described below.

&nbsp;

- `1` **Wait until your last 'Code modification PR' branch is approved and merged with 'master' before proceeding**. If releasing a new version of an app is urgent, contact reviewers to expedite the process.

&nbsp;

- `2` Fetch the latest modifications on the 'master' branch to your local machine, then **create a new FIN branch** from 'master' for each app you want to release its new production version.  
  **FIN branch naming convention:** `[short-app-name]/v[x.x.x]`, for example, `boilerplate/v1.0.0`.  
  **Tip!** It's recommended to follow [Semantic Versioning](http://semver.org/).

&nbsp;

- `3` **Compile the target app**, then:
  - Delete all files in the `fin/apps/{app-name}/browser` directory, except the server config file (typically `web.config` for most apps).
  - Copy all files from `dist/apps/{app-name}/browser` and paste them into the `fin/apps/{app-name}/browser` directory.

&nbsp;

- `4` **Commit the changes and create a 'dev version' tag on the commit**. A 'dev version' tag consists of these parts: (1) the latest version of DEP config in the workspace; (2) the latest version of the compiled app; (3) app's testing revision version number; (4) app's 'soft' release flag.  
  **What is the 'soft' release flag?** It's presented for mobile apps and not web-apps. It specifies whether this version of the app required a full binary compilation (i.e., a native Capacitor plugin is added/removed or native project files updated) or not.  
  **FIN commit naming convention:** `[short-app-name]/v[x.x.x]/r[y]: [description]`, for example, `boilerplate/v1.1.0/r1: updated part 1 of auth page`.  
  **'dev version' tag naming structure:** `DEP-[x.x.x];[app-name]-[y.y.y]-r[z]_soft`, for example, `DEP-1.1.0;ng-boilerplate-1.2.3-r1_soft`, `DEP-1.1.0;ng-boilerplate-1.2.3-r2`, or `DEP-1.1.0;ANY-1.2.3-r1`.

  **In case you want to release a tag for 1+ apps:** It is possible to create multiple tags on top of each other and over one commit.  
  **When to use `ANY` as the app name:** Only when all of the FIN files for all apps are updated.  
  **If the ending `_soft` is not present:** It means that updating to this tag requires a full binary compilation and it's not just a web-base update (i.e., live-update can happen for the mobile app).

&nbsp;

- `5` Now **test the app**.  
  **Important!** After your own testing, wait for ACs & QAs to complete testing and inform you of their results.  
  **Note!** If testing fails, stop the 'FIN' process and start the 'code modification' process... And whenever your new code modifications (in another branch of yours) are merged with 'master', you can whether (1) create a new FIN branch from 'master' and do the 'FIN' process from the beginning; or (2) switch back to your previous FIN branch, fetch the latest changes from 'master', and then continue with your 'FIN' process.

&nbsp;

- `6` After a successful test, because the testing process might have been taken long by ACs (e.g., a couple of days), then to ensure you have the latest version of the 'master' branch locally on your machine, **switch to the 'master' branch and fetch origin** once again. Then repeat the similar workflow you've already done in the step number `6` of 'code modification' process.  
  **Note!** If another developer has already released a new version of the same app you've been working on (and you've been releasing different revision 'dev version' tags for it recently), then your compiled `fin` files may conflict with the newer ones from the 'master' branch. In this case, you can safely discard your local `fin` files and keep the ones from 'master'. You'll regenerate the correct `fin` files anyway in the next step when you recompile the app.

&nbsp;

**Note!** After step number `6`, you can optionally skip step `7`, `8`, and `9` to automatically do them (you still need to continue with the process from step number `10`). Now here's how to skip the mentioned steps: (1) Switch back to 'master' branch, (2) delete the FIN branch that you have created earlier, (3) update app's `CHANGELOG.md` to list the tasks completed in the new version, and (4) run `nx run appname:auto-build-fin --handleGit=false` command of the app (of course the app should already have `auto-build-fin` target) to do the mentioned steps automatically by running an executor that exists in the workspace. It's also worth mentioning that, if you prefer to do those steps manually as well, you can just simply continue to the next step.

&nbsp;

- `7` **Update app's version** by updating its `apps/{app-name}/environments/` files. Also, update its `CHANGELOG.md` to list the tasks completed in the new version.

&nbsp;

- `8` **Compile the target app**, and once again:
  - Delete all files in the `fin/apps/{app-name}/browser` directory, except the server config file (typically `web.config` for most apps).
  - Copy all files from `dist/apps/{app-name}/browser` and paste them into the `fin/apps/{app-name}/browser` directory.

&nbsp;

- `9` **Commit the changes**.  
  **FIN commit naming convention:** `[short-app-name]/v[x.x.x]: [description]`, for example, `boilerplate/v1.1.0: updated auth page`.

&nbsp;

`10` **Create a 'prod version' tag** ONLY on the FIN commit. A 'prod version' tag consists of these parts: (1) the latest version of DEP config in the workspace; (2) the latest version of the compiled app; (3) app's 'soft' release flag.  
 **'prod version' tag naming structure:** `prod_DEP-[x.x.x];[app-name]-[y.y.y]_soft`, for example, `prod_DEP-1.1.0;ng-boilerplate-1.2.3_soft`.  
 **Tip!** See step number `4` above for more details about the structure of tags.

&nbsp;

- `11` **Make a PR and add Code Owners as reviewers**. Reviewers don't need to review 'FIN' changed files as the content of the `fin` folder is auto-generated by the compiler. However, in your PR description, it's helpful to list the links to the related tasks (e.g., `TEA-4600`) completed in this version of the app.

&nbsp;

- `12` **Merge your PR** when approved by reviewers.  
  **Important!** When merging the branch, include a 1-line Changelog message in the commit message. Such message can be helpful for ACs whenever they wanna test a specific version of an app.  
  **Tip!** Remember to delete the branch (check 'Close source branch' option), once the PR is approved and you wanna merge it with master.

&nbsp;

[🔝](#pr-pull-request-rules-📏)

## More best practices about PRs

There are additional guidelines regarding PRs that can enhance team's efficiency and workflow. If you're interested, [click here](https://medium.com/google-developer-experts/how-to-pull-request-d75ac81449a5) to read more.

**Tip!** For very small PRs (involving changes to around 5 files), the PR description may suffice for reviewers, and you can skip informing Workspace Specialist & Code Owners before & after code modifications. This is applicable for tasks like fixing a small bug or changing one or two UI elements. However, it's not suitable for tasks requiring extensive code modifications, such as adding a new feature to an existing app/lib or modifying file/folder structures.

**Tip!** What are the responsibilities of Workspace Specialist & Code Owners regarding PRs? They have one key responsibility: to understand the purpose of your code modifications, how you implemented them, and provide suggestions for improvement if applicable. It's important to note that they are not here to judge your decisions; rather, they are here to assist you and the team in completing tasks efficiently and maintaining a clean codebase.

[🔙](../../README.md#guidelines)
