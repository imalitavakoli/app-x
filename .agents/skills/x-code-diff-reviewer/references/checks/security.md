# Checks — security

**Load when:** always, on every review. The two checks here cost little and the failure they
catch is unrecoverable.

**No workspace doc governs these today.** Where a check below has no source of truth in `docs/`,
say so in the finding — set `rule_source.kind` to `none` rather than implying a rule exists.
A rule worth having and missing from the docs is itself a `chore` finding: the docs are where it
belongs, and adding it there is a separate change.

## Committed secrets

A secret that reaches a branch is compromised even after it is deleted, because it stays in
history and on every machine that fetched. This is the one finding that is always blocking and
never a nitpick.

**Look at every added or changed line for:**

- private keys — a `-----BEGIN … PRIVATE KEY-----` block of any kind
- provider tokens with recognisable shapes — `AKIA…`, `ghp_…`, `github_pat_…`, `xox[baprs]-…`,
  `sk-…`, `AIza…`, a Slack or Stripe live key, a JWT with a real payload
- a connection string carrying credentials — `://user:password@host`
- `.env`, `.npmrc`, `.netrc`, keystores, `.p12`/`.jks`/`.keystore`/`.mobileprovision` files
  appearing as added files
- a variable named `password`, `secret`, `token`, `apikey`, `credential` assigned a literal that
  is not obviously a placeholder

**Not a finding:** an obvious placeholder (`xxx`, `changeme`, `your-key-here`, `<REDACTED>`), a
value already committed on the base branch (pre-existing, and not this change's doing — say so),
or a test fixture whose value is plainly synthetic.

**When you find one:** report it as `issue`, blocking, confidence 100, and name the file and
line. Do **not** quote the secret in the report — the report gets pasted into a PR description.
Say what kind of credential it is and where. Add one sentence: the credential must be treated as
compromised and rotated, not merely deleted, because it is already in history.

## Dependency vulnerabilities

**Trigger:** `package.json` or the lockfile changed.

Run what the repo already has, and report the real exit code:

```bash
pnpm audit --audit-level high
```

- Report only advisories affecting dependencies this change **added or upgraded**. A
  pre-existing advisory in the tree is not this change's finding; mention it as a `note` at most.
- If no audit tooling is available, that is a _What I did not check_ entry with the reason.
  Never guess whether a dependency is vulnerable.
- A new direct dependency is worth a `question` regardless of advisories: `best-practices.md`
  governs whether a third-party library should be added at all, so cite that rather than
  inventing a policy here.

## Frontend sinks

These are worth checking from a diff because each is a **single identifiable line** that turns
data into behaviour. You are not auditing a system; you are reading the line where untrusted
input crosses a boundary.

| Sink                                                                     | What to check                                                                                                                                 |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`         | is any part of the assigned string not a literal? Then markup in that data becomes live page code.                                            |
| `bypassSecurityTrustHtml` / `…Script` / `…Url` / `…ResourceUrl`          | these exist to disable the framework's escaping. Each call needs a reason, and the value must be one the app produced, never one it received. |
| a URL built from data, used in `href`, `src`, or a redirect              | a `javascript:` or `data:` scheme reaching an `href` executes                                                                                 |
| `eval`, `new Function`, `setTimeout`/`setInterval` with a string         | executes whatever it is given                                                                                                                 |
| a template compiled or a selector built from data                        | same class, less obvious                                                                                                                      |
| a native bridge call (a Capacitor plugin) taking a path, URL, or command | the boundary is wider than the web sandbox; a path from data can escape the intended directory                                                |

**What counts as untrusted:** anything from an API response, a URL parameter, local storage, a
DEP config, a file, a postMessage, or the user. In practice that is everything except a literal
in the same file.

**Report it as `issue`, blocking, in a shared lib** — every consumer inherits the sink.

## Data exposure

| Look for                                                                               | The failure                                                                              |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| a credential, token, session id, or account identifier in a URL, query string, or path | it lands in browser history, server access logs, and the `Referer` sent to third parties |
| a whole object logged where it may hold personal data                                  | anyone who opens the console in a shipped build reads it                                 |
| personal data in an analytics event, an error report, or a crash payload               | it leaves the system entirely, to a processor that was never assessed for it             |
| a permissive `postMessage` target (`'*'`) or an over-broad CORS value                  | the data goes somewhere nobody chose                                                     |

Say **what kind** of data, and **where it ends up**. That is the sentence that gets it fixed.

## What this is not

This is **not** an application security review, and finding a sink does not make it one.

Do not attempt an audit of authentication, authorization, session handling, cryptography, or a
payment flow from a diff. Those are properties of a system, not of a line, and a partial opinion
about them reads as clearance — which is worse than saying nothing.

The line between the two: **a sink is a line you can point at; a control is a property you would
have to test.** Report the first, decline the second.

When the change touches any of those areas, emit a `note` saying a person should review it, name
the two or three concrete things you did find, and state plainly that they are not a statement
that the rest is safe. Also list it in _What I did not check_.
