# Cursor Cloud wiring

| Path | Role |
| --- | --- |
| `../environment.json` | Cursor reads this path for Cloud env `install` (product-fixed location). Cloud-only content. |
| `install-pinned-plugins.mjs` | Installs `.agents/_pins/plugins/catalog.json` entries for harness `cursor-cloud` into `~/.cursor/skills/` |
| `CLOUD.md` | Ops notes skeleton + this repo’s Cloud facts; SessionStart injects a pointer when `CURSOR_AGENT=1` |

Desktop Cursor does not run the pin installer; use the marketplace / local plugins if you need Superpowers there. Pin upgrades still start in `.agents/_pins/plugins/catalog.json`.
