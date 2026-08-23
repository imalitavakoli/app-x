---
name: x-sp-workflow-helper
description: 'WHAT? The procedure and integrity checker for changing the Superpowers-First Workflow surfaces — `AGENTS.md`, `docs/agents/sp-workflow-*.md` and the `x-*` skills they name. WHEN? Before adding, renaming, renumbering or deleting a hook, gate, constraint, entry, path or landmark; before moving a rule between those files; after any such edit, to prove nothing dangled; and whenever the installed Superpowers version changes.'
metadata:
  version: '1.5.0'
---

# SP Workflow Helper

## Overview

This skill is a **helper**: it puts the procedure for changing the workflow into your context, and hands you a checker to prove the change is sound. It **produces nothing** — whoever is doing the work makes the edit.

It covers only the **change discipline**. It deliberately does not restate:

- **what the landmarks mean** — that is `docs/agents/sp-workflow-format.md`, the notation catalog, and it stays the authority. Read it in full before editing a path file.
- **which surface owns a fact** — that is `docs/agents/where-content-lives.md`.
- **why a decision was made** — that is `docs/agents/sp-workflow-rationale.md` (the bar is the intro note _What earns an entry_).
- **how to build a skill** — that is `x-skill-build-helper`.

All four remain the authority on their own subject. This skill is the one that says: _before you touch any of them, here is what breaks, and here is how to find out._

## When to use

Before **any** edit to `AGENTS.md`'s workflow section, to any `docs/agents/sp-workflow-*.md`, or to `docs/agents/where-content-lives.md` — specifically when you are about to:

- add, rename, renumber or delete a 🪝 hook, 🚧 gate, 📌 constraint, 🚪 entry, ▶️ resume, 🎛️ mode, set, or step band
- move a rule between `AGENTS.md`, a path file, the shared rules, and the procedures file
- re-anchor a hook to a different Superpowers skill
- add or retire an `x-*` skill that the workflow names

**When the installed Superpowers version no longer matches the one the workflow was reviewed against** — however that came about — read [references/superpowers-upgrade.md](references/superpowers-upgrade.md) instead of this file's procedure. Our layer relies on Superpowers behaving in specific ways, and none of those reliances is enforced on the Superpowers side, so an upgrade cannot fail loudly. That playbook holds the dependency surface, sorted by whether a breakage would be loud or **silent**.

Not for **following** a path — that needs the path file, not this. Not for authoring a skill's own content — that is `x-skill-build-helper`.

**Superpowers is not Claude-only.** Upstream ships it for ten agents, and it can also be copied into a workspace with no plugin manager. So "is it installed, and at which version" has several possible answers: `sp-version` inspects the two layouts it knows (the Claude plugin cache, a workspace copy), names the source it found, and when it finds nothing says **what it could not check** rather than declaring absence. Teaching it another agent's layout is a probe in `findSuperpowersSkills` — never a guessed path, which would turn a gap into a false alarm.

## What each piece catches — read this first

This skill has several moving parts. They are not alternatives: each catches a class the others structurally cannot, and the three cases in the second table are all things that **actually happened** while building this skill.

**Naming in `scripts/`:** the entry point is the only **verb**-named file (`check-workflow.mjs`) — you run it. Everything else is a **noun** — it is read. Segments the folder already supplies are omitted (hence `config.mjs`, not `workflow-config.mjs`), and a segment naming a different subject is kept (hence `superpowers-baseline.json`).

**Only the checker runs on its own** (plus the files it reads). Everything else is something a person reads or runs deliberately — the last column says which, and what triggers it.

