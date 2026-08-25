[🔙](../../README.md#agents)

# Superpowers workflow — shared rules 🔗

The rules **every path assumes**. Read this at the start of any cycle, before the path file.

`sp-workflow-path-{a,b,c}.md` cite what is here **by name** and never repeat it — and never cite **each other**. A path that leans on another path's step cannot be edited without reading that other path, and renaming a step there silently breaks it. When two paths need the same **procedure**, it goes in [sp-workflow-procedures.md](sp-workflow-procedures.md) — read one of those when a hook cites it, never up front: they shape nothing about routing or planning, and the hooks needing them fire late. Which reads are due, and at which moment — this file, the path file, [sp-workflow-prefs.md](sp-workflow-prefs.md) and the rest — is the _Required reads_ table below. That table is the **only** statement of those moments; every other surface points at it rather than restating it.

`AGENTS.md` routes you here; it holds no copy.

**If a landmark in a path file is unclear** — 🪝 hook · 🚧 gate · 📌 constraint · set · 🚪 entry · 🎛️ mode · ▶️ resume · a `[gated]` or `[close-out]` tag — read [sp-workflow-format.md](sp-workflow-format.md) for what it means. Most landmarks state their own semantics inline (a gate spells out its Yes/No, a set its Members/Combine/Regardless), so you will usually not need it; the hook **kind tags** are the exception, since `[close-out]` vs `[gated]` decides whether a gate can skip that hook at all.

&nbsp;

## Required reads and when they are due

Where every other surface points, instead of restating a moment in its own words. A second copy is what drifts: the personal-preference read was anchored to "before the first Superpowers skill that interviews the user" in six places at once, and on a rejoin that skill is the **execution** skill — so the condition stayed false until after every decision it was meant to shape.

**Three moments. Use these words** — a paraphrase is how one rule comes to mean two things in two files:

- **cycle start** — entering **or rejoining** a path. Joining with existing state (a plan path you were handed, a cycle you are resuming) is a cycle start, not an exception to one.
- **before the first question put to the user** — whoever asks it: a Superpowers skill, one of our `x-*` skills, or you.
- **when a hook cites it** — named at the citing step, never read up front.

`AGENTS.md` owns what falls due **before you reach this file** — itself, its Pre-flight checks, this file, and the path file; it is the router, and only it is loaded early enough to say so. What falls due **from here on**:

| Read                                                                                     | Due at                                                     |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [sp-workflow-prefs.md](sp-workflow-prefs.md) — in full                                   | cycle start, **before the first question put to the user** |
| [sp-workflow-procedures.md](sp-workflow-procedures.md) — the cited procedure             | when a hook cites it                                       |
| [sp-workflow-format.md](sp-workflow-format.md) — that entry; in full to edit a path file | a landmark is unclear · before editing a path file         |

The full inventory — every doc an agent reads and when it loads — is [where-content-lives.md](where-content-lives.md) → _The table_. That file is for whoever is **writing** a doc; this section is for whoever is **following** a path, and carries only what falls due after this point.

**Having read a rule is not having obeyed it.** Some of what these files carry is an **action due at the moment you read it**, not a fact to carry onward. So after each read above, scan what you just read for anything due **now** — at cycle start, or before the first question — then **do it, and say you did**.

Keep that general. Resolving `pref.*` is today's instance of it, **not its extent**: a rule added later with the same timing is covered by the sentence above and will not announce itself, so a reader who learned this as "the preferences rule" will walk past the next one. The observed failure is an agent that read the file, quoted the rule back accurately, and let the first question be asked anyway.

&nbsp;

## When a Superpowers skill we name is missing

Wherever our workflow names a Superpowers skill, the name is a **marker for something more durable — never the thing itself.** Two places do it, and each marks something that outlives the name:

| Where                            | The name marks…                             | Which survives a rename because…                                                  |
| -------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------- |
| a 🪝 hook's attach-point         | a **lifecycle moment**                      | "before we finish the branch" is still a real moment whatever the skill is called |
| the path selector in `AGENTS.md` | a **kind of work** (design work · a defect) | the work is still that kind, and the replacing skill's own `description` says so  |

So if a named skill is **not present** in the installed Superpowers:

- **The thing it marked still governs.** Run the hook at that moment, or route to that path, and **say that you did and why**.
- **Never silently skip it**, and **never silently substitute a similar-looking skill** — work done at the wrong moment, or on the wrong path, looks like it worked. That is worse than not running at all.
- **Check, do not guess.** Which skills exist is observable: the available-skills listing, and the plugin cache on disk. So is what each one is for: its own `description`.

This has already bitten us once — a hook anchored to `verification-before-completion` turned out to be invoked only by `systematic-debugging`, so it never fired on the build path at all.

&nbsp;

## Skipping one Superpowers skill does not skip a later hook

A hook runs when the path reaches **that hook's** named Superpowers skill. Skipping an earlier skill on the same path does not skip a later hook.

This is a different case from a named skill that is **missing** (section above). Missing/renamed: the moment still governs. Installed but not invoked: the hook on that skill does not run. Do not invent a chain — e.g. declining `using-git-worktrees` does not skip `finishing-a-development-branch` or the hook that sits before it.

&nbsp;

## Operating rules

1. **Control flow lives in `AGENTS.md` and the path files, not in skills.** They decide which skill runs when and in what order. Our `x-*` skills are **atomic**: each does one job with its own inputs/outputs and must NOT call or name another skill — the one exception is the `x-{tech}-sp-*` family (e.g. `x-ng-sp-plan-enricher`), which by definition operates on a Superpowers artifact; see the `x-skill-build-helper` skill. A skill may declare a _prerequisite_ ("input: the PRD; if missing, stop and ask") — that guards its own contract; it is not orchestration.
2. **The hook says WHEN and WHICH; the skill says HOW.** Keep hook steps terse here; the full procedure lives inside the named skill.
3. **Track progress with todos.** When you enter a path, add one todo per step (prefix each `[x]`), **merge** them into the existing todo list (never replace it), and check them off as you go — this is how you remember the next step after a skill finishes.
4. **Reaching execution / subagents.** Implementation and test-writing happen inside execution — in the `subagent-driven-development` path (auto mode), in isolated subagents that do NOT read `AGENTS.md` or these files. The ONLY carrier into them is the Superpowers **plan**. Where a path has execution modes, it **resolves** mode (and Path A's `app-serve`) **before** `writing-plans`, so `writing-plans` writes those into the plan's Global Constraints. When functionality docs are in scope, `x-ng-sp-plan-enricher` folds PRD/TSD and test/lib conventions into the same plan. Anything implementers must obey has to be in the plan before Execution starts. (In interactive mode execution runs in-session via `executing-plans`, so the agent reads these rules directly — but the rules still go into the plan, so the two modes stay identical on content and the plan survives a compaction.)
5. **Prefer a durable path over held context.** A file read at the moment it is needed is unaffected by how long the session has run. Anything merely _held_ in context decays as the window fills — and the artifacts a path stakes the most on are the ones it writes last. So a controller loads what it must **reason with**, and passes a **resolvable repo-relative path** for whatever someone else will **imitate**. What that means depends on what the thing is for:
   - A **helper** skill splits cleanly: its `SKILL.md` holds rules a planner reasons with, its `assets/` hold examples a builder imitates. Load the first; pass the second onward as a path.
   - A **writer** skill cannot be split that way — it needs its own templates and examples to produce its document. So dispatch it to a subagent that loads them there, and take back its Summary and the file it wrote. The hook that dispatches it says what else that involves.
   - A step that runs **late** on a path re-reads what it needs rather than testing whether an earlier step's context survived. A stale recollection does not announce itself; a re-read costs one file.

   Operating rule 4 is this rule's hardest case, not an exception to it: execution subagents hold nothing at all, so the plan must carry everything.

&nbsp;

## Workspace preferences (declared to Superpowers)

Standing preferences the Superpowers skills read from our instructions. This is the sanctioned override channel (user instructions > skills), which is how we get them **without** editing Superpowers' own files.

1. **Isolation — work in place, no worktree.** `using-git-worktrees` honours a declared preference without asking: in this workspace do **not** create a worktree — create the feature branch in the existing checkout (the repo directory you are already in) and work there.
2. **Spec & plan location — ignored, never committed.** `brainstorming` writes its spec to `.superpowers/specs/` and `writing-plans` writes its plan to `.superpowers/plans/` (both skills state that user preferences override their `docs/superpowers/…` defaults). `/.superpowers/` is git-ignored, so these stay local to the cycle and can never reach a branch — while remaining on disk for the whole cycle, so an interrupted run can still be resumed.
3. **Do not commit the spec or plan.** `brainstorming`'s checklist says to commit the design document — in this workspace that step is intentionally skipped, because the file sits at an ignored path. If `git add` reports the path is ignored, do **not** re-run it with `-f`. Our durable, committed equivalents are the PRD and TSD under `docs/x/{name}/`.

&nbsp;

## Personal preferences (`pref.*`)

Personal defaults in `AGENTS.local.md`. **Not** the Workspace preferences above — those are committed team constraints Superpowers honours without asking.

Read [sp-workflow-prefs.md](sp-workflow-prefs.md) **in full** at **cycle start**, **before the first question put to the user** (_Required reads and when they are due_). That file owns how to resolve and persist any `pref.*` key. An `every-path` key is resolved from that file at cycle start; a `one-path` key is resolved on the path that consumes it.

&nbsp;

## Git contract

Who commits and when — the whole answer. Keyed on the **kind of work**, which outlives any path's name (see _When a Superpowers skill we name is missing_):

| Kind of work                       | Feature branch                    | Commits during execution                          | Who decides git        |
| ---------------------------------- | --------------------------------- | ------------------------------------------------- | ---------------------- |
| design work — **auto** mode        | yes                               | one per task — the review gates read those ranges | the skill              |
| design work — **interactive** mode | yes                               | none: no commit, push, merge, or PR               | the user, at each stop |
| a defect fix                       | only if the user already made one | none, unless the user asks                        | the user               |

**A functionality's docs are the user's commit, on request.** `docs/x/{name}/PRD/` and `TSD/` are written before any feature branch exists, so no row above covers them and no hook commits them. The close-out that ends documentation **asks** the user to commit them once both writers are done; if they decline, the docs stay uncommitted and that is reported plainly, never worked around by committing them anyway.

**Docs whose approval was never recorded are never committed.** An unapproved draft on a shared branch becomes the primary source of truth for the next cycle, which is the whole reason approval is recorded in the document rather than only in a report. Today that state is the PRD's **ACs Approved** field reading `NOT YET`; if the writers ever record it differently, this rule is unchanged and only that name moves.

Branch and commit names follow `/docs/guidelines/naming-conventions.md#git`. No hook carries this rule: the agent reads it here, and `x-ng-sp-plan-enricher` copies it into the plan for the execution subagents (Operating rule 4).

[🔙](../../README.md#agents)
