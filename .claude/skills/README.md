# Skills Directories Reference

**Skill definitions live in `.agents/skills/`** — that is the single source of truth, and the directory other IDEs/agents (Gemini, GitHub Copilot, etc.) read directly.

The `x-*` folders beside this file are **pointer stubs**, not skills: each holds frontmatter (`name` + the same `description`) and one line telling the agent to read the canonical file under `.agents/skills/`. They exist because Claude Code only discovers skills under `.claude/skills/` — without a stub, a skill is invisible to the `Skill` tool.

**The rules for creating, naming, versioning and syncing skills — including these stubs — live in the `x-skill-build-helper` skill** (`.agents/skills/x-skill-build-helper/SKILL.md`). That is their single source of truth; do not restate them here.