| Piece                               | Catches                                                                                                                                                                                                                                  | How                                                                                                                   | When                                                                                                                                                                                                                                                                              |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/check-workflow.mjs`        | **Broken references** — a hook ID no heading defines, a dead file path, an `#anchor` no heading yields, a hook anchored to an uninstalled Superpowers skill, a drifted tool stub, a path file citing another, a doc naming a hook script | 14 mechanical rules over `AGENTS.md`, `docs/agents/` and the `x-*` skills                                             | **Runs itself** — right after any edit to a guarded surface (a **PostToolUse** hook), and whenever you run `pnpm run check:workflow`. You never have to remember it.                                                                                                              |
| `scripts/config.mjs`       | **Nothing on its own** — it holds what the checker reads: governed paths, reserved icons, attach-point positions, slug rules, and `VERSION_DRIFT_POLICY` (how loud version drift is)                                                     | edit the knob, never the rule                                                                                         | **Read on every checker run**, so it takes effect immediately. **You edit it** when the notation gains a landmark, a governed path moves, or you want drift reported differently.                                                                                                 |
| `scripts/messages.mjs` | **Nothing on its own** — **every string the checker prints**: rule titles, failures, skips, per-rule counts, the run summary, and even single words spliced into another line. Each documented with where it is used, why it exists, and when a person sees it | no exceptions to argue over — three narrower boundaries were each applied inconsistently within days, and `dead-messages` now enforces this one in both directions | **Read on every checker run.** **You edit it** whenever any wording the tool says should change |
| `scripts/superpowers-baseline.json` | **Nothing on its own** — it records the Superpowers version this workflow was last reviewed against, so `sp-version` can notice a change nobody announced                                                                                | one comparison: installed version vs reviewed version                                                                 | **Read on every checker run.** **You edit it once**, as the closing step of an upgrade review — never to silence a failure.                                                                                                                                                       |
| `scripts/allowlist.mjs`            | **Nothing on its own** — it holds deliberate suppressions of checker findings, each with a `why`. The `allowlist-hygiene` rule fails when an entry stops matching anything, so a suppression cannot outlive the text it was written for  | one entry per suppression: rule + file + a distinctive substring + the reason                                         | **Read on every checker run.** **You add to it only** for a genuine false positive — never to reach green. It is **empty on purpose**: the one entry ever written was retired by fixing the text it suppressed, which is the pattern to copy                                      |
| `SKILL.md` (this file)              | **A stale _copy_ of a rule** — text that still parses perfectly but now contradicts the change you just made. No script can find this; the _Before calling a workflow change done_ sweep is what does                                    | grep a distinctive phrase from the text you replaced across `AGENTS.md`, `CONTEXT.md`, `docs/`, `.agents/skills/`     | **Nothing loads it for you.** A **PreToolUse** hook points you here at the moment of the edit — but a hook can only point; opening it is your call.                                                                                                                               |
| `assets/scenarios/README.md`        | **Behaviour that changed in a way you did not intend** — a hook on the wrong lifecycle moment, a gate asking the wrong question, an edit to one hook altering routing elsewhere                                                          | RED / GREEN / **CONTROL** subagent runs against pre- and post-change docs                                             | **Nothing loads or runs these, and nothing points at them either.** You reach for them deliberately, and only when the change alters what an agent _decides_ (a new gate, a re-anchored hook, reworded routing). A pure reference fix skips them.                                 |
| `references/superpowers-upgrade.md` | **A Superpowers behaviour we depend on that quietly moved** — 12 of our assumptions rest on single sentences in Superpowers' own files                                                                                                   | re-read the named sentence in the new version; the table sorts every dependency by whether breakage is loud or silent | **Nothing loads it for you.** When `sp-version` reports version drift, a **SessionStart** hook surfaces a _pointer_ to it at the start of the session — so you do not have to notice the change yourself. It passes the path, never the contents; reading it is still a decision. |

**The three real cases, so the split is concrete rather than theoretical:**

| What went wrong                                                                                                                                                       | Checker       | Caught by      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------------- |
| `AGENTS.md` linked `#superpowers-first-workflow`; the `🦸` in the heading makes the slug `-superpowers-first-workflow`. Plus all 24 `[🔝]` links in the rationale doc | **caught it** | the checker    |
| `x-ng-sp-plan-enricher` put implementer conventions in Global Constraints, which only reach an implementer if the controller carries them                             | **green**     | a scenario run |
| `sp-workflow-rationale.md` said implementers "get the plan's Global Constraints and nothing else" — false after that fix                                              | **green**     | the sweep      |

