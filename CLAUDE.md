<!-- No Nx rules block here, on purpose: it duplicates AGENTS.md, which every agent
     reads, while this file is loaded on every turn. `nx configure-ai-agents` re-adds
     it — that is expected, and `pnpm run check:workflow` reports it and says what to
     do. Why it works this way: /docs/agents/sp-workflow-rationale.md -->

# Claude Code — start here

Read `AGENTS.md` in full before acting on any request, then `AGENTS.local.md` if it
exists (a personal overlay — where the two conflict, it wins). Every convention this
workspace has lives there or behind a pointer in it; this file only sends you to it.

A SessionStart hook normally gives you that instruction with a live line count. This
line is the fallback for when it has not run.
