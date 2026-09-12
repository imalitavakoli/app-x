<!--
  WORKED EXAMPLE — verdict: Fail

  Imitate the shape, the register, and the level of detail. Do not copy the
  findings: they belong to one branch that no longer exists.

  Trimmed to five findings so the shape stays readable. A real report carries
  as many as it has.

  What this example is here to demonstrate:
    · the verdict first, with counts, before any finding
    · every finding names its consequence in plain language, not the rule name
    · the rule is QUOTED from its doc, never paraphrased
    · a finding with no rule behind it says so, rather than implying one
    · several symptoms of one unfinished change reported as ONE finding
    · an uncommitted file marked as not yet in the pull request
    · "Automated checks" carrying a real reason for not running, and no
      prediction of what would have happened
    · a broken map path reported as a `chore` against the reviewer itself
-->

# Code review — `feature/TEA-1-add-card`

## Verdict

❌ **Fail** — the card cannot open in the app as written, and it breaks three written workspace
rules in a shared lib that other apps can use.

4 blocking · 1 non-blocking · 4 files reviewed

## What changed

This change adds a card to a shared `ui` lib (a lib that only displays things). The card asks a
shared user service for the current user and writes that user to the browser console. The change
also adds a stylesheet for the card, and a route so the app can open the card at the address
`/card`.

## What I reviewed

| Part of your work        | Reviewed | Note                                                    |
| ------------------------ | -------- | ------------------------------------------------------- |
| Committed on this branch | yes      | 2 commits, 3 files                                      |
| Committed but not pushed | yes      | none — this branch has no upstream yet                  |
| Saved but not committed  | yes      | 1 untracked file — **not part of the pull request yet** |

Compared against `origin/master` at `9c584ff`. The branch is 0 commits behind.

## 🛑 Blocking

### 1. The card loads a data service it is not allowed to load

**issue (blocking)** · `libs/shared/ui/ng-card/src/lib/v1/card.ts:1`

`card.ts` sits in a `ui` lib. It imports `@fx/shared/data-access/ng-user`, which is a
`data-access` lib. The import table forbids that direction.

**Why this matters:** a `ui` lib is meant to receive its data from whoever shows it. Because this
card fetches its own user, nobody can show the card with different data — not another app, not a
test, not a design preview. Every screen that uses the card is tied to this one user source.

**Rule:** `docs/getting-started/library-types-and-their-relationship.md#import-matrix` — the `ui`
row reads: "data-access | NO".

**To fix:** remove the import and the `getUser()` call. Accept the user as an input, and let the
calling `feature` lib fetch it. I do not make this change.

### 2. The change looks unfinished — the route cannot open this card

**issue (blocking)** · `apps/ng-boilerplate/src/app.routes.ts:1`

Four facts point at one conclusion. `V1CardComponent` has no Angular `@Component` marker, so
Angular does not treat it as a component. The route calls `import("@fx/shared/ui/ng-card")` and
hands the whole result to `loadComponent`, with no step that picks `V1CardComponent` out of it.
No file exports `V1CardComponent` through a package entry point. And `card.scss` is named by no
file — I searched for `card.scss` and for `styleUrl` and found no match.

**Why this matters:** a person who opens `/card` sees an error or an empty page instead of a
card. The stylesheet has no effect at all.

**Rule:** no workspace document covers this. It is a defect, not a broken rule.

**To fix:** add the `@Component` marker with `styleUrl` pointing at `card.scss`, export the
component from the lib's entry point, and make the route read `.then(m => m.V1CardComponent)`.
You said the branch works when you run it, and I could not run it here — please confirm.

### 3. The stylesheet hardcodes two colors

**issue (blocking)** · `libs/shared/ui/ng-card/src/lib/v1/card.scss:2` and `:4`

Line 2 sets `--card-bg: #3355ff`. Line 4 sets `color: rgb(20, 20, 20)`.

**Why this matters:** every brand that uses this card renders the same blue background and the
same near-black text. A brand's own colors are ignored, so the card looks wrong in every product
except the one you designed it against.

**Rule:** `docs/guidelines/best-practices.md` — "Never hardcode colors. Use dynamic brand custom
properties."

**To fix:** replace both literal colors with the brand custom properties the workspace publishes.

### 4. The README does not describe the new code

**issue (blocking)** · `libs/shared/ui/ng-card/README.md`

The file still reads "A card." The lib now has a component, a stylesheet, and a route that opens
it. None of that appears in the README.

**Why this matters:** the next person to use this card reads the README first. It tells them
nothing they need, so they read the source instead — and they cannot tell whether the README is
merely thin or actually wrong.

**Rule:** `docs/guidelines/best-practices.md` — "Keep each lib's README.md current with the
code."

**To fix:** describe the component, its inputs, and how to open it.

## Non-blocking

### 5. A saved file is not committed and does not belong in this lib

**note** · `libs/shared/ui/ng-card/src/lib/v1/stray.ts`

The file contains `export const stray = true;` and is untracked.

**Why this matters:** it is **not** in the pull request today. But `git add -A` would sweep it in,
and it would then ship inside a shared lib that every app can import.

**Rule:** no document covers a stray file. This is a judgement.

**To fix:** delete it, or commit it deliberately if it was meant to be part of the work. I did
not delete it — an untracked file cannot be recovered, so that call is yours.

## Done well

- The branch name `feature/TEA-1-add-card` and both commit subjects match
  `docs/guidelines/naming-conventions.md#git` exactly.
- The new files went into the existing `v1` folder rather than creating a new version folder,
  which is correct for an addition that breaks nothing.

## Automated checks

| Check      | Command | Result                                                                                             |
| ---------- | ------- | -------------------------------------------------------------------------------------------------- |
| Lint       | —       | **not run** — no `package.json` or `nx.json` in this repository, so there are no affected projects |
| Unit tests | —       | **not run** — same reason, and no `*.spec.ts` exists anywhere in the repository                    |
| e2e        | —       | **not run** — no e2e specs in the diff, and you did not ask for them                               |

I am not predicting what these would report.

## What I did not check

- Whether the app builds or the route renders — no build tooling in this repository.
- Whether the `@fx/...` import path resolves — no `tsconfig.base.json` defines it here.
- Whether the brand custom properties exist under the names I suggested — I could not find the
  `ui` lib that publishes them.
- Two paths in my own doc map do not exist in this repository, so those checks did not run:
  `CONTEXT.md` and `docs/guidelines/pr-rules.md`. Reported as finding 6 in the JSON.

## Suggested reviewers

| Owner  | Owns                | Note                                          |
| ------ | ------------------- | --------------------------------------------- |
| `@Bo`  | `libs/shared/ui/**` | from `CODEOWNERS`, not resolved to an account |
| `@Ali` | `*`                 | catch-all owner; you are the author           |

## Suggested labels

`shared-lib`, `architecture-violation`, `docs-out-of-date`

---

## 🔧 To get these fixed

Start a new cycle and give the agent this file:

```
.agents/_local/skills/x-code-diff-reviewer/latest.json
```

It holds every finding with its exact path, line range, consequence and rule source. This report
is written for a person to read; that file is written for an agent to act on.

Fixing 2 also resolves 4 — once the component renders, its README can describe what it does.
