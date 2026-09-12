# Plugin pins

**What this folder is.** The source of truth for third-party **agent plugins** this workspace freezes to an exact git commit.

**What it is not.** A list of every plugin a harness enables. Harness-native installs without a SHA (for example Nx from a GitHub marketplace) stay out until we deliberately pin them.

## Layout

| Path | Role |
| --- | --- |
| `catalog.json` | Pin intent: name, version, source URL + SHA, and which **harnesses** must materialize it |
| Harness adapters elsewhere | How each agent actually installs that pin |

Today:

| Harness | Adapter |
| --- | --- |
| Claude Code | `.claude/plugins/.claude-plugin/marketplace.json` (declared from `.claude/settings.json`) |
| Cursor Cloud | `.cursor/cloud/install-pinned-plugins.mjs` (run from `.cursor/environment.json`) |

## Upgrading a pin

1. Change the entry in `catalog.json` (version + SHA together).
2. Update **every** harness adapter listed in that entry's `harnesses` in the **same** change.
3. If the plugin is Superpowers, follow `x-sp-workflow-helper` → `references/superpowers-upgrade.md` (review first; then baseline + pin).

`pnpm run check:workflow` → `sp-pin` fails while catalog, baseline, and adapters disagree.
