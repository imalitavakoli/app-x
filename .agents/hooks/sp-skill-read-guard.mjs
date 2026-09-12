#!/usr/bin/env node
// PreToolUse hook: reminds you of the reads this workspace owes BEFORE a
// Superpowers skill starts talking — the path file for the path that skill
// opens, and the shared rules that carry the table of everything else.
//
// It does NOT enumerate the reads. Skill invocation is the moment the PATH
// becomes known, and that is the one thing only this moment can say; the rest
// is a list with a single home (`sp-workflow-shared.md` -> Required reads and
// when they are due), and a second copy here would drift out of step with it
// silently — hook prose is checked by nothing.
//
// Cursor has no Skill tool, so a Superpowers skill is invoked by reading its
// SKILL.md. The Cursor registry therefore matches `Read|Skill` on `preToolUse`
// — after that Read returns, the skill is already talking, which is the
// failure this hook exists to close. It still REMINDS, never denies.
//
// Why a hook and not more prose: `AGENTS.md` already names the moment ("once
// the path is identified and before you invoke that skill"), and a scenario run
// showed agents READ that correctly — 8/8 — yet a real session still skipped the
// reads while quoting the rule back accurately. Comprehension was never the
// binding constraint; acting at the moment is. Those runs asked each agent to
// log every tool call, which primes procedure-following and hid exactly this.
// So the reminder has to arrive AT the invocation, which is a moment no file we
// own is open at: the alternative surfaces are Superpowers' own skill bodies,
// which we must not edit. See `docs/agents/where-content-lives.md` → Writing a
// pointer, for when a hook is the last resort rather than the first.
//
// It REMINDS, never denies. Denying would put routing control in a script;
// `AGENTS.md` and the path files decide whether a read happens, and this only
// decides when the reminder lands. It also injects a DIRECTIVE, not the files:
// they are far past the inline hook-output cap, and a persisted preview would
// land as a truncated fragment — the same reason the session-start directive
// names `AGENTS.md` rather than pasting it.
//
// Matched on the PLUGIN NAMESPACE, never on individual skill names. A hook
// anchored to one skill name silently stops firing when that skill is renamed —
// which has already happened here once. It also does NOT map a skill to a path:
// the routing table in `AGENTS.md` owns that, and duplicating it here would
// create a second copy that can disagree with the first.
//
// Pure Node (no jq / bash / PowerShell syntax) so it behaves identically on
// macOS, Linux, and Windows. Paths resolve from this script's own location, not
// the cwd, because harnesses disagree on the working directory they invoke a
// hook in.
import { readInput, eventName, emit, quiet } from './harness.mjs';

const payload = readInput();

// The skill being invoked. Shapes differ between harnesses, so read several
// rather than assuming one; an unrecognised shape means we cannot judge, and a
// guard that cannot judge stays quiet rather than firing on every tool call.
const skill = invokedSuperpowersSkill(payload);
if (!skill) quiet();

// It fires EVERY time, deliberately. A once-per-session marker was tried and
// removed: subagents share the parent's `session_id`, so the first subagent to
// invoke any Superpowers skill consumed the whole session's budget and the
// controller — the one agent that actually owes these reads — never saw it.
// That was observed, not theorised. Keying on something more granular would only
// move the guess; repeating is a visible cost, while a reminder silently
// swallowed by somebody else is the exact failure this hook exists to prevent.
// The directive's own "skip what you have already read" clause is what keeps
// the repeat cheap.

emit({
  hookSpecificOutput: {
    hookEventName: eventName(payload, 'PreToolUse'),
    additionalContext:
      `You are about to invoke \`${skill}\`. Skip anything you have ALREADY done in full ` +
      'this session.\n\n' +
      'THIS is the moment the PATH becomes known — no earlier surface could name it. Route ' +
      "it per `AGENTS.md`'s path table, which names A/B/C by what the fired skill's own " +
      'description says it opens, then read THAT path file IN FULL before this skill starts ' +
      'talking.\n\n' +
      'Everything else this workspace owes, and the moment each read falls due, is ONE table: ' +
      '`docs/agents/sp-workflow-shared.md` -> Required reads and when they are due. Read that ' +
      'file IN FULL — the table is in it, and so are the Operating rules, the Git contract, ' +
      'and the Workspace preferences that OVERRIDE this skill where they speak ' +
      '(declared in that file — do not infer them from this reminder).\n\n' +
      'THEN, BEFORE this skill asks you anything: some of what you just read is an ACTION due ' +
      'at this moment, not a fact to carry. Find EVERY rule in those files that must happen at ' +
      'CYCLE START (entering OR REJOINING a path) or BEFORE THE FIRST QUESTION IS PUT TO THE ' +
      'USER — whoever asks it: this skill, one of ours, or you — DO those things, and state ' +
      'what you did. Resolving `pref.*` is ONE such rule, named as an example only: it is not ' +
      'the list, and a rule added later with the same timing will not announce itself. ' +
      '**Having read a rule is not having obeyed it** — the observed ' +
      'failure is an agent that read the file, quoted the rule back accurately, and let the ' +
      'skill ask its first question first.\n\n' +
      'Nothing downstream catches a skip: the cycle still runs, and the work still looks ' +
      'correct afterwards.',
  },
});

/**
 * Superpowers skill this payload is invoking, or '' if it is not one.
 *
 * Claude Code's Skill tool names the skill (`superpowers:using-superpowers`).
 * Cursor invokes the same skills by reading SKILL.md, so the plugin namespace
 * is recovered from the path (`.../superpowers/<ver>/skills/<name>/SKILL.md`)
 * rather than from a field that Cursor does not send. Individual skill names
 * are still not listed: a renamed skill keeps matching as long as it lives
 * under that namespace.
 */
function invokedSuperpowersSkill(payload) {
  const named =
    payload?.tool_input?.skill ??
    payload?.tool_input?.name ??
    payload?.tool_input?.skill_name ??
    '';
  if (typeof named === 'string' && named.startsWith('superpowers:')) {
    return named;
  }

  const filePath = payload?.tool_input?.path ?? payload?.file_path ?? '';
  if (typeof filePath !== 'string' || !filePath) return '';

  const slashed = filePath.split('\\').join('/');
  const needle = '/superpowers/';
  const ns = slashed.toLowerCase().indexOf(needle);
  if (ns === -1) return '';
  if (!/\/SKILL\.md$/i.test(slashed)) return '';

  const after = slashed.slice(ns + needle.length);
  const skills = after.toLowerCase().indexOf('skills/');
  if (skills === -1) return '';
  const name = after.slice(skills + 'skills/'.length).split('/')[0];
  if (!name || /skill\.md/i.test(name)) return '';
  return `superpowers:${name}`;
}
