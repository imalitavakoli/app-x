[🔙](../../README.md#faq)

# Directories & files ⁉

Some directories & files are familiar to all of us right at the beginning! But there are some of them which may need more explanation.

&nbsp;

[🔝](#directories--files-⁉)

## Directories

- `_OBS/`: This directory **stands for 'out of use or practice'**, 'not now', 'not current', 'legacy', 'out of date', 'unfashionable', and such meanings... Individuals or teams can freely put any unused files of their own in here. They can simply create their own directory in it (e.g., `ali/`) and put their files in there. **This directory exists to always keep the files and codes clean and organized.**  
  **Tip!** Imagine, you're refactoring a function in `apps/{app-name}/src/app/app.component.ts` file. After your code modifications, you decide to completely delete a function, but still think that maybe such functionality be useful in the future... You may have experienced such a scenario before, right? What should you do in such a case? Is it ok to comment the code and leave it there in the codes? That's an option! But it may make codes and files dirty after a while, especially if other team members are also working on the same files... So another option can be copying that file, and mimic the path to that file in the `_OBS` directory! So you can make an identical file in `_OBS/{my-name}/apps/{app-name}/src/app/app.component.ts` whereas this file contains your unused codes.  
  **Tip!** Files or folders that start with `__` in the `_OBS/` directory will be ignored via `.gitignore`. e.g., `_OBS/{my-name}/__logo.psd`, `_OBS/{my-name}/__TODO.md` or `_OBS/{my-name}/__screenshots/`.

- `apps/`: This directory contains the application projects. This is the main entry point for a runnable application. It is recommended to keep apps as light-weight as possible, with all the heavy lifting being done in libraries that are imported by each application.  
  In simple terms, **it contains all of our company's separated applications**.

- `libs/`: This directory contains the library projects. There are many kinds of libraries such as UI elements, TypeScript interfaces, components, services, 3rd-party resources, API related functions, and etc.  
  In simple terms, **it contains all of our company's shared libraries** and even applications' pages. Why? Because it's a good practice to see the application as a 'container' that links, bundles, and compiles functionality implemented in libraries for being deployed. We can actually follow an 80/20 approach, which says place 80% of your logic into libs, and 20% into apps. Libraries don't necessarily need to be built separately, but are rather consumed and built by the application itself directly. Hence, nothing changes from a pure deployment point of view. [Click here](https://nx.dev/concepts/more-concepts/applications-and-libraries) to learn more.
- `tools/`: This directory contains **any probable scripts that we can create to act on our code base**. This could be [local executors](https://nx.dev/extending-nx/recipes/local-executors), or [local generators](https://nx.dev/extending-nx/recipes/local-generators).

&nbsp;

[🔝](#directories--files-⁉)

## Files

- `CODEOWNERS`: It **defines individuals or teams that are experts in a specific code area** of a repo and are interested in ensuring that the code quality stays great. In simple terms, some directories or files can be suggested to be edited by developers who are mostly familiar with them. This helps teams find the right developer to review targeted code, maintain high code quality, and save time. With the help of the [Codeowner VSCode Extension](https://marketplace.visualstudio.com/items?itemName=Prabhakar.codeowner), finding the Code Owners of a file or directory can be even easier in VSCode. [Click here](https://marketplace.atlassian.com/apps/1218598/code-owners-for-bitbucket) to learn more.

- `.eslintrc.json`: It's the Eslint rules file. Inside of it, NX has defined an interesting rule called `@nx/enforce-module-boundaries`. It actually enforces the public API of projects (each project defines its public API in an `index.ts` or `index.js` file) in the repo to obey its conditions.  
  Inside of it, you can use your project's (app or lib) tags to **define which project can depend on which other one**!  
  e.g., You can define a '_type:feature_' project that can depend on a '_type:ui_' project, and a '_type:ui_' project cannot depend on anything else. Also, a '_scope:groups_' can depend on '_scope:items_', but a '_scope:items_' cannot depend on anything else. [Click here](https://nx.dev/core-features/enforce-module-boundaries) to learn more.

- `nx.json`: It's the workspace default configurations. It configures the NX CLI itself. Inside of it, you can also **modify the defaults of the targets' inputs**. What are targets' inputs? The inputs property of a task allows you to define under what conditions the cache for that task should be invalidated and the task should be run again.  
  e.g., if you want to run 'build' for your app, and you have already modified the test files (`*.spec.ts`), markdown files (`*.md`), or any other files that are not related to your codes for building the production files (such as `tsconfig.spec.json`, `jest.config.ts`, or `.eslintrc.json`), then NX should NOT run the building process again, and instead, it should use the cached files! But how should it understand that you want to ignore such files for your production build? That's when inputs shine! They help you build faster (use cache) even if you modify some files in your projects! [Click here](https://nx.dev/concepts/more-concepts/customizing-inputs) to learn more.

- `tsconfig.base.json`: It's the global TypeScript config file. Inside of it, NX will also create **some path aliases to libs** that you generate (by using NX commands). Then you can use such aliases to conveniently use such libs in apps or other libs.

- `apps/{app-name}/project.json`: It's actually a file similar to `angular.json` in a regular Angular project. It contains some configuration about the project. Inside of it, you can also **define your project's tags**. These tags will then be used to strictly define to what other apps or libs your project depends on.  
  You can define such boundary rules in 2 dimensions. i.e., you can set the tags option to something like this: `["type:feature", "scope:groups"]`.

- `apps/{app-name}/ngsw-config.json`: It's the PWA related file (for the apps which installed it). Here we can define in what mode static or dynamic assets should be cached in our app for better user experience.

- `apps/{app-name}/src/assets/DEP_config.json`: It's the app's configuration file, and our app loads it on initialization (i.e., in `apps/{app-name}/src/app/app.config.ts` file) to define its important configs, such as '_BaseURL_', '_ClientID_', and etc.  
  **Note!** Some app's config JSON file may also have an `extra` property. This property contains that app's specific configs. So it means that the app needs to have its own specific '_map_' lib to map (proxify) the data that is in that property as well, and use that lib as soon as the JSON file is loaded on initialization.

- **AI agents related files**: `.gemini/settings.json`, `.github/copilot-instructions.md`, `.mcp.json`, `AGENTS.md`, and `CLAUDE.md`. They help agents to do tasks on your workspace easier and efficiently.

[🔙](../../README.md#faq)