Rows 2 and 3 are the point: **every reference in them resolved perfectly.** The sentence was simply wrong, and a script cannot tell.

**So: a green checker means "no reference is broken". It never means "the change is correct."**

## The rule

**Every change to the workflow is a rename in disguise.** The system's load-bearing parts are _references_: a hook ID cited from a `Spans:` line, an anchor in a pointer, a Superpowers skill name a hook hangs off, a description duplicated into a `.claude/` stub. Each of those breaks **silently** — a stale hook ID, a dead anchor and a drifted stub all still read as plausible, so review does not catch them.

So the discipline is not "edit carefully". It is: **make the edit, then prove the references still resolve.**

```bash
node .agents/skills/x-sp-workflow-helper/scripts/check-workflow.mjs
```

Exit 0 means every declared invariant holds. Run it **before** your edit too, so you know which failures you inherited and which you caused.

## The checker

Fourteen rules, each one a failure class that has actually happened here. `--list` prints them; `--rule=<id>` runs one; `--json` for tooling.

| Rule                | Catches                                                                                                                                                                                                                                                                                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hook-ids`          | a cited hook ID with no matching `#### 🪝` heading — the renumbering failure                                                                                                                                                                                                                                                                                   |
| `links`             | a cited file or directory that does not exist                                                                                                                                                                                                                                                                                                                  |
| `anchors`           | a `#anchor` no heading yields, under either real renderer's slug algorithm                                                                                                                                                                                                                                                                                     |
| `sp-skills`         | a hook anchored to a Superpowers skill that is **not installed** — the dangling-hook failure                                                                                                                                                                                                                                                                   |
| `sp-version`        | Superpowers absent, disabled, installed-from-nothing, or at a version this workflow has never been reviewed against — the trigger for the upgrade playbook. Severity follows `VERSION_DRIFT_POLICY` (major/minor fail, patch notes). Run at **session start** by its own hook, because a version change lands at startup and a workflow edit may be weeks away |
| `x-skills`          | a named skill that is missing, a stub whose `description` has drifted, an orphan stub, a `name:`/folder mismatch                                                                                                                                                                                                                                               |
| `versions`          | a skill with no block-form semver                                                                                                                                                                                                                                                                                                                              |
| `path-isolation`    | one path file citing another                                                                                                                                                                                                                                                                                                                                   |
| `landmarks`         | a `####` heading that is not a hook, a malformed hook heading, a reserved icon misused, a `Spans:`/`Members:` that names no ID                                                                                                                                                                                                                                 |
| `skill-coupling`    | an `x-*` skill naming a hook ID or path letter (outside the `x-*-sp-*` family)                                                                                                                                                                                                                                                                                 |
| `hook-refs`         | a doc or skill naming a hook SCRIPT by filename — a rename would silently falsify it, so name the event and point at the registry                                                                                                                                                                                                                              |
| `hook-paths`        | a hook script naming a repo file that does not exist — the reverse of `hook-refs`                                                                                                                                                                                                                                                                              |
| `dead-messages`    | prose in the wrong place — exported from `messages.mjs` but never wired (two copies that drift), or left as a string literal in any sibling script. Both directions, all three quote styles (`'`, `"`, backtick), every script in the folder |
| `allowlist-hygiene` | a suppression that no longer matches anything                                                                                                                                                                                                                                                                                                                  |

**What it cannot check.** It verifies that references _resolve_, never that prose is _correct_. A hook attached to the wrong lifecycle moment, a gate that asks the wrong question, a rule that contradicts another in plain English — all pass. Those need the scenario run below. Do not read a green checker as "the change is right".

### Suppressing a finding

`scripts/allowlist.mjs`, with a `why`. Only for a genuine false positive — the standing case is a doc that _quotes_ a violation as a counter-example. `allowlist-hygiene` fails when an entry stops matching, so a suppression cannot outlive the text it was written for.

