# Amending and retiring an Acceptance Criterion

Read this whenever you are **updating** an existing PRD and an AC already in it is no longer true — because the product behaviour changed, or that behaviour is gone.

Adding a new AC needs nothing from this file: mint the next number and carry on. The two hard cases are below.

## First decide which case you are in

| The outcome itself… | Case | What happens to the ID |
| --- | --- | --- |
| still exists, but the AC **describes it wrongly** | **amend** | **kept** — correct the text under it |
| **no longer exists** (the behaviour was removed) | **retire** | **burned** — moved to `DECISIONS.md`, never recycled |
| has been **replaced by a different outcome** | **retire + add** | old burned, new number minted |

The test for amend vs retire+add: *is this the same observable outcome, described wrongly — or a different outcome?* "Presented as critical **at or above** the threshold" instead of "above" is the **same** outcome corrected → amend. Replacing "a retry button is presented" with "it retries automatically" is a **different** outcome → retire and add.

## Amend

1. **Keep the ID.** Never renumber, and never mint a second AC for the same outcome.
2. **Rewrite the AC in full** so it states the shipped outcome — still one observable outcome, still no "and".
3. **Its TFS FR/BRs are now suspect.** Every FR/BR that back-links this AC was written against the old wording. Say so; correcting them is an `x-ng-tfs-writer` run, not something to patch from here.
4. **If e2e is in scope**, an `it` titled with this AC asserts the old outcome. Flag it — the test needs the same correction.

## Retire

1. **Move the AC to `PRD/DECISIONS.md`** — cut it out of the Acceptance Criteria section in `PRD/README.md` and add a row to that file's **Retired Acceptance Criteria** table with the ID, what it required, the date, **why**, and what replaced it (`—` if nothing). Moving rather than deleting is what keeps the burned number traceable: a reader who finds `AC-08` in an old e2e title or review comment can still learn what it was and why it went.
2. **Never recycle the number.** `{NAME}-AC-08` stays burned, so an old commit, test title or review comment never resolves to a different outcome later.
3. **Report the orphans it leaves** — every TFS FR/BR that back-linked it, and any e2e `it` titled with it. Those must be retired or re-pointed in their own runs; this skill does not touch them.
4. **Check the flow text.** An AC rarely lives alone: the User Experience & Flows section usually describes the same behaviour in prose. Retiring the AC without correcting the flow leaves the PRD contradicting itself.
5. **Record the rejection too, when there was one.** If the behaviour was dropped in favour of a different approach, that belongs in `PRD/DECISIONS.md` → **Rejected approaches**. Keep `PRD/README.md` → Non-Goals & Why for **current** scope exclusions ("we do not build X — the Y functionality owns it"); the *decision history* lives in `DECISIONS.md`.

## Both cases overturn an approved decision — so neither is silent

Every AC in this PRD was **explicitly approved** by the user when it was written; that is this skill's own gate. Amending or retiring one reverses that approval, often on behalf of someone not in this session.

1. **Show the old text beside the new**, per ID — the actual before and after, not a summary.
2. **Get explicit confirmation.** This is the same bar as the original AC approval, for the same reason: an AC drives e2e tests and the TFS's FR/BRs.
3. **Name who else is affected.** If this functionality's libs are reused elsewhere, the consuming functionalities' docs may now be wrong too. Find them by searching every `docs/x/*/TFS/README.md` **Existing Dependencies & Reuse** section for this functionality's lib names, and list what you found.
4. **If confirmation does not come, change nothing** and leave the discrepancy reported. A known-wrong, flagged AC is safer than one silently rewritten.

## Common mistakes

| Mistake | Fix |
| --- | --- |
| Minting a new AC because the outcome changed | Same outcome, corrected wording → **amend** under the existing ID |
| Amending when the outcome was actually replaced | Different outcome → retire the old, add a new number |
| Renumbering to close the gap a retirement leaves | Never — a burned number stays burned, and its row in `DECISIONS.md` is why it stays readable |
| Retiring an AC and leaving its FR/BRs back-linking it | Report every orphan; they are corrected in their own TFS run |
| Retiring an AC but leaving the flow text describing it | The PRD then contradicts itself — correct the flows too |
| Rewriting an approved AC without showing old vs new | It reverses a user approval — show both texts and get confirmation |
| Silently dropping a behaviour with no trace | Move the AC to `PRD/DECISIONS.md` with the reason; record the rejected alternative there too |
