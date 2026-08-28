# User Stories — {app} e2e

**Last Verified:** 2026-08-13

> Per-app registry of **live User Stories (US)**. Every `describe` in this app's e2e specs references a US ID from here.
>
> - US IDs are **unique within this e2e app**.
> - A US groups the **Acceptance Criteria (ACs)** — defined in the functionalities' PRDs — that a user pursues in one story. A US **may span functionalities**, which is why it lives here (app level) and not in a single functionality's PRD.
> - Add a US here when a spec needs a story that isn't registered yet; reuse one if it already fits.
> - A story that goes wrong is amended **under its existing ID**. One whose every AC has been retired, or that was merged into another, leaves this file for [DECISIONS.md](DECISIONS.md) — this file lists only what is live. Numbers are never reused.
> - **No writer owns this file** — the e2e work maintains it, so an amend or a retire is reported, not gated for approval.

## XPI-US-01 — As a user, I can open a profile's full details from the dashboard

Covered ACs:

- `XPI-AC-01` — x-profile-info (`docs/x/shared/ng-x-profile-info/PRD/README.md`)

## XPI-US-02 — As the product, the x-profile-info widget appears only when enabled in config

Covered ACs:

- `XPI-AC-02` — x-profile-info (`docs/x/shared/ng-x-profile-info/PRD/README.md`)
