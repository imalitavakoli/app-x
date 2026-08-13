[🔙](../../README.md#agents)

# Where content lives 🗂️

**One fact, one home.** Before writing anything an agent will read, decide which surface owns it. Writing it in the surface you happen to have open is how the same rule ends up in nine files, each drifting from the others.

This doc is the single authority on that decision. `AGENTS.md` and `x-skill-build-helper` both point here rather than carrying their own partial copies.

&nbsp;

## The table

| The fact is…                         | Home                                      | Loaded when                 |
| ------------------------------------ | ----------------------------------------- | --------------------------- |
| what a term **means**                | `CONTEXT.md` (repo root)                  | you meet an unfamiliar term |
| a rule **every** request needs       | `AGENTS.md`                               | every turn (SessionStart)   |
| a rule only **one path** needs       | `docs/agents/sp-workflow-path-{a,b,c}.md` | on that path                |
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

Pointing instead of copying is what keeps one fact in one home — but a badly written pointer costs more context than the duplication would have. Four rules, each learned from a pointer in this repo that failed:

1. **The cost is the _target_, not the pointer.** Eight words pointing at a 262-line doc cost 262 lines every time they fire unnecessarily. Pruning the pointer's wording is worth little; getting its **condition** right is worth everything.
2. **State when to read it — or when _not_ to.** A topic ("the reasoning is in `X`") gives an agent nothing to decide with, so the safe default is to follow it. A **trigger** ("read `X` when you meet a term you cannot define from the request alone") or a **skip-condition** ("rationale only, never needed to execute a cycle") is what makes it skippable. Prefer the skip-condition for a doc that is rarely needed.
3. **Match the verb to the shape of the target.** **Look up** a lookup surface — a glossary, an index, a registry, an ID table; **read** only what is meant to be read end to end. "Read `CONTEXT.md`" spends 200+ lines to answer one term. "Look the term up in `CONTEXT.md`" spends one entry.
4. **Every inbound pointer must filter, not just the one you are writing.** It only takes one unfiltered route in to defeat all the filtered ones. When a doc gains a pointer, grep its other inbound pointers and check they all carry a condition.

&nbsp;

## When a rule already exists in more than one place

Do not add a third. **Pick the home from the table, move the rule there, and replace the others with a pointer** — in the same change. Then take a distinctive phrase from what you removed and grep `AGENTS.md`, `CONTEXT.md`, `docs/` and `.agents/skills/` for it, so the copies you forgot writing surface now rather than after they contradict each other.

[🔙](../../README.md#agents)
