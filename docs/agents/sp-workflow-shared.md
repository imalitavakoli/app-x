[🔙](../../README.md#agents)

# Superpowers workflow — shared rules 🔗

The rules **every path assumes**. Read this at the start of any cycle, before the path file — `sp-workflow-path-{a,b,c}.md` cite these by name and do not repeat them.

`AGENTS.md` routes you here; it holds no copy. Why any of it is shaped this way: [sp-workflow-rationale.md](sp-workflow-rationale.md) — rationale only, never needed to execute a cycle.

**If a landmark in a path file is unclear** — 🪝 hook · 🚧 gate · 📌 constraint · set · 🚪 entry · 🎛️ mode · ▶️ resume · a `[gated]` or `[close-out]` tag — read [sp-workflow-format.md](sp-workflow-format.md) for what it means. Most landmarks state their own semantics inline (a gate spells out its Yes/No, a set its Members/Combine/Regardless), so you will usually not need it; the hook **kind tags** are the exception, since `[close-out]` vs `[gated]` decides whether a gate can skip that hook at all.

&nbsp;

## When a Superpowers skill a hook names is missing

A hook names a Superpowers skill as the **marker** for a lifecycle moment — not as the reason the hook exists. "Before we finish the branch" is still a real moment even if `finishing-a-development-branch` is renamed, split, or dropped in a later Superpowers release.

So if a named skill is **not present** in the installed Superpowers:

- **The moment still governs.** Run the hook where that moment occurs, and **say that you did and why**.
- **Never silently skip it**, and **never silently substitute a similar-looking skill** — a hook run at the wrong moment looks like it worked, which is worse than one that did not run.
- **Check, do not guess.** Which skills exist is observable: the available-skills listing, and the plugin cache on disk.

This has already bitten us once — a hook anchored to `verification-before-completion` turned out to be invoked only by `systematic-debugging`, so it never fired on the build path at all.

&nbsp;

## Operating rules

1. **Control flow lives in `AGENTS.md` and the path files, not in skills.** They decide which skill runs when and in what order. Our `x-*` skills are **atomic**: each does one job with its own inputs/outputs and must NOT call or name another skill — the one exception is the `x-{tech}-sp-*` family (e.g. `x-ng-sp-plan-enricher`), which by definition operates on a Superpowers artifact; see the `x-skill-build-helper` skill. A skill may declare a _prerequisite_ ("input: the PRD; if missing, stop and ask") — that guards its own contract; it is not orchestration.
2. **The hook says WHEN and WHICH; the skill says HOW.** Keep hook steps terse here; the full procedure lives inside the named skill.
3. **Track progress with todos.** When you enter a path, add one todo per step (prefix each `[x]`), **merge** them into the existing todo list (never replace it), and check them off as you go — this is how you remember the next step after a skill finishes.
4. **Reaching execution / subagents.** Implementation and test-writing happen inside execution — in the `subagent-driven-development` path (auto mode), in isolated subagents that do NOT read `AGENTS.md` or these files. The ONLY carrier into them is the Superpowers **plan**. Path A asks execution mode **before** `writing-plans`, and `writing-plans` writes that mode into the plan's Global Constraints. When functionality docs are in scope, `x-ng-sp-plan-enricher` folds PRD/TFS and test/lib conventions into the same plan. Anything implementers must obey has to be in the plan before Execution starts. (In interactive mode execution runs in-session via `executing-plans`, so the agent reads these rules directly — but the rules still go into the plan, so the two modes stay identical on content and the plan survives a compaction.)

&nbsp;

## Workspace preferences (declared to Superpowers)

Standing preferences the Superpowers skills read from our instructions. This is the sanctioned override channel (user instructions > skills), which is how we get them **without** editing Superpowers' own files.

1. **Isolation — work in place, no worktree.** `using-git-worktrees` honours a declared preference without asking: in this workspace do **not** create a worktree — create the feature branch in the existing checkout (the repo directory you are already in) and work there.
2. **Spec & plan location — ignored, never committed.** `brainstorming` writes its spec to `.superpowers/specs/` and `writing-plans` writes its plan to `.superpowers/plans/` (both skills state that user preferences override their `docs/superpowers/…` defaults). `/.superpowers/` is git-ignored, so these stay local to the cycle and can never reach a branch — while remaining on disk for the whole cycle, so an interrupted run can still be resumed.
3. **Do not commit the spec or plan.** `brainstorming`'s checklist says to commit the design document — in this workspace that step is intentionally skipped, because the file sits at an ignored path. If `git add` reports the path is ignored, do **not** re-run it with `-f`. Our durable, committed equivalents are the PRD and TFS under `docs/x/{name}/`.

&nbsp;

## Git contract

Who commits and when — the whole answer, for every path:

| Path                     | Feature branch                    | Commits during execution                          | Who decides git        |
| ------------------------ | --------------------------------- | ------------------------------------------------- | ---------------------- |
| Path A — **auto**        | yes                               | one per task — the review gates read those ranges | the skill              |
| Path A — **interactive** | yes                               | none: no commit, push, merge, or PR               | the user, at each stop |
| Path B — bug fix         | only if the user already made one | none, unless the user asks                        | the user               |

Branch and commit names follow `/docs/guidelines/naming-conventions.md#git`. No hook carries this rule: the agent reads it here, and `x-ng-sp-plan-enricher` copies it into the plan for the execution subagents (Operating rule 4).

[🔙](../../README.md#agents)
