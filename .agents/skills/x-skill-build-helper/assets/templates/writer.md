# Template — writer skill

A **writer** supplies what is needed to produce a document — its shape, the procedure for filling it, and the checks it must pass before it counts as done. The agent reading the skill writes the file and reports what it wrote.

**Two shapes, and the difference is only the path.** A writer bound to **one document** owns its location and its template: the path is a constant, and the skill states it. A writer bound to a **format or artifact type** is handed the path by the caller, and owns the format's mechanics instead of a template. Everything else — Prerequisites, the validation loop, the Summary — is the same, which is why both are the same kind. Say which shape yours is in the Overview, because it decides whether the path is a constant or a required input.

Examples: `x-ng-doc-prd-writer`, `x-ng-doc-tsd-writer`.

```markdown
---
name: x-{tech}-{domain}-writer
description: 'WHAT? <the document it produces, one clause naming the output and its path>. WHEN? <the situations + the keywords someone would use to ask for it>'
metadata:
  version: '1.0.0'
---

# {Domain} Writer

## Overview

<What it outputs, and the role you take while writing it (e.g. "you are a product owner").
State the output path if the skill owns it; if the caller supplies it, say so and list it
under Prerequisites instead. Say what deliberately does NOT belong in this document.>

## When to use

<Triggers. Then: "Do not use to <the adjacent thing another skill owns>.">

## Prerequisites

**Required input:** <the input>. If it is missing or unclear, STOP and ask — do not research or invent it.
<If the output already exists: read it first and UPDATE it — preserve existing IDs, never renumber.>

## Inputs & output

- **Reads:** <inputs, and any docs/ references by exact path>
- **Writes:** <exact output path — or "the path given as input", for a format-bound writer>

## Workflow

<Numbered steps. Include a copyable checklist whose todos carry a short tag:>
```

- [ ] [{tag}] 1. Analyse — read the template, the input, and any existing output
- [ ] [{tag}] 2. Draft — create the file mirroring the template headings
- [ ] [{tag}] 3. Fill — map the input into each section
- [ ] [{tag}] 4. Validate — run the Review Checklist until all items pass
- [ ] [{tag}] 5. Summary — report the saved path, the IDs, and open questions

```

## Template
**Always use the template exactly** — `assets/template.md` when the skill writes one file, or `assets/template/` with one template per output file when it writes a folder — same sections, same order.
<Drop the `>` quote-helpers from the final draft; keep every heading. Note any optional section.>

## Examples
<Read the example matching the case before filling the substantive sections. Link them.>

## Rules
<The mandatory instructions: ID format and "never renumber"; respect provided granularity
verbatim; do not invent facts (unknowns → Open Questions); minimise re-asking.>

## Validate
**Review Checklist** — before finalising, verify:
- [ ] <one line per rule above, phrased as a check>

**Validation Steps (iterative loop):** check every item; if any fails, fix the draft and
re-check the whole list; only when all pass, continue to Summary.

## Summary
1. Report the saved path.
2. List the IDs created or added (ID + one-line description).
3. List any open questions the user still needs to answer.
4. Incorporate requested changes until the user confirms.

## Optional prefs — DROP this heading and everything under it if the skill stores nothing, or if the four live in a file SKILL.md already points at

<If it stores state: include all four from _Document the store_ — Resolve
**per key**, a key table, the `version` mismatch rule (`version` is the file shape, not
`metadata.version`), and one example of the file. Default home is this section. If
resolving already requires another of the skill's files, put the four there and replace
this section with a pointer.>

## Common mistakes
| Mistake | Fix |
| ------- | --- |
| <the failure> | <the correction> |
```

## Notes

- The **Prerequisites** guard is what keeps a writer atomic: it names the _artifact_ it needs, never the skill that produced it.
- If the output is a folder rather than one file, make `assets/template/` a folder too — one template file per output file — and add an output-layout table mapping template → output.
