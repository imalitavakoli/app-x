[🔙](../../README.md#getting-started)

# Setting up the repository on a new machine 💻

Before proceeding, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/), which includes npm. npm stands for [Node Packaged Modules](https://www.npmjs.com/) and manages development dependencies through Node.js.
- [Git](https://git-scm.com/), a distributed version control system.

**Tip!** If you're new to command line tools, [here is a great starting guide](http://webdesign.tutsplus.com/series/the-command-line-for-web-design--cms-777)!

&nbsp;

[🔝](#setting-up-the-repository-on-a-new-machine-💻)

## Installing global dependencies

- Open your Terminal/Command Prompt and execute the following commands:

- Run `npm install -g pnpm@9.15.9` to install [pnpm](https://pnpm.io/) globally on your machine. It's a fast and disk space-efficient package manager.
- Run `pnpm setup` to set up the global bin directory of pnpm at `C:\Users\USER\AppData\Local\pnpm` on your machine.
- Run `npm install -g nx@22.19.0` to install [NX](https://nx.dev/) globally on your machine.
- Run `npm install -g electron-builder@26.0.12`
- _Optional!_ Run `pnpm add -g nx` to install [NX](https://nx.dev/) globally via [pnpm](https://pnpm.io/) on your machine.

&nbsp;

[🔝](#setting-up-the-repository-on-a-new-machine-💻)

## Installing local dependencies

- Clone the repository from the version control system using Git commands or [Github Desktop](https://desktop.github.com/).
- Open your Terminal/Command Prompt and execute the following commands:

- Navigate to the folder where you cloned the repository using `cd my/path/to/here`.
- Run `pnpm install --frozen-lockfile` to install all required local dependencies.

**Tip!** If you're using Github Desktop to clone the repository, [click here](https://github.com/desktop/desktop/blob/development/docs/integrations/bitbucket.md) for instructions.

&nbsp;

[🔝](#setting-up-the-repository-on-a-new-machine-💻)

## Serve/build the Projects

- Run `nx serve app-name` to serve your target app. e.g., `nx serve ng-boilerplate`.

- Run `nx build app-name` to build your target app. e.g., `nx build ng-boilerplate`.

- _Optional!_ Run `nx build app-name -c=development` to build your target app for _development_.

- _Optional!_ Run `nx serve app-name -c=production` to serve your target app for _production_.

- _Optional!_ Run `nx run app-name:serve` to again serve your target app (alternative way).

- _Optional!_ Run `nx run app-name:build` to again build your target app (alternative way).

- _Optional!_ Run `nx serve app-name --port=4224 --open` to serve your target app on another port, and open the browser immediately.

&nbsp;

**Note!** If our target app is an Angular app that already implements [app-shell](https://angular.io/guide/app-shell), we shouldn't use `nx build app-name` to build it. Instead, we need to build it using the app-shell command. With app-shell, Angular runs server-side code during the build process to modify our `.html` file and provide the final browser files of our app. It embeds what `app.component.ts` and `app-shell.component.ts` return directly into the `index.html` file.

To build our app, use the following command:

- Run `nx app-shell app-name` to build your target app while leveraging _app-shell_.

- _Optional!_ Run `nx run app-name:app-shell:production` to build your target app while leveraging _app-shell_ (alternative method).

&nbsp;

**What's Angular app-shell?** _Application shell_ is a method to render a portion of our application using a route at build time. It enhances the user experience by quickly displaying a statically rendered page (a skeleton common to all pages) while the browser downloads the full client version and switches to it automatically after loading the code. In simple terms, _App Shell_ is useful for showing graphics and information to the user at the beginning of the app, before the JavaScript files are loaded.

&nbsp;

[🔝](#setting-up-the-repository-on-a-new-machine-💻)

## Opening the workspace (monorepo) in VSCode

Simply open the workspace file (at the root of repository) in your VSCode. That's it! When you open the workspace in your VSCode for the first time, it suggests installing some recommended extensions. Feel free to install these extensions as they help you work with the workspace more effectively.

[🔙](../../README.md#getting-started)
