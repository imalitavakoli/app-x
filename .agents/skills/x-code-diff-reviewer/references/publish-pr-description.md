# Publish the human report onto a merge-request description

**Load when:** `latest.md` has been written and you are publishing (a merge request exists, just appeared this run, or the user asked to put the report on the description).

**Explains:** v1.8.0

Not needed to *do* the review. The main job is the session report plus `_local` artifacts (see Overview in SKILL.md). This file is the optional follow-on. Landing the report on the description is **best-effort** — never required for a successful review.

## When the human report appears on the merge request

Verdict (`pass` / `fail`) does **not** by itself decide prepend.

**You will see the report at the top of the description when all of these are true:**

- this run wrote `latest.md`
- a merge request for this branch **already existed**, or **appeared before the agent exited**, **or** the harness controller included `latest.md` when it created/updated the request (e.g. Cursor Cloud per `.cursor/cloud/CLOUD.md`)
- this host has a find + update-description mapping **or** the harness used its own PR write path
- the environment could authenticate to that host (for this script) / the harness write tool succeeded

**You will not see it on the description when any of these are true:**

- there was no merge request before the agent exited, and no harness create/update included the report (the report is still in the session and in `_local`)
- an auto-PR opened the request **after** the agent had already stopped
- the host is `unknown` or has no mapping yet (and no harness write path ran)
- there were no credentials to update the description
- the review never ran, or `latest.md` was missing

On skip, print the matching reason from that list and the script's `reason` code. Do not leave a missing block as a mystery. Do not treat a missing description block as a failed review.

## Detection ladder

First match wins. Optional `--pr-url` is rung 0.

1. A merge-request URL already in this run (user, an auto-PR, `gh pr create` output, or `--pr-url`).
2. Ask the host: open request whose **source branch is `HEAD`**.
3. No match → skip (`no-pr`). The review still succeeded.

A host that is `unknown`, or that has no find/update mapping, skips (`unknown-host` / `no-mapping`). Do not guess an API. The review still succeeded.

If a merge-request URL appears **later in this same run**, run the script again. Do not re-review. If this run used a subagent for the review, that subagent publishes when a request already exists. When the URL appears after the subagent returns but the parent is still running, the parent runs the script — not a second review.

If the session has already ended when the request appears, the next invocation that has a URL publishes.

## Run the script

Default report: `<root>/.agents/_local/skills/x-code-diff-reviewer/latest.md`.

```bash
node .agents/skills/x-code-diff-reviewer/scripts/publish-pr-description.mjs
```

Optionally with `--pr-url <url>` when a merge-request URL is already in this run.

Stdout is JSON. Branch on it:

- `{ "status": "published", "url": "…", "host": "…" }`
- `{ "status": "skipped", "reason": "…" }`

Exit codes:

| Exit | Meaning |
| ---- | ------- |
| 0 | `published` or `skipped` |
| 2 | `latest.md` missing, or not a git repo. Do not invent a description. |
| 1 | a request was found and the host write failed |

Auth: use whatever this environment already uses to talk to that host (`gh`, a token). Do not add a product-specific API path. Missing auth is a skip (`no-auth`), not a failed review.

The script writes only the description. It does not create a request, comment, request-changes, approve, or assign.

Harnesses that open/update the request via their own tool (and that wrap the same `latest.md` in the `<!-- x-code-diff-reviewer:start -->` / `<!-- x-code-diff-reviewer:end -->` markers) may skip calling this script when that write already landed the report. If unsure whether the block is present, still run the script — it upserts the marked block.

## Example mappings (not the host set)

GitHub and Bitbucket Cloud illustrate find and update-description. They are **examples**, not membership.

| Operation | GitHub (example) | Bitbucket Cloud (example) |
|---|---|---|
| Find open request for `HEAD` | `gh pr view` or `GET /repos/{owner}/{repo}/pulls?head={owner}:{branch}&state=open` | `GET /2.0/repositories/{workspace}/{repo_slug}/pullrequests` filtered by `source.branch.name` and open state |
| Read / update description | PR `body` via `gh pr edit --body-file` or pulls API | PR `description` via `PUT /2.0/repositories/{workspace}/{repo_slug}/pullrequests/{id}` |

A host whose find/update API is not in this file yet is a skip, not an error.

Adding a host means a detector in this script's `detectHost` **and** a find+update pair here. Do not bend an existing mapping to fit.

## Print one sentence from `reason`

Closed skip set: `no-pr` | `unknown-host` | `no-mapping` | `no-auth`.

| `reason` | Print this will-not case |
| -------- | ------------------------ |
| `no-pr` | There was no merge request before the agent exited (the report is still in the session and in `_local`). |
| `unknown-host` | The host is `unknown` or has no mapping yet. |
| `no-mapping` | The host is `unknown` or has no mapping yet. |
| `no-auth` | There were no credentials to update the description. |

Exit 2 maps to: the review never ran, or `latest.md` was missing. Say that; do not invent a description.

If an auto-PR opened the request **after** the agent had already stopped, this run cannot PATCH. Print the `no-pr` sentence if that is why you skipped. A later invocation that has a URL publishes.

Exit 1 is a host write failure after a request was found. The review is still on disk; prepend failed. Say so. Do not treat it as a failed review.
