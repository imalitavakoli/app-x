[🔙](../../README.md#mindset)

# Monorepo 🧠

Our workspace is built using [NX](https://nx.dev/), a next-generation build system with robust support for monorepos and powerful integrations. NX provides task running, workspace analysis, and caching.

What else does NX offer? A variety of plugins! For example, by installing its [Angular plugin](https://nx.dev/packages/angular), NX provides us with a monorepo directory structure and more. In general, NX offers code generation facilities (generators), lower-level tooling abstraction (executors), and automatic code updating mechanisms (code migrations).

Our workspace is a monorepo, and we've opted for the [Integrated Monorepo Style](https://nx.dev/concepts/integrated-vs-package-based#integrated-repos) for it.

&nbsp;

[🔝](#monorepo-🧠)

## What's a monorepo?

A monorepo is a single version-controlled code repository that contains multiple projects. These projects are logically independent but share the same libraries and dependencies.

&nbsp;

[🔝](#monorepo-🧠)

## Why choose an Integrated Monorepo?

Some large tech companies use an Integrated Monorepo, and it's also **[recommended by NX](https://nx.dev/concepts/integrated-vs-package-based#how-to-choose)**.

In an **Integrated Monorepo**, projects depend on each other through standard import statements. While adding an existing standalone project to this style of repository might require modifying the build tooling to ensure all projects depend on a single version of every dependency, adding a brand-new project is straightforward because all the tooling decisions have already been made.

A **Package-based Monorepo** consists of packages that depend on each other via `package.json` files and nested `node_modules`. Adding an existing standalone package (project) to this style of repository is easy because each package can have different dependencies, thus leaving the existing build tooling untouched. However, adding a brand-new project to this type of repository is challenging because all the build tooling needs to be created from scratch.

&nbsp;

[🔝](#monorepo-🧠)

## Advantages of an Integrated Monorepo?

- Easy to add a brand-new project.
- Automatic generation of new apps & libs.
- Automated code migrations (updates).

&nbsp;

[🔝](#monorepo-🧠)

## Mindset behind an Integrated Monorepo?

In an Integrated Monorepo, it's crucial to keep all apps & libs up-to-date since they share the same dependencies. Updating one dependency may affect both old and new projects. While this encourages teams to maintain up-to-date code, it may not suit all teams. However, this doesn't have to be a barrier for teams who prefer less frequent updates due to reasons like resource constraints. They can:

- Choose to update their workspace less frequently, maintaining projects with older versions.
- Leverage automated code migrations, which streamline the updating process for all projects in the repo.

&nbsp;

[🔝](#monorepo-🧠)

## How do we address the downsides of using a technology?

As teams and technologies evolve, we may decide to change our structure or adopt new technologies in the future. To accommodate this uncertainty, we maintain standards and documentation for everything we build. Our repository already embraces several standards, including CODEOWNERS, README files for each app & lib, folder structures, library relationship patterns, feature-based development approach, naming conventions, comments, and documentation. We strive to make teamwork, debugging, refactoring, updating, and technology changes as easy and smooth as possible. While we appreciate automation and integration, we prioritize simplicity to avoid confusion and complexity.

[🔙](../../README.md#mindset)
