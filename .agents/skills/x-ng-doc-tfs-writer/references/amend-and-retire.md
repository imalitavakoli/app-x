# Amending and retiring an FR/BR

Read this whenever you are **updating** an existing TFS and something already in it is no longer true — because the code now behaves differently, or the behaviour is gone.

Adding a new FR/BR is the easy case and needs nothing from this file: mint the next number, register it in the ID Index, done. The two hard cases are below.

## First decide which case you are in

| The requirement itself…                                                     | Case             | What happens to the ID                               |
| --------------------------------------------------------------------------- | ---------------- | ---------------------------------------------------- |
| still exists, but the TFS **describes it wrongly** (an expectation changed) | **amend**        | **kept** — correct the text under it                 |
| **no longer exists** (the behaviour was removed)                            | **retire**       | **burned** — moved to `DECISIONS.md`, never recycled |
| has been **replaced by a different requirement**                            | **retire + add** | old burned, new number minted                        |

The test for amend vs retire+add: _is this the same rule with a corrected description, or a different rule?_ A threshold boundary flipping from exclusive to inclusive is the **same** rule stated wrongly → amend. Replacing "retry button" with "auto-retry after 5s" is a **different** rule → retire the old, add a new one.

## Amend

1. **Keep the ID.** Never renumber, and never mint a second ID for the same behaviour — two IDs for one rule makes the ID Index lie about coverage.
2. **Rewrite the `Given/When/Then` in full** so it matches the shipped behaviour, with concrete `[data-cy]` / signals / emitters as always. Do not leave the old wording alongside the new.
3. **Re-check the AC back-link.** If the AC itself worded the old expectation, the PRD is wrong too — that is a `x-ng-doc-prd-writer` run, not something to patch here.
4. **The ID Index row stays**, but re-read it: the `Maps to PRD AC` column may need to change if the back-link moved.

## Retire

1. **Move the entry to `DECISIONS.md`** — cut it out of its `{libtype}-v{n}.md` and add a row to that file's **Retired FR/BRs** table with the ID, the lib file it was in, what it required, the date, **why**, and what replaced it (`—` if nothing). Moving rather than deleting is what keeps the burned number traceable: a reader who finds `BR-08` in an old commit or review comment can still learn what it was and why it went.
2. **Remove its ID Index row** from `README.md`. An ID Index row for a retired entry is the most misleading state possible — it advertises coverage that does not exist. The Index lists **live IDs only**; the retired one now lives in `DECISIONS.md` and must never appear in both.
3. **Drop its AC back-link**, and check whether that PRD AC still has any FR/BR at all. An AC with no FR/BR is either a documentation gap or an AC that should itself retire — report it; do not decide it here.
4. **Never recycle the number.** `{NAME}_{OWNER}_BR-08` stays burned forever, so a future reader of an old commit, test title or review comment never resolves it to a different rule.
5. **Confirm the test went too.** A retired requirement with a living test means either the behaviour still exists (so it should not be retired) or the test asserts something nobody requires.

## Both cases overturn a decision — so neither is silent

An FR/BR was approved when it was written, often by someone who is not in this session, and other functionalities may depend on it. Before writing either change:

1. **Show the old text beside the new**, per ID. Not a summary — the actual before and after, so the reader can see exactly what is being reversed.
2. **Get explicit confirmation.** Amending or retiring is not a mechanical edit; it reverses a prior decision.
3. **Name who else is affected.** If the change is to a lib **other functionalities reuse**, their docs may now be wrong too. Find them by searching every `docs/x/*/TFS/README.md` **Existing Dependencies & Reuse** section for this lib's name, and list what you found. You are not fixing their docs — you are telling the user whose docs just became suspect.
4. **If confirmation does not come, change nothing** and leave the discrepancy reported. A doc that is known-wrong and flagged is safer than one silently rewritten on an assumption.

## Common mistakes

| Mistake                                                   | Fix                                                                                     |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Minting a new ID because the expectation changed          | Same rule, corrected wording → **amend** under the existing ID                          |
| Amending when the rule was actually replaced              | Different rule → retire the old, add a new number                                       |
| Renumbering to close the gap a retirement leaves          | Never — the gap is the point; its row in `DECISIONS.md` keeps it readable               |
| Deleting the entry instead of moving it to `DECISIONS.md` | The number must stay traceable — move it, and remove its ID Index row                   |
| Retiring an FR/BR while its unit test still passes        | Then the behaviour exists; do not retire it                                             |
| Rewriting an approved FR/BR without showing old vs new    | Both cases reverse a decision — show both texts and get confirmation                    |
| Changing a reused lib's FR/BR without naming the reusers  | Search the other functionalities' reuse sections and report whose docs may now be wrong |
