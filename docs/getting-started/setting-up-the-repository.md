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

**Tip!** The workspace's MCP servers need a one-time approval (and one of them a login) — see [MCP servers](#mcp-servers) below.

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

#### The Nx plugin

Separately from the above, Claude Code gets an **Nx plugin**, which is also what provides the `nx-mcp` server that `AGENTS.md` treats as the first place to look for anything about this workspace. The repo enables it; you install it:

```bash
claude plugin install nx@nx-claude-plugins --scope user
```

`--scope user` for the same reason as Superpowers below — a user-scoped install carries no path, so the Windows drive-letter casing can't strand it.

**Note!** Unlike Superpowers, the Nx plugin is deliberately **not pinned**. We depend on Superpowers' _behaviour_ — our workflow, hooks and docs are layered on it, so it moves only when we choose. Nx is a tool we simply want current, and its updates track the Nx versions this workspace is built on. Don't "fix" that inconsistency; it's the point.

&nbsp;

### Superpowers plugin

[Superpowers](https://github.com/obra/superpowers) is a plugin that makes our AI agent follow a disciplined workflow instead of coding first and thinking later.

#### Installing it on a new machine

**Use our catalog, not upstream's marketplace.** This repo runs a **pinned** commit of Superpowers, from our own catalog at `.claude/plugins/`, which `.claude/settings.json` declares.

The pin is a **conservative choice, not a requirement.** Our workflow is built to survive new Superpowers versions — it routes on what a skill says it does rather than on its name, and attaches to lifecycle moments rather than titles. Pinning just means a new version arrives when we decide to take it, instead of turning up mid-cycle, so there's time to check the handful of behaviours we lean on. Everyone on Claude Code gets the same commit, which also makes "works on my machine" one less variable.

After cloning, from the repo root:

```bash
claude plugin marketplace add ./.claude/plugins
```

```bash
claude plugin install superpowers@x-local-marketplace --scope user
```

Then restart Claude Code, or run `/reload-plugins`.

**Why `--scope user`?** A project-scoped install is recorded against the exact path string of your clone — and on Windows the CLI and the VS Code extension disagree on the drive-letter case (`C:\…` vs `c:\…`), so an install made by one can read as "enabled but not installed" in the other. A user-scoped install records no path at all, so it cannot mismatch. Enablement still comes from the repo, which is what pins the version for everyone.

**Why two commands?** The first registers our catalog; the second installs the pinned commit from it. A marketplace that only the repo's settings declare isn't registered on its own, so the install fails without the first command. If Claude Code offers to install this repo's plugins when you first trust the folder, accepting does the same job and you can skip both.

**Note!** You do **not** need to uninstall your own copy of Superpowers. Project settings outrank user settings, so this repo switches your copy off **here only** — it keeps working normally in all your other projects.

**Note!** Until you run these, Superpowers is **off** in this repo — not merely unpinned, so no part of the workflow below applies. A check at session start tells you, and `pnpm run check:workflow` names the cause.

**Tip!** To confirm it worked: `claude plugin list` shows `superpowers@x-local-marketplace` enabled, and `pnpm run check:workflow` passes both `sp-version` (the version we reviewed against) and `sp-pin` (the pinned commit is that same one).

**Using a different AI tool?** Upstream ships Superpowers for several agents — see its [installation instructions](https://github.com/obra/superpowers#installation). The pin above is Claude Code only, so other tools install their own copy at whatever version upstream currently publishes. That's expected, not a misconfiguration: `pnpm run check:workflow` reports it as an informational **notice** (it still passes), because nothing you can do on that machine would match the pinned version. The workflow itself is designed to keep working across versions.

#### How it works

**The one piece of automation.** At the start of every session, a hook loads a single "router" skill (`using-superpowers`) — and reloads it if the session is cleared or compacted. That's the only automated part. Everything else is skills: plain markdown files the agent reads and obeys, each naming the next one to use. So a "workflow" is a chain of instructions, not a program — the agent follows it because it's strongly instructed to, which works dependably in practice even though nothing mechanically forces it. (New skills may be added over time; the mechanism stays the same.)

**Three layers:** (1) a hook injects the router at startup → (2) the router matches your request to a starting skill → (3) each skill hands off to the next.

#### What loads, when

> Tags:  
> **[SP]** = defined by Superpowers (its README workflow or a skill's own trigger);  
> **[ours]** = our framing, derived from those same triggers.

**1. Build a feature or change an existing feature's behavior [SP]** — The full pipeline:

- `brainstorming` — asks questions, agrees a design, saves + commits a design doc. Won't write code until you approve.
- `writing-plans` — splits the design into tiny, exact tasks (with complete code), commits the plan, then asks how to execute.
- `using-git-worktrees` — creates an isolated branch to work on (asks first).
- `subagent-driven-development` (fresh subagent per task, each reviewed) — or `executing-plans` if there are no subagents (runs tasks inline).
- `test-driven-development` — while coding each task: write the test and watch it fail (red), write just enough to pass (green), tidy up (refactor).
- `requesting-code-review` — the agent asks for a review of its own work.
- `finishing-a-development-branch` — you choose: merge / PR / keep / discard.

**2. Fix a bug or failure [SP]** — shorter, no docs:

- `systematic-debugging` — root cause before any fix (no guessing; escalates after 3 failed attempts).
- `test-driven-development` — a failing test that reproduces the bug first.
- `verification-before-completion` — before saying "fixed," runs the check fresh and reads real output, so the claim rests on evidence, not assumption.

(A quick fix ends here. If it was branch work to merge, `finishing-a-development-branch` can load too — it handles a normal branch on its own and doesn't need `using-git-worktrees`.)

**3. Execute an existing plan doc [ours]** — `subagent-driven-development` (same session, subagents) or `executing-plans` (separate session); both end at `finishing-a-development-branch`.

**4. Several independent tasks at once [SP]** — `dispatching-parallel-agents`: one throwaway subagent per problem, launched together, merged at the end.

**5. Create or edit a skill [SP]** — `writing-skills`: builds it test-first, pressure-tests it with subagents, then deploys.

**6. Respond to review feedback on the agent's work [SP]** — `receiving-code-review`: when your/the agent's work gets feedback (you say "this is wrong," or a bot comments on the PR), it verifies each point, pushes back when a suggestion is wrong, and applies changes one at a time. (Mirror of `requesting-code-review`.)

**7. Ask for a named skill [ours]** — it loads immediately; its own hand-offs take over.

**8. Ask a plain question [ours]** — no skill loads; the router just answers.

#### Guards (fire on their own, in any workflow) [SP]

- `verification-before-completion` — on any "done / fixed / passing" claim.
- `systematic-debugging` — on any failure or unexpected behavior.
- `receiving-code-review` — whenever review feedback arrives.

#### Why it helps

Designs and plans come before code, approval checkpoints keep you in control, docs and plans are committed, tests are enforced, and "done" is backed by evidence. It's all instructions plus one small hook — so we can layer our own workspace rules on top without touching the plugin.

**Bottom line:** it turns the AI from an eager junior into a disciplined engineer that designs, plans, tests, reviews, and checks in with you.

_Sources: Superpowers' README workflow and each skill's own trigger description._

&nbsp;

[🔝](#setting-up-the-repository-on-a-new-machine-💻)

### MCP servers

MCP servers are how the agent reaches things outside the repo — the Nx project graph, Angular's docs, Figma. Which ones to prefer for which question is in [`AGENTS.md`](../../AGENTS.md) → _MCP Usage Priority_; this section is only about getting them running on a new machine.

They arrive two different ways, and only one of them needs anything from you:

| Server                                 | Comes from                              | You do                             |
| -------------------------------------- | --------------------------------------- | ---------------------------------- |
| `nx-mcp`                               | the **Nx plugin** (see above)           | nothing — installing it is enough  |
| `angular-cli`, `figma-mcp`, `context7` | `.mcp.json`, committed at the repo root | approve them once; log in to Figma |

**Approve the repo's servers.** A committed `.mcp.json` is not trusted automatically — a cloned repo could otherwise run commands on your machine. The first Claude Code session in the repo asks whether to use them; say yes. Your answer is stored in the git-ignored `.claude/settings.local.json`, so it is yours alone and survives future clones of nobody else's.

Check what happened:

```bash
claude mcp list
```

Approved servers are health-checked; unapproved ones show as **⏸ Pending approval** and are not connected. If you dismissed the prompt and want it back, `claude mcp reset-project-choices` clears the answers for this project and you'll be asked again.

**Log in to Figma.** `figma-mcp` is an HTTP server behind OAuth, so approval alone is not enough:

```bash
claude mcp login figma-mcp
```

Nothing needs a hand-managed API key, and no MCP secret belongs in `.mcp.json` — it is committed. Anything requiring a credential uses `claude mcp login`, which stores it outside the repo.

**Note!** `angular-cli` runs through `npx`, so its first start downloads a package and can be slow; `claude mcp list` reporting a timeout on the very first run usually just means that. Re-run it.

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