**A growing allowlist means the rule is wrong, not that the repo is.** Past two or three entries for one rule, fix the rule.

## Hook scripts

Hooks are the one part of this system a harness runs _for_ you. That is also why they are the part most able to move, be rewired, or stop firing without any document noticing — so the rules below are all about keeping that from happening quietly.

**They live in `.agents/hooks/`, and that is canonical for every harness.** Same split as a skill: the script is the content, and each harness registers it in its **own** registry — `.claude/settings.json` for Claude Code, `.cursor/hooks.json` for Cursor, project-scoped `config.toml` for Codex. A registry entry is a **pointer**, exactly as a `.claude/skills/` stub is for a skill. Wiring a second harness therefore adds an entry; it never copies a script, and there is no per-harness hooks directory to copy one into.

**What a hook script may rely on** — three constraints, each closing a failure that is invisible on the machine you wrote it on:

| Constraint                                                                                                      | Why                                                                                                                                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pure Node, no dependencies** — no `jq`, no shell or PowerShell syntax                                          | it runs identically on macOS, Linux and Windows, and it cannot be broken by an install step nobody ran                                                                                                                                                    |
| **Resolve every path from the script's own location**, `dirname(fileURLToPath(import.meta.url))` — never the cwd | harnesses disagree on the working directory they invoke a hook in. Claude Code happens to use the project root; Codex uses the _request_ cwd, so a cwd-relative path there works from the root and fails from a subdirectory — intermittently, and silently |
| **Launched by one OS-portable registry `command`** — no bash `$VAR` / cmd `%VAR%` split | A command that only works on one OS never starts the script on the others, and nothing catches that. Claude Code's and Cursor's cwd-relative `node .agents/hooks/…` meets this because those harnesses start at the project root on Windows, macOS and Linux. |

**Everything that varies by harness comes from `.agents/hooks/harness.mjs`** — `readInput`, `eventName`, `editedPath`, `emit`, `quiet`. Each answers a question whose answer differs between harnesses, and answers it by **reading what the harness actually sent**. Every export is total: it returns a value rather than throwing, so a hook fails closed instead of taking the harness down with it.

**Never add a per-agent lookup table** (`{claude: 'PreToolUse', gemini: 'BeforeTool'}`). It encodes guessed knowledge of contracts nobody verified, every new harness needs an entry, and a wrong entry fails silently — the same trap `SP_PROBES_UNVERIFIED` exists to warn about. Derive from the payload instead, which is why the module can be written while a harness's contract is still unknown.

`editedPath` returns **`{ path, unknownShape }`**, and `unknownShape` is the whole reason it is a helper rather than a `??` chain. "Nothing was edited" (stay quiet) and "a tool payload arrived and no path could be found in it" used to look identical, so the second went unnoticed. **`unknownShape` must be reported, never swallowed** — a guard that goes silent because it did not understand its input is the exact failure a guard exists to prevent.

**`harness.mjs` is the one hook file our docs may name.** Every _registered_ script is off-limits by filename, because a rename would leave the doc reading perfectly while pointing at nothing — name the **event** and the job instead. The shared module has the opposite failure mode: nothing registers it, and its siblings import it by relative path, so renaming it breaks a Node import **loudly**. It is exempted in `HOOK_REF_PATTERN` by a negative lookahead deliberately, not by oversight — remove the exemption to tidy it up and this section stops being writable.

**Deriving the event name is for the edit guard, not for SessionStart.** `readFileSync(0)` is a **blocking** read, and a session-start hook that blocks hangs startup before anything else runs — observed here as an exit-124 timeout, which is a far worse outcome than a wrong event name. So the split is by event, and it is a rule rather than a compromise:

- **The edit guard derives.** It already reads stdin to find the edited path, and the tool-use event names genuinely do differ between harnesses — Gemini CLI calls those moments `BeforeTool` and `AfterModel`. A literal there is wrong the moment the registration differs, and at least one harness validates the name it gets back.
- **The SessionStart hooks read no stdin and pass a literal.** Claude Code, Codex and Gemini spell that event `SessionStart`; Cursor spells it `sessionStart`. Reading stdin to pick the spelling would hang startup, so they keep the Claude Code nested field and `emit()` mirrors it onto Cursor's top-level `additional_context`. Do not unify these into a single derive.

