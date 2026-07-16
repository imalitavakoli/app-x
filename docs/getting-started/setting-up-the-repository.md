[🔙](../../README.md#getting-started)

# Setting up the repository on a new machine 💻

Before proceeding, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 22.19.0), which includes npm. npm stands for [Node Packaged Modules](https://www.npmjs.com/) and manages development dependencies through Node.js.
- [Git](https://git-scm.com/), a distributed version control system.

**Tip!** If you're new to command line tools, [here is a great starting guide](http://webdesign.tutsplus.com/series/the-command-line-for-web-design--cms-777)!

&nbsp;

[🔝](#setting-up-the-repository-on-a-new-machine-💻)

## Installing global dependencies

- Open your Terminal/Command Prompt and execute the following commands:

- Run `npm install -g pnpm@10.33.0` to install [pnpm](https://pnpm.io/) globally on your machine. It's a fast and disk space-efficient package manager.
- Run `pnpm setup` to set up the global bin directory of pnpm at `C:\Users\USER\AppData\Local\pnpm` on your machine.
- Run `npm install -g nx@22.7.3` to install [NX](https://nx.dev/) globally on your machine.
- Run `npm install -g electron-builder@26.0.12`
- _Optional!_ Run `pnpm add -g nx` to install [NX](https://nx.dev/) globally via [pnpm](https://pnpm.io/) on your machine.

&nbsp;

[🔝](#setting-up-the-repository-on-a-new-machine-💻)

## Installing local dependencies

- Clone the repository from the version control system using Git commands or [Github Desktop](https://desktop.github.com/).
- Open your Terminal/Command Prompt and execute the following commands:

- Navigate to the folder where you cloned the repository using `cd my/path/to/here`.
- Run `pnpm install --frozen-lockfile` to install all required local dependencies.

**Note!** If you've encountered an error while installing the local dependencies, it's mostly probable that your installed version of local dependencies are not working properly with the version of global dependencies (Node.js, Nx, or pnpm) which are installed on your machine! So read the error which is causing the installation to be failed, and ask AI (LLM) 🤖 something like: "I ran `pnpm install --frozen-lockfile` and it seems that `<package>` is causing an issue! Can you look into `package.json` to check the package's version that is causing the issue, in order to see if it is compatible with the versions of Node.js, Nx, or pnpm that I already have installed on my machine? Then provide a suggested version for it to be installed".

**Tip!** If you're using Github Desktop to clone the repository, [click here](https://github.com/desktop/desktop/blob/development/docs/integrations/bitbucket.md) for instructions.

&nbsp;

[🔝](#setting-up-the-repository-on-a-new-machine-💻)

## Installing AI tools

### Claude CLI

If you'd like to use Claude LLM as your AI code assistant, then you should install it on your machine:

- Windows: Open PowerShell, and run `irm https://claude.ai/install.ps1 | iex`;
- MacOS: Open Terminal and run `curl -fsSL https://claude.ai/install.sh | bash`.

**Note!** On Windows, open System Properties → Environment Variables → Edit User PATH → New → Add `C:\Users\{user}\.local\bin` path. Then CD to your workspace, and run `claude` to login and set the initial configurations to make Claude ready on your machine.

**Tip!** In a Claude session, run `/mcp` to make sure that all of the workspace MCPs are already available on your workspace. e.g., Figma MCP may require your authentication.

&nbsp;

### Antigravity

If you use Antigravity as your AI code assistant, then you should install it on your machine:

- Download Antigravity from the [official website](https://antigravity.google/download).
- Windows: Open PowerShell, and run `irm https://antigravity.google/cli/install.ps1 | iex` to install its CLI.
- MacOS: Open Terminal, and run `curl -fsSL https://antigravity.google/cli/install.sh | bash` to install its CLI.

&nbsp;

### NX AI Agents

You can automatically configure our NX monorepo to work best with AI agents and assistants. In order to do that, do the following. [Click here](https://nx.dev/docs/getting-started/ai-setup) to read more.

- Run `npx nx configure-ai-agents`.

**Tip!** We've already configured Claude on this monorepo by default.

&nbsp;

### Superpowers plugin

[Superpowers](https://github.com/obra/superpowers) is a plugin that makes our AI agent follow a disciplined workflow instead of coding first and thinking later.  
[Click here](https://github.com/obra/superpowers#installation) to learn how to install it for different AI tools.

**How it works**  
A startup hook auto-loads one skill — `using-superpowers` — into every session. It's the traffic cop that reads your request and picks the right skill. Nothing else is automated; the rest is just skills reading and obeying instructions.

**The three layers**

1. Bootstrap — the hook injects `using-superpowers` at session start.
2. Routing — `using-superpowers` matches your request to a skill ("build X" vs "fix bug" vs a plain question).
3. Hand-offs — each skill names the next one, forming a chain.

**The workflow (building a feature)**

- `brainstorming` → asks questions, agrees on a design, saves a design doc (won't code until you approve).
- `writing-plans` → breaks it into tiny exact tasks, then asks how to execute.
- `subagent-driven-development` (or `executing-plans`) → builds task-by-task.
- `test-driven-development` → writes tests first.
- `requesting-code-review` → reviews the code.
- `finishing-a-development-branch` → merge / PR / discard (you choose).

For bugs it's a shorter chain:  
`systematic-debugging` → find root cause → `verification-before-completion` verifies the fix. Simple questions get answered with no skill at all.

**Benefits**

- Designs and plans before coding — bad assumptions caught early.
- Approval checkpoints keep you in control.
- Design docs + plans are saved and committed.
- Tests enforced; "done" backed by evidence, not hope.
- It's just instructions — we can add our own rules without touching the plugin.

**Bottom line:** turns the AI from an eager junior into a disciplined engineer that designs, plans, tests, and checks in with you.

&nbsp;

[🔝](#setting-up-the-repository-on-a-new-machine-💻)

## FAQ

### How to fix `Permission denied (publickey)` error for `nx@nx-claude-plugins` plugin in a Claude session?

Claude CLI uses Git over SSH to fetch plugins. If you run `/doctor` in a Claude session, you may see this error for the `nx@nx-claude-plugins` plugin:

```
Permission denied (publickey)
```

This usually happens because your machine doesn't have SSH key configured for GitHub authentication (i.e., your Git uses HTTPS instead of SSH for GitHub). In such case, Claude CLI won't be able to clone the plugin.

You can fix this without changing your global Git configuration:

1. Create the `.ssh` folder if it doesn't already exist:

```bash
mkdir C:\Users\YOU\.ssh -Force
```

2. Add GitHub's host key to `known_hosts` (if the file doesn't already exist). This tells your SSH client to trust GitHub's server.

```bash
ssh-keyscan -t ed25519 github.com >> C:\Users\YOU\.ssh\known_hosts
```

3. Generate a new SSH key pair:

```bash
ssh-keygen -t ed25519 -C "your@email.com"
```

This creates:

- `C:\Users\YOU\.ssh\id_ed25519` (private key)
- `C:\Users\YOU\.ssh\id_ed25519.pub` (public key)

4. Copy your public key:

```bash
type C:\Users\YOU\.ssh\id_ed25519.pub
```

5. Go to `github.com/settings/keys`, click **New SSH key**, choose **Authentication Key**, paste your public key, and save it.

6. Test your SSH connection:

```bash
ssh -T git@github.com
```

If everything is configured correctly, you should see a message similar to:

```text
Hi <username>! You've successfully authenticated...
```

After that, run `/doctor` again. Claude CLI should now be able to fetch the plugin successfully.

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
