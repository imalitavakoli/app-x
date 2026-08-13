[🔙](../../README.md#agents)

# 🛣️ Path C — Other Superpowers scenarios

> **Read [sp-workflow-shared.md](sp-workflow-shared.md) first.** It owns the Operating rules this path assumes. The notation used below is defined in [sp-workflow-format.md](sp-workflow-format.md); why it is shaped this way is in [sp-workflow-rationale.md](sp-workflow-rationale.md) — rationale only, never needed to execute a cycle.

&nbsp;

Scenarios outside the build (A) and bug-fix (B) paths. `writing-skills` and `dispatching-parallel-agents` are standalone; `receiving-code-review` is a **guard** — it self-triggers whenever you give feedback on the agent's work, including in the middle of path A or B.

#### 🪝 C1 · Before `writing-skills` — authoring or editing a workspace skill

`x-skill-build-helper` — our skill conventions and per-kind templates. `writing-skills`' Iron Law covers **edits**, not just new skills: run the RED baseline before changing one.

⚪ **Hooks with no workspace step yet** — `receiving-code-review` (guard — you give feedback on the agent's work) · `dispatching-parallel-agents` (several independent tasks at once)

[🔙](../../README.md#agents)
