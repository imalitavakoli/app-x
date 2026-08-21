// Deliberate, justified suppressions of checker findings.
//
// `allowlist-hygiene` FAILS when an entry stops matching anything, so a
// suppression cannot outlive the text it was written for. Keep this file short:
// a growing allowlist means the RULE is wrong, not that the repo is. Empty is
// the target state.
//
// ENTRY SHAPE — every field:
//
//   rule   The rule id to suppress, exactly as `--list` prints it (e.g.
//          'skill-coupling'). An entry suppresses that rule only.
//
//   file   Repo-relative path, forward slashes, matched EXACTLY. An entry never
//          applies to a whole directory.
//
//   match  A distinctive substring of the flagged line. The finding is
//          suppressed only while a flagged line still contains this — which is
//          how the entry expires on its own when the text changes.
//
//   why    Why this is a genuine false positive. Not read by the checker;
//          required by convention, because a suppression nobody justified is
//          one nobody can review.
//
// WORKED EXAMPLE — the only entry this file has ever held:
//
//   {
//     rule: 'skill-coupling',
//     file: '.agents/skills/x-skill-build-helper/SKILL.md',
//     match: 'carried in at hook A1 and re-tagged at A3',
//     why: "The 'Instead of' column of the table that FORBIDS naming hook IDs — "
//        + 'a counter-example, not a violation.',
//   }
//
// It is no longer here, and that is the point: rather than keep the exemption,
// the counter-example was reworded to `hook {ID}` placeholders so it could not
// go stale. `allowlist-hygiene` then flagged the entry as matching nothing, and
// it was deleted. Prefer that outcome — fix the text, or fix the rule — over a
// permanent suppression.
//
// NOTE ON RUNS: staleness is only decidable when every rule ran. On a filtered
// run (`--rule=…`) the hygiene check skips rather than condemning every entry.

export const allow = [];
