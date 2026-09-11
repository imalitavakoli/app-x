# Report mechanism

**Load when:** writing the JSON report, or wiring the JSON to a host's comment API.

Not needed for an ordinary review — the human report's shape lives in
`assets/template/human-report.md`. Read this when you need a field's exact meaning, or when
something downstream is going to POST these findings.

## Why the JSON is host-neutral

A pull-request host's comment API is that host's own shape. Two hosts cannot share a payload —
the differences are structural, not cosmetic. The columns below are **worked examples of that
fact**, not the set of hosts this skill supports:

| Concern              | GitHub (example)                           | Bitbucket Cloud (example)                            |
| -------------------- | ------------------------------------------ | ---------------------------------------------------- |
| batching             | one review carries a `comments[]` array    | one POST per comment; no batch                       |
| line on the new side | `line` + `side: "RIGHT"`                   | `inline.to`                                          |
| line on the old side | `line` + `side: "LEFT"`                    | `inline.from`                                        |
| a range              | `start_line` + `start_side`                | `start_to` / `start_from`                            |
| whole-file comment   | `subject_type: "file"`                     | `path` only, omit `to`/`from`                        |
| the verdict          | `event: APPROVE｜REQUEST_CHANGES｜COMMENT` | separate `/approve` and `/request-changes` endpoints |
| the summary body     | the review's own `body`                    | a further comment with no `inline`                   |

So the JSON is **no host's format**. It is one canonical record. Each host that has a projection
section below is a mapping, not a boundary. Writing one host's shape and "adapting later" means
rewriting every finding when another host appears.

A remote whose host is `unknown` is still a valid review — emit that value and stop. Adding a
host is adding a detector in `scripts/collect-diff-facts.mjs` and a projection section here. Do
not bend an existing mapping to fit.

`position` is deprecated on GitHub in favour of the line/side fields. Do not emit it.

## This file does not call a host API

This file is the JSON and **comment** projection. Description publish is
`references/publish-pr-description.md`. The skill still never comments, requests changes,
approves, assigns, or creates a request — whoever does that reads these files.

## Schema

`report-{iso}-{shortsha}.json`, plus a copy at `latest.json`.

```json
{
  "report_version": 1,
  "generated_at": "2026-09-11T09:14:02.511Z",
  "repo": {
    "host": "github",
    "remote_url": "https://github.com/owner/repo.git",
    "branch": "feature/TEA-1-add-card",
    "head_sha": "845e4110f3…"
  },
  "range": {
    "base_ref": "origin/master",
    "resolved_via": "fallback-list",
    "base_sha": "1bfac3b…",
    "merge_base": "9c1d0aa…",
    "buckets_reviewed": ["committed", "working"],
    "files_changed": 5,
    "behind_by": 0
  },
  "verdict": {
    "state": "fail",
    "blocking": 2,
    "non_blocking": 6,
    "reason": "2 blocking findings"
  },
  "automated_checks": [
    {
      "name": "lint",
      "command": "pnpm nx affected -t lint --base=9c1d0aa",
      "exit_code": 1,
      "ran": true,
      "summary": "@nx/enforce-module-boundaries in libs/shared/ui/ng-card"
    },
    { "name": "e2e", "ran": false, "reason": "no e2e specs in the diff" }
  ],
  "findings": [
    {
      "id": "f-001",
      "label": "issue",
      "blocking": true,
      "verdict": "CONFIRMED",
      "category": "lib-boundaries",
      "confidence": 95,
      "title": "A ui lib imports a data-access lib",
      "consequence": "The card cannot be reused or previewed on its own, and the build fails.",
      "body_markdown": "**issue (blocking):** …",
      "rule_source": {
        "kind": "doc",
        "path": "docs/getting-started/library-types-and-their-relationship.md",
        "anchor": "#import-matrix"
      },
      "location": {
        "path": "libs/shared/ui/ng-card/src/lib/v1/card.ts",
        "side": "new",
        "start_line": 1,
        "end_line": 1,
        "subject": "line"
      },
      "bucket": "committed"
    }
  ],
  "not_checked": [
    { "what": "unit tests", "reason": "no package.json in this repository" }
  ],
  "suggested_reviewers": [
    {
      "handle": "@Bo",
      "codeowners_pattern": "libs/shared/ui/**",
      "resolved": null
    }
  ],
  "suggested_labels": ["shared-lib", "architecture-violation"]
}
```

### Field notes

