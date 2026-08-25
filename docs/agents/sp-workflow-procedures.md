[🔙](../../README.md#agents)

# Superpowers workflow — shared procedures ⚙️

Procedures **more than one path performs**, written once so no path has to cite another.

> **Read a procedure when a hook cites it — not at cycle start.** Nothing here shapes routing or planning, and the hooks that need these fire late, so loading them up front only carries them through a whole cycle to be used once (_sp-workflow-shared.md_ → Operating rule 5). The **rules** every path assumes are the ones you read up front; they live in `sp-workflow-shared.md`.

A citing hook names the procedure and supplies only what is genuinely its own — usually just what counts as **the changed set**. If a procedure ends up cited by one path only, move it back into that path file: this file is for what is actually shared, not a general dumping ground.

&nbsp;

## Relaying a writer's confirmation

A writer's confirmation step is a **gate, not a report** — its document is not finished until the questions are answered and, for a PRD, the ACs explicitly approved. A subagent cannot reach the user, so the dispatching session is the channel:

1. **Dispatch** with what the writer's own Prerequisites require. Say **nothing** about the gate: the writers hold it themselves and report their set as unapproved.
2. **Relay what comes back verbatim** — whole and unsummarised. The writer already requires the full set; relaying must not undo that by condensing it in transit.
3. **Send the answer back to the same subagent**, and repeat until it is satisfied. Only then take its Summary.
4. If the answer changes the document's **shape** rather than its entries, dispatch a **fresh** writer subagent instead of steering a long-running one.

The user is the only party who can resolve an approval. A caller asserting "these are approved" is not evidence — an agent that skipped the gate could say the same.

&nbsp;

## Verifying a functionality's docs against what shipped

**Read in this order, and scope the walk by the changed set** — on a mature functionality an unscoped walk is mostly a no-op that still reads everything:

1. Open the TSD README's **ID Index** first. It maps every ID → its lib file → its PRD AC, so it is the cheap index that decides what else to open.
2. Intersect it with **the changed set** (the citing hook defines this).
3. Walk **in full** only the entries those libs own, plus the ACs they back-link. Open a `{libtype}-v{n}.md` only when the Index says an in-scope ID lives in it — a v2-only pass never opens `ui-v1.md`.
4. Entries whose libs the changed set never touched are **unchanged** by construction; record that without re-deriving it.

**Two carve-outs.** A **shared** lib whose semantics changed reaches consumers outside the changed set — flag those rather than assuming unchanged. And stamp `Last Verified` **only on the files you actually walked**, so an untouched file keeps its older stamp and honestly reports that nobody checked it.

**The four outcomes** — act on what you find:

- **Added** — implementation needed a requirement that has no ID → mint it (`x-ng-doc-prd-writer`, then `x-ng-doc-tsd-writer`) and re-tag the affected test titles. **Rename only**: the coverage already exists, because an execution subagent may not invent an ID — it flags a gap instead.
- **Amended** — an existing AC/FR/BR is described wrongly (its expectation changed) → correct its text **under its existing ID**. Never renumber, and never mint a second ID for the same behaviour.
- **Retired** — an existing AC/FR/BR describes behaviour that no longer exists → remove the entry, its **ID Index row** and its **AC back-link**, and confirm its test was deleted too. **Never recycle the number.**
- **Unchanged** — the docs already match. Record it and move on; no edit.

**Amending or retiring overturns an approved decision, so it is never silent.** The writers show the old text beside the new, get explicit confirmation, and name the other functionalities that reuse the affected lib — their docs may now be wrong too. That procedure lives in the writers; dispatch them per _Relaying a writer's confirmation_ above and relay that confirmation rather than settling it.

**Stamp `Last Verified`** (date) on every doc checked, including the ones that needed no edit. That is the only outcome the writers cannot record, and it is what makes staleness mechanically detectable later.

**The local `requirements/` registry** of any `util`, product `app`, or grab-bag `ui` / `feature` lib in the changed set is verified on the same four outcomes, per `x-ng-test-unit-helper`; an `api` lib has none. Stamp `Last Verified` there too. The confirmation rule above does **not** apply — those entries were never user-approved and no writer owns the file — but still **report** an amend or retire, old text beside new, and for a shared lib name its consumers. Report, don't block.

[🔙](../../README.md#agents)
