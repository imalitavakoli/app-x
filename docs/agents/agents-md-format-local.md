[🔙](../../README.md#agents)

# `AGENTS.local.md` format 📎

How to write and read the gitignored companion of `AGENTS.md`.

**What belongs in it at all** is decided by [where-content-lives.md](where-content-lives.md). This doc is the catalog of recognized `pref.*` keys and the statement that the file has no required shape. It is **not** a template.

The overlay one-liner (local layers on `AGENTS.md`; on conflict, local wins) lives on `AGENTS.md` → Developer Workflows — do not restate it here.

&nbsp;

## No forced shape

`AGENTS.local.md` has **no required headings, sections, or order.** Free-form prose is the point. Recognized keys are optional one-liners the workflow can find; they may sit anywhere. Do not restructure the file to match this doc. Inventing a key still means adding the row to the catalog first.

&nbsp;

## Recognized keys

Family prefix `pref.`. Short kebab-case name. Value after a colon. One line.

**Write** (when the agent appends a key): exactly `pref.{key}: {value}`. Create the file if it does not exist; append one line; leave the rest of the file alone.

**Match** (when the workflow reads a key): the `pref.{key}` token and an allowed value on the same line. Extra spaces, a bullet, bold, or letter-case differences are fine. **Absent** — the key is unset; the consuming step's fallback runs — when the key is missing, both allowed values appear, or the line is a negation. **Never infer** a value from other sentences.

Which step reads a key is the consuming step's job, not this catalog's — that step points here for match/write rules.

| Key | Values |
| --- | --- |
| `pref.mode` | `auto` \| `interactive` |

Discovery of a missing key is the consuming step's job, not this file's.

**Adding a key.** Add the row here first, then wire the step that should read it. Do not invent a `pref.*` name in a path file or in `AGENTS.local.md` without this row.

&nbsp;

[🔙](../../README.md#agents)