**Registering the guard requires a file-editing matcher.** Its unrecognised-payload report is **unconditional on purpose** — it is the only thing standing between a payload shape we failed to anticipate and a silent no-op. The consequence is that a registration with no per-tool matcher would fire it on _every_ tool call in the session. So a file-editing matcher (Claude Code uses `Edit|Write`; Cursor uses `Write|StrReplace|Delete|EditNotebook`) is a **precondition** of wiring the guard on any harness, not a tuning preference. Narrowing the report instead would reopen the silent path it was built to close.

Cursor's `preToolUse` cannot inject context into the model (allow / deny / rewrite only). The pre-edit reminder is therefore **not registered** there; `sessionStart` and `postToolUse` are.

**Which registries are guarded, and how one gets promoted.** `GUARDED_FILES` in the guard lists a registry only once that harness's contract is **verified** — our scripts actually function there, via `harness.mjs` when the stdin/stdout shape is not Claude Code's. Today that is Claude Code, Codex, and Cursor. Everything else is recorded **here, as prose**: this list drives no behaviour, and making it a constant would invite something to act on it.

| Not guarded                                                                                       | Where it stands                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Gemini CLI** (`.gemini/settings.json`)                                                          | hooks confirmed, and a real project-scoped registry — but a divergent event vocabulary and an **unverified** payload contract, so we cannot claim these scripts would function there |
| **Antigravity · Factory Droid · GitHub Copilot CLI · Kimi Code · OpenCode · Pi**                  | harnesses Superpowers ships for whose hook support has not been checked at all                                                                                                      |

**Promotion order**, in this order and no other: confirm the harness has hooks → confirm its project-scoped registry path → confirm its payload contract against one of these scripts → add the path to `GUARDED_FILES`. **Never add a guessed path.** An invented path matches nothing, can never be caught doing nothing, and converts a known gap into a false claim of coverage — the same discipline as `SP_PROBES_UNVERIFIED`.

**Declaring a path whose absence is by design — `OPTIONAL_HOOK_PATHS`** (`scripts/config.mjs`). `hook-paths` is there to catch a hook pointing at a file that was renamed or moved; a path the hook guards with `existsSync` and handles correctly either way is not breakage and must not be reported as such. Three properties of the knob matter:

- It is an **explicit list, deliberately not inferred** from a nearby `existsSync`. Inference would exempt every future guarded path, including the ones where absence _is_ the breakage — which is this rule's entire job.
- It is **self-cleaning**: `hook-paths` fails on an entry that no hook named during the run. A stale exemption does nothing except sit ready to pre-emptively excuse some future hook that names a genuinely **required** file of the same name.
- Deleting an entry restores the check, so making a path required again is one line.

Today's only entry is `AGENTS.local.md` — per-developer overrides, gitignored on purpose.

**Adding a hook.** `hook-paths` covers it with no edit at all: the rule walks the directory. The registry entry is a **separate edit in a separate file**, and every registry in `GUARDED_FILES` is itself a guarded surface — so the guard fires on that edit and the checker runs behind it.

**The governance boundary: prose inside `.agents/hooks/` is not checked.** `dead-messages` covers this skill's own `scripts/` folder only, so a hook's comments and the sentences it emits are held to review and nothing else. That is a known limit rather than an oversight — but it means the sweep in _Before calling a workflow change done_ is the only thing that will notice a hook still explaining a rule you just changed.

## Prove behaviour changed the way you intended

The checker proves references resolve. It cannot prove an agent will _do_ the right thing. For that, run the change as a scenario — this is the RED/GREEN method from Superpowers' **skill-authoring skill** (today `writing-skills`), and it applies to these docs directly: that skill's own worked example tests `CLAUDE.md` variants, not a skill.

`assets/scenarios/` holds the harness and the standing scenarios. The short form:

