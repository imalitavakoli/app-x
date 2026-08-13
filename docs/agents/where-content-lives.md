[🔙](../../README.md#agents)

# Where content lives 🗂️

**One fact, one home.** Before writing anything an agent will read, decide which surface owns it. Writing it in the surface you happen to have open is how the same rule ends up in nine files, each drifting from the others.

This doc is the single authority on that decision. `AGENTS.md` and `x-skill-build-helper` both point here rather than carrying their own partial copies.

&nbsp;

## The table

| The fact is…                            | Home                                        | Loaded when                        |
| --------------------------------------- | ------------------------------------------- | ---------------------------------- |
| what a term **means**                   | `CONTEXT.md` (repo root)                    | you meet an unfamiliar term        |
| a rule **every** request needs          | `AGENTS.md`                                 | every turn (SessionStart)          |
| a rule only **one path** needs          | `docs/agents/sp-workflow-path-{a,b,c}.md`   | on that path                       |
| **why** a workflow decision was made    | `docs/agents/sp-workflow-rationale.md`      | questioning a decision             |
| the **notation** of the path files      | `docs/agents/sp-workflow-format.md`         | editing a path file                |
| how to edit **`AGENTS.md`** itself      | `docs/agents/agents-md-format.md`           | editing `AGENTS.md`                |
| how to edit **`CONTEXT.md`** itself     | `docs/agents/context-md-format.md`          | adding or changing a term          |
| **how to perform** a step               | the skill that owns it                      | that skill is invoked              |
| how a **subsystem** works               | the relevant `docs/` page                   | working on that subsystem          |

&nbsp;

## The sharp edge: a term's meaning vs its consequences

The first two rows collide constantly, so the boundary is explicit:

- **`CONTEXT.md` gets the definition** — what the thing *is*, in one or two sentences.
- **The subsystem doc gets the consequences** — what follows from it: what it may own, import, or require; how it is built, versioned or tested.

| Fact                                                                                       | Home                                                                   |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| "A **grab-bag** holds several unrelated items sharing only a technical kind."               | `CONTEXT.md`                                                           |
| "A grab-bag is therefore not a functionality, so it gets no PRD/TFS — it uses a local `requirements/`." | `docs/getting-started/library-types-and-their-relationship.md`         |

A skill or doc that needs the consequence writes **one line of consequence plus a term citation**, never a re-derivation of the definition:

> A **grab-bag** (`CONTEXT.md`) is not a functionality, so it has no PRD — see `docs/getting-started/library-types-and-their-relationship.md` → Single-purpose vs grab-bag.

&nbsp;

## What qualifies for `AGENTS.md`

`AGENTS.md` is read in full on **every** request, so its budget is the scarcest in the workspace and its row above is the hardest to earn. The bar, and how to write a pointer that costs less than the content it replaces, live with the file they govern: [agents-md-format.md](agents-md-format.md).

&nbsp;

## When a rule already exists in more than one place

Do not add a third. **Pick the home from the table, move the rule there, and replace the others with a pointer** — in the same change. Then take a distinctive phrase from what you removed and grep `AGENTS.md`, `CONTEXT.md`, `docs/` and `.agents/skills/` for it, so the copies you forgot writing surface now rather than after they contradict each other.

[🔙](../../README.md#agents)
