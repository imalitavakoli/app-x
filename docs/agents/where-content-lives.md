[🔙](../../README.md#agents)

# Where content lives 🗂️

**One fact, one home.** Before writing anything an agent will read, decide which surface owns it. Writing it in the surface you happen to have open is how the same rule ends up in file after file, each drifting from the others.

This doc is the single authority on that decision. `AGENTS.md` and `x-skill-build-helper` both point here rather than carrying their own partial copies.

&nbsp;

## The table

| The fact is…                         | Home                                      | Loaded when                 |
| ------------------------------------ | ----------------------------------------- | --------------------------- |
| what a term **means**                | `CONTEXT.md` (repo root)                  | you meet an unfamiliar term |
| a rule **every** request needs       | `AGENTS.md`                               | every turn (SessionStart)   |
| a rule only **one path** needs       | `docs/agents/sp-workflow-path-{a,b,c}.md` | on that path                |
| a **procedure** more than one path performs | `docs/agents/sp-workflow-procedures.md` | when a hook cites it |
| **why** a workflow decision was made | `docs/agents/sp-workflow-rationale.md`    | questioning a decision      |
| the **notation** of the path files   | `docs/agents/sp-workflow-format.md`       | editing a path file         |
| how to edit **`AGENTS.md`** itself   | `docs/agents/agents-md-format.md`         | editing `AGENTS.md`         |
| how to edit **`CONTEXT.md`** itself  | `docs/agents/context-md-format.md`        | adding or changing a term   |
| **how to perform** a step            | the skill that owns it                    | that skill is invoked       |
| how a **subsystem** works            | the relevant `docs/` page                 | working on that subsystem   |

&nbsp;

## The sharp edge: a term's meaning vs its consequences

The first two rows collide constantly, so the boundary is explicit:

- **`CONTEXT.md` gets the definition** — what the thing _is_, in one or two sentences.
- **The subsystem doc gets the consequences** — what follows from it: what it may own, import, or require; how it is built, versioned or tested.

| Fact                                                                                                    | Home                                                           |
| ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| "A **grab-bag** holds several unrelated items sharing only a technical kind."                           | `CONTEXT.md`                                                   |
| "A grab-bag is therefore not a functionality, so it gets no PRD/TFS — it uses a local `requirements/`." | `docs/getting-started/library-types-and-their-relationship.md` |

A skill or doc that needs the consequence writes **one line of consequence plus a term citation**, never a re-derivation of the definition:

> A **grab-bag** (`CONTEXT.md`) is not a functionality, so it has no PRD — see `docs/getting-started/library-types-and-their-relationship.md` → Single-purpose vs grab-bag.

&nbsp;

## What qualifies for `AGENTS.md`

`AGENTS.md` is read in full on **every** request, so its budget is the scarcest in the workspace and its row above is the hardest to earn. The bar, and how to write a pointer that costs less than the content it replaces, live with the file they govern: [agents-md-format.md](agents-md-format.md).

&nbsp;

## Writing a pointer

Pointing instead of copying is what keeps one fact in one home — but a badly written pointer costs more context than the duplication would have. Each rule below was learned from a pointer in this repo that failed:

1. **The cost is the _target_, not the pointer.** A pointer is a handful of words; what it charges is the whole thing it points at, every time it fires unnecessarily. Pruning the pointer's wording is worth little; getting its **condition** right is worth everything.

   Describe a target by its **shape** — long, multi-topic, sectioned, a registry — never by a line count. Counts rot on the next edit to a file you do not own; shapes stay true.

2. **State when to read it — or when _not_ to.** A topic ("the reasoning is in `X`") gives an agent nothing to decide with, so the safe default is to follow it. A **trigger** ("read `X` when you meet a term you cannot define from the request alone") or a **skip-condition** ("rationale only, never needed to execute a cycle") is what makes it skippable. Prefer the skip-condition for a doc that is rarely needed.
3. **Match the read to the shape of the target — a partial read is not always the cheap one.**

   | The target is…                                                                          | Read                                                                                         |
   | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
   | a **lookup surface** — glossary, index, registry, ID table, large multi-topic reference | the one entry or section, named in the pointer                                               |
   | a **contract or procedure** — a path file, the shared rules, a `SKILL.md`, a template   | **in full**, and the pointer must say _in full_ — its parts interact, so half of it misleads |
   | a document you are **updating** — a PRD, a TFS lib file, a registry you are editing     | **in full**, so you cannot miss the entry that contradicts the change you are about to make  |

   **The test: do you arrive with a question, or with a job?** A question has its answer in one place — point at that place. A job needs the whole contract, because you do not yet know which parts will bind. Most of this workspace's mandated reads are jobs, and they are correctly whole-file: `AGENTS.md` every turn, a path file before executing it, a `SKILL.md` before following it.

4. **For a lookup, point at the section — and give a way in when you cannot name one.** `library-types-and-their-relationship.md` spans every lib type, every functionality type, the import matrix and versioning — pointing at it whole means all of that; `… → Single-purpose vs grab-bag` costs one section and tells the reader where they are done.

   When the pointer is general orientation rather than one question, name the target's **entry point** — its cheat-sheet, index or summary — and say to scan the headings for the rest. Never write "do not read it whole" on its own: to choose a section you must first know which sections exist, so a bare prohibition asks for something the reader has no way to do. **State the route in, not the route barred.**

5. **Cite what survives an edit.** A **path** and a **section heading** survive the target being rewritten; a line number, an ordinal ("the third bullet"), a count, or a quoted sentence does not — and each of those fails _silently_, still pointing somewhere plausible after the thing it meant has moved.
   - **Do:** `docs/…/naming-conventions.md#git`, or `… → Single-purpose vs grab-bag`.
   - **Don't:** "see line 62", "the second table", "the 417-line doc", or a paraphrase of the target's wording that must now be kept in sync with it.
   - **Verify the anchor**, not just the file: check `#the-anchor` matches a real heading before you commit, the same way you check the path exists. A broken anchor lands the reader at the top of a long doc with no signal that anything is wrong.

   Which paths are safe to cite at all — `docs/` freely, code under `libs/` / `apps/` only conceptually — is `x-skill-build-helper` → _Don't hardcode paths to volatile code_. This rule is about how to cite once you know you may.

6. **Every inbound pointer must filter, not just the one you are writing.** It only takes one unfiltered route in to defeat all the filtered ones. When a doc gains a pointer, grep its other inbound pointers and check they all carry a condition — and check you are not adding a second pointer to a target the same file already points at.

&nbsp;

## When a rule already exists in more than one place

Do not add a third. **Pick the home from the table, move the rule there, and replace the others with a pointer** — in the same change. Then take a distinctive phrase from what you removed and grep `AGENTS.md`, `CONTEXT.md`, `docs/` and `.agents/skills/` for it, so the copies you forgot writing surface now rather than after they contradict each other.

[🔙](../../README.md#agents)
