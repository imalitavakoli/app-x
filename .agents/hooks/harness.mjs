// Shared harness-facing helpers for the hooks in this directory.
//
// Everything here answers a question whose answer differs BETWEEN AGENT
// HARNESSES — and answers it by reading what the harness actually sent, never by
// looking up what a named agent is assumed to do. A per-agent table of event
// names would encode guessed knowledge about contracts we have not verified, and
// a wrong entry would fail silently — the same trap `SP_PROBES_UNVERIFIED` warns
// against in the checker's config.
//
// Pure Node, no dependencies. Every export is TOTAL: it returns a value rather
// than throwing, so a hook fails closed instead of crashing the harness.

import { readFileSync } from 'node:fs';

/** Read and parse the hook payload from stdin. `{}` when absent or malformed. */
export function readInput() {
  let raw = '';
  try {
    raw = readFileSync(0, 'utf8');
  } catch {
    return {}; // no stdin — nothing to judge
  }
  try {
    return JSON.parse(raw || '{}');
  } catch {
    return {}; // a malformed payload is not ours to report
  }
}

/**
 * The event this hook was invoked as, echoed back from the payload.
 *
 * Used by the EDIT GUARD only, and that is deliberate. Harnesses name their own
 * event on stdin (`hook_event_name`), so echoing beats a hardcoded literal
 * wherever the payload is already in hand: the guard's tool-use event names
 * genuinely differ between harnesses, and at least one harness validates the
 * emitted name against the event it was registered on, so a literal there is
 * wrong the moment the registration differs.
 *
 * The SessionStart hooks pass a literal instead, because reading stdin at all
 * would mean a blocking `readFileSync(0)` at session start — see their own
 * comments. `fallback` is what they would receive from here anyway, and it keeps
 * behaviour identical for the guard if the field is ever absent.
 */
export function eventName(payload, fallback) {
  const name = payload?.hook_event_name;
  return typeof name === 'string' && name ? name : fallback;
}

/**
 * The file path a tool-use payload refers to.
 *
 * Returns `{ path, unknownShape }`. `unknownShape` is the point of this helper:
 * it lets a caller tell "nothing was edited" (fine — stay quiet) from "a tool
 * payload arrived and I could not find a path in it" (report it). Those two
 * previously looked identical, so the second passed unnoticed — precisely the
 * silent failure a guard exists to prevent.
 */
export function editedPath(payload) {
  const candidates = [
    payload?.tool_input?.file_path,
    payload?.tool_input?.filePath,
    payload?.tool_response?.filePath,
    payload?.tool_response?.file_path,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate) {
      return { path: candidate, unknownShape: false };
    }
  }
  const hadToolPayload =
    payload?.tool_input !== undefined || payload?.tool_response !== undefined;
  return { path: '', unknownShape: hadToolPayload };
}

/** Write a hook result to stdout and exit successfully. */
export function emit(obj) {
  process.stdout.write(JSON.stringify(obj));
  process.exit(0);
}

/** Exit silently, having judged nothing. */
export function quiet() {
  process.exit(0);
}
