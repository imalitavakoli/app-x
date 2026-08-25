[🔙](../../README.md#agents)

# 🛣️ Path C — Other Superpowers scenarios

> **Read [sp-workflow-shared.md](sp-workflow-shared.md) first.** It owns the Operating rules this path assumes, and **Required reads and when they are due** — the one table naming which docs are due at which moment, [sp-workflow-prefs.md](sp-workflow-prefs.md) among them, due before the first question put to the user. The notation used below is defined in [sp-workflow-format.md](sp-workflow-format.md). Procedures this path would share with another live in [sp-workflow-procedures.md](sp-workflow-procedures.md) — read one only when a hook below cites it, never up front; no hook here cites one today.

&nbsp;

Scenarios outside the build (A) and bug-fix (B) paths. `writing-skills` and `dispatching-parallel-agents` are standalone; `receiving-code-review` is a **guard** — it self-triggers whenever you give feedback on the agent's work, including in the middle of path A or B.

#### 🪝 C1 · Before `writing-skills` — authoring or editing a workspace skill

`x-skill-build-helper` — our skill conventions and per-kind templates. `writing-skills`' Iron Law covers **edits**, not just new skills: run the RED baseline before changing one.

⚪ **Hooks with no workspace step yet** — `receiving-code-review` (guard — you give feedback on the agent's work) · `dispatching-parallel-agents` (several independent tasks at once)

[🔙](../../README.md#agents)
