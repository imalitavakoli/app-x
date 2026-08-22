[🔙](../../README.md#runbooks)

# Workspace: Update AI instructions

**Important!** This task should be done by the Workspace Specialist most of the times.

As the workspace grows, its documentation evolves as well. AI agents rely on these documents to understand workspace rules, naming conventions, and structures. Therefore, it's important to keep AI-related instructions (e.g., MCP server configurations) up to date to ensure agents can read and interpret them correctly.

To achieve this, the following files should be reviewed regularly to make sure they reflect the latest workspace standards.

- `AGENTS.md`.
- `docs/agents/` — `AGENTS.md` and `CONTEXT.md` format docs, and Superpowers-First Workflow's related docs (e.g., the path files, the shared rules every path assumes, the shared procedures, the landmark notation, the rationale, and etc).
- `.agents/skills/x-sp-workflow-helper` skill.
- `.agents/hooks/` — hook scripts (SessionStart, PreToolUse, PostToolUse); each harness's own registry wires them (`.claude/settings.json`, `.cursor/hooks.json`).

**Before editing `AGENTS.md`'s workflow section or anything under `docs/agents/`, invoke the `x-sp-workflow-helper` skill.** Any edit to the workflow, is potential to break it _silently_! That skill can help for a healthier workflow updates... It carries the change procedure, an integrity checker for the references, and the playbook for a Superpowers version change.

After any workflow edit, run the checker and expect zero failures:

```bash
pnpm run check:workflow
```

[🔙](../../README.md#runbooks)