| Field                            | Meaning                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `report_version`                 | bump when the shape changes, so a consumer can refuse an unknown one                                                                                                                                                                                                                                                                                                                     |
| `repo.host`                      | detector result used to pick a projection. Named only for hosts that have a subsection below; any other remote is `unknown`, which is valid.                                                                                                                                                                                                                                             |
| `verdict.state`                  | `fail` · `pass_with_warnings` · `pass`. Derived, never chosen: any blocking finding → `fail`.                                                                                                                                                                                                                                                                                            |
| `automated_checks[].ran`         | `false` requires `reason` and forbids `exit_code`. An unrun check has no outcome.                                                                                                                                                                                                                                                                                                        |
| `label`                          | one of the closed set in `SKILL.md`. Not free text.                                                                                                                                                                                                                                                                                                                                      |
| `blocking`                       | calibrated by reach, not by feeling. See `SKILL.md`.                                                                                                                                                                                                                                                                                                                                     |
| `verdict`                        | on blocking findings only. `CONFIRMED` — a verification subagent reproduced it. `PLAUSIBLE` — no verification ran, and _What I did not check_ says why. Absent on non-blocking findings, which are not verified.                                                                                                                                                                         |
| `confidence`                     | 0–100. Findings below 80 are dropped before they reach this file, so every entry here is ≥ 80.                                                                                                                                                                                                                                                                                           |
| `consequence`                    | what a person would see or suffer, in plain language. Required.                                                                                                                                                                                                                                                                                                                          |
| `body_markdown`                  | the comment body a host would post, verbatim. Conventional Comments form.                                                                                                                                                                                                                                                                                                                |
| `rule_source.kind`               | `doc` · `skill-asset` · `artifact` · `lint` · `none`. `none` means no rule backs it — say so rather than implying one.                                                                                                                                                                                                                                                                   |
| `location.side`                  | `new` or `old`. This is the field a host's comment API needs and that no two hosts name the same way.                                                                                                                                                                                                                                                                                    |
| `location.subject`               | `line` for a line or range, `file` for a whole-file comment.                                                                                                                                                                                                                                                                                                                             |
| `bucket`                         | `committed` · `unpushed` · `working`. A `working` finding is not in the PR yet.                                                                                                                                                                                                                                                                                                          |
| `related_findings`               | ids this one is coupled to — omit when there are none. Use it when fixing **this** finding changes another: the same root cause, or a fix that makes a second finding disappear. A fix run reads this to avoid doing work that another fix undoes, and to order its changes. State the relationship in `body_markdown` too; the array says _that_ they are linked, the prose says _how_. |
| `suggested_reviewers[].resolved` | always `null` from this skill. A CODEOWNERS handle is not a host login.                                                                                                                                                                                                                                                                                                                  |

## Projecting onto a host

Each subsection maps the canonical record onto one host's comment API. It is an example of
projection, not a membership test. A remote whose host is `unknown` has no subsection yet —
that is expected, not an error.

### GitHub — one review, batched

`POST /repos/{owner}/{repo}/pulls/{number}/reviews`

| Canonical                  | GitHub                                                                                          |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| `repo.head_sha`            | `commit_id`                                                                                     |
| the human report           | `body`                                                                                          |
| `verdict.state`            | `event`: `fail` → `REQUEST_CHANGES` · else `COMMENT`. Never `APPROVE` from an automated review. |
| each finding               | one entry in `comments[]`                                                                       |
| `location.path`            | `path`                                                                                          |
| `location.side`            | `side`: `new` → `RIGHT`, `old` → `LEFT`                                                         |
| `location.end_line`        | `line`                                                                                          |
| `location.start_line`      | `start_line` — omit when equal to `end_line`                                                    |
| `location.subject: "file"` | `subject_type: "file"`, and omit the line fields                                                |
| `body_markdown`            | `body`                                                                                          |

Reviewers are a separate call:
`POST /repos/{owner}/{repo}/pulls/{number}/requested_reviewers` with `reviewers` and
`team_reviewers` — and only with real logins, which this skill does not produce.

### Bitbucket Cloud — one POST per comment

`POST /2.0/repositories/{workspace}/{repo_slug}/pullrequests/{id}/comments`

| Canonical                                   | Bitbucket                                                      |
| ------------------------------------------- | -------------------------------------------------------------- |
| `body_markdown`                             | `content.raw` (set `content.markup: "markdown"`)               |
| `location.path`                             | `inline.path`                                                  |
| `location.end_line` where `side` is `new`   | `inline.to`                                                    |
| `location.end_line` where `side` is `old`   | `inline.from`                                                  |
| `location.start_line` where `side` is `new` | `inline.start_to`                                              |
| `location.start_line` where `side` is `old` | `inline.start_from`                                            |
| `location.subject: "file"`                  | omit `inline.to` and `inline.from`, keep `inline.path`         |
| the human report                            | one further comment with no `inline` key                       |
| `verdict.state`                             | not a comment field — the separate `/request-changes` endpoint |

There is no batch endpoint, so a consumer posts findings in a loop and must be idempotent on
retry.

A host whose comment API is not in this file yet (Bitbucket Server/Data Center's
`anchor: {line, lineType, fileType, path}` is one such API) gets its own subsection when a
consumer needs that mapping. Do not bend an existing one to fit.

## Labels

`suggested_labels` is advisory and drawn from what the change contains — a shared lib touched, a
DEP config changed, an architecture violation found, a PR over the size norm in
`docs/guidelines/pr-rules.md`. Suggest; never apply.

**Emit it regardless of host.** Some hosts have pull-request labels; some do not. A consumer
whose host has none ignores the array. The field costs nothing, and which host a repo uses can
change.