1. **RED** — dispatch a subagent with the task and the **pre-change** docs. Record what it actually does, verbatim.
2. **GREEN** — same task, same pressures, **post-change** docs. The behaviour you were trying to change must change, and nothing else may.
3. **Watch for collateral change.** This is the failure mode this workflow is exposed to: an edit meant to affect one hook alters routing three hooks away. Assert the _unrelated_ behaviours too, not only the one you touched.

Reach for this when the change alters **what an agent decides** — a new gate, a re-anchored hook, a reworded routing rule. A pure reference fix (a corrected anchor, a moved rule with identical wording) needs the checker only.

## Before calling a workflow change done

1. **Run the checker.** Zero failures, or every remaining one pre-existing and named.
2. **Sweep for the rule's other homes.** Take a distinctive phrase from the text you replaced and grep `AGENTS.md`, `CONTEXT.md`, `docs/` and `.agents/skills/`. This is `x-skill-build-helper` → _Before calling a rule change done_, and it applies to workflow edits identically — the checker finds broken **references**, never a stale **copy** of a rule that still parses.
3. **Confirm the fact is in exactly one home** — `docs/agents/where-content-lives.md`. Moving a rule means the old site becomes a pointer, not a second copy.
4. **Record the reasoning only if it earns an entry** — the bar is the intro note on `docs/agents/sp-workflow-rationale.md` (_What earns an entry_). One entry with its **Revisit if**. Skip it when the path file plus the notation catalog already answer "why". An extra entry gets questioned; an undocumented decision that *does* earn one gets re-litigated.
5. **Update the todo/step count** if you added or removed a step: a step that no path turns into a todo is a step that gets skipped.

## Common mistakes

| Mistake                                            | Fix                                                                                                                                         |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Renumbering hooks and fixing only the path file    | `Spans:`, `Members:`, `⚪` lines, the `x-*-sp-*` skills and this repo's memory all cite IDs. Run `hook-ids`.                                |
| Trusting an anchor because the file exists         | A heading starting with an emoji never yields the slug you would guess — `## 🦸 Title` is `#-title`. Run `anchors`.                         |
| Re-anchoring a hook to a plausible-sounding skill  | Check it is installed and read its own `description`. A hook on a skill that is never invoked never fires, and looks fine. Run `sp-skills`. |
| Changing a skill's `description` without its stub  | The Skill tool matches the stub. Run `x-skills`.                                                                                            |
| Adding a rule to the path file you had open        | `where-content-lives.md` decides the home. A path-local copy of a shared rule drifts.                                                       |
| Making one path cite another                       | Extract to the shared rules or the procedures file. Run `path-isolation`.                                                                   |
| Reading a green checker as "the change is correct" | It proves references resolve, nothing more. Behaviour changes need a scenario run.                                                          |
| Widening the allowlist to get to green             | A false positive means fix the rule; a true positive means fix the repo.                                                                    |
| Editing a path file without the notation           | `sp-workflow-format.md` in full first — the `Shape` lines are the point when editing.                                                       |
| Naming a hook script by filename in a doc          | Name the **event** and the job ("a SessionStart hook reports…"); point at the harness's own hook registry for what is wired. Run `hook-refs`.       |
| Adding a rationale entry because "a decision changed" | The bar is the intro note _What earns an entry_ on the rationale file. Using a 📌 as defined, or restating **Leaves alone**, does not earn one. |

## Confirm the current tooling before relying on this

The checker discovers the installed Superpowers by scanning the plugin cache, and reports both the version and the marketplace it came from.

When it finds nothing, `sp-version` **FAILS** — an absent plugin makes the workflow inoperative, not merely unverified — while `sp-skills` **SKIPS** and defers to it, so one root cause produces one failure. **A SKIP is never a pass.**

The cache layout is what it is **today**. Re-read `scripts/check-workflow.mjs` → `findSuperpowersSkills` rather than trusting this paragraph; the marketplace name is deliberately not assumed, so a change in how this workspace obtains Superpowers needs no edit here.
