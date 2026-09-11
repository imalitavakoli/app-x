#!/usr/bin/env node
/**
 * collect-diff-facts.mjs — gather the git facts a code-diff review needs.
 *
 * FACTS ONLY. This script decides nothing. It never says whether something is a
 * finding, a violation, or blocking — that judgement belongs to the agent that
 * reads this output. Adding a verdict here would move judgement into a place
 * nobody reviews.
 *
 * It is also read-only on the repository. Every git command below is an
 * inspection: no command writes the index, moves HEAD, or touches a file. The
 * only path it writes is the report directory.
 *
 * Usage:
 *   node collect-diff-facts.mjs [--base <ref>] [--json] [--no-write]
 *
 *   --base <ref>   skip base-branch detection and use <ref>
 *   --json         print the facts to stdout (always also written unless --no-write)
 *   --no-write     do not write the facts file
 *
 * Exit codes: 0 facts collected · 2 not a git repository · 3 base branch unresolved
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, posix } from 'node:path';

const FACTS_VERSION = 1;
const REPORT_DIR = posix.join('.agents', '_local', 'skills', 'x-code-diff-reviewer');

/** Run a git command. Returns trimmed stdout, or null when git exits non-zero. */
function git(args, cwd) {
  try {
    return execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 64 * 1024 * 1024,
    }).trim();
  } catch {
    return null;
  }
}

function lines(out) {
  return out ? out.split(/\r?\n/).filter(Boolean) : [];
}

/* ------------------------------------------------------------------ repo ---- */

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const value = (name) => {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : null;
};

const root = git(['rev-parse', '--show-toplevel'], process.cwd());
if (!root) {
  console.error('collect-diff-facts: not a git repository (or git is unavailable).');
  process.exit(2);
}

const head = git(['rev-parse', 'HEAD'], root);
const branch = git(['rev-parse', '--abbrev-ref', 'HEAD'], root);
const remoteUrl = git(['remote', 'get-url', 'origin'], root);

/**
 * Names a projection in references/report-mechanism.md, or `unknown` when none
 * exists yet. Named values are not a supported-host list — unknown is valid,
 * and adding a host is adding a detector here plus a projection section there.
 */
function detectHost(url) {
  if (!url) return 'unknown';
  if (/github\.com/i.test(url)) return 'github';
  if (/bitbucket\.org/i.test(url)) return 'bitbucket';
  return 'unknown';
}

/* ------------------------------------------------------- base branch ladder -- */

/**
 * Rung 1 (origin/HEAD) is unset in many real checkouts, so the ladder must not
 * stop there. Rung 3 is a genuine "ask the user" — never a guess.
 */
function resolveBase() {
  const forced = value('--base');
  if (forced) {
    const sha = git(['rev-parse', '--verify', `${forced}^{commit}`], root);
    return sha ? { ref: forced, rung: 'forced' } : null;
  }

  const symbolic = git(['symbolic-ref', '--short', 'refs/remotes/origin/HEAD'], root);
  if (symbolic) return { ref: symbolic, rung: 'origin/HEAD' };

  for (const candidate of ['origin/main', 'origin/master', 'main', 'master']) {
    if (git(['rev-parse', '--verify', `${candidate}^{commit}`], root)) {
      return { ref: candidate, rung: 'fallback-list' };
    }
  }
  return null;
}

const base = resolveBase();
if (!base) {
  console.error(
    'collect-diff-facts: could not resolve a base branch.\n' +
      'Tried origin/HEAD, then origin/main, origin/master, main, master.\n' +
      'Ask the user which branch to review against, then re-run with --base <ref>.'
  );
  process.exit(3);
}

const baseSha = git(['rev-parse', base.ref], root);
const mergeBase = git(['merge-base', 'HEAD', base.ref], root);

/** Short name of the base, for the on-base-branch test (`main` from `origin/main`). */
const baseShort = base.ref.replace(/^origin\//, '');

/**
 * The unpushed bucket tracks THIS branch's own upstream, not the base's.
 *
 * Keying it on `origin/<base>` looks right and is wrong: on a feature branch
 * `origin/master..HEAD` is the whole branch, so the bucket silently duplicates
 * `committed` and every finding gets counted twice. The question this bucket
 * answers is "what has not left this machine", which is always relative to
 * where this branch pushes to.
 */
const upstream =
  git(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}'], root) ||
  (branch === baseShort && git(['rev-parse', '--verify', `${base.ref}^{commit}`], root)
    ? base.ref
    : null);

/* ----------------------------------------------------------------- buckets -- */

/**
 * Parse `git diff --name-status -z`. NUL-delimited so paths with spaces,
 * quotes, or non-ASCII survive intact; renames carry two path fields.
 */
function nameStatus(args) {
  const out = git([...args, '--name-status', '-z'], root);
  if (!out) return [];
  const parts = out.split('\0').filter((p) => p !== '');
  const files = [];
  for (let i = 0; i < parts.length; ) {
    const status = parts[i++];
    if (status === undefined) break;
    if (/^[RC]/.test(status)) {
      const from = parts[i++];
      const to = parts[i++];
      files.push({ status: status[0], path: to, renamed_from: from });
    } else {
      files.push({ status, path: parts[i++] });
    }
  }
  return files.filter((f) => f.path);
}

function untracked() {
  return lines(git(['ls-files', '--others', '--exclude-standard', '-z'], root).split?.('\0').join('\n'))
    .map((p) => ({ status: '?', path: p }));
}

const buckets = {
  // Commits on this branch that the base does not have.
  committed: {
    range: mergeBase && head && mergeBase !== head ? `${mergeBase}..${head}` : null,
    commits: [],
    files: [],
  },
  // Commits that exist locally but have not reached this branch's upstream.
  unpushed: { range: null, commits: [], files: [], upstream: null, overlaps_committed: false },
  // Staged and unstaged work, plus untracked files.
  working: { range: 'HEAD..worktree', commits: [], files: [] },
};

if (buckets.committed.range) {
  buckets.committed.files = nameStatus(['diff', `${mergeBase}..${head}`]);
  buckets.committed.commits = lines(
    git(['log', '--format=%h\t%s', `${mergeBase}..${head}`], root)
  ).map((l) => {
    const [sha, ...rest] = l.split('\t');
    return { sha, subject: rest.join('\t') };
  });
}

buckets.unpushed.upstream = upstream;
if (upstream) {
  const ahead = lines(git(['log', '--format=%h\t%s', `${upstream}..HEAD`], root)).map((l) => {
    const [sha, ...rest] = l.split('\t');
    return { sha, subject: rest.join('\t') };
  });
  if (ahead.length) {
    buckets.unpushed.range = `${upstream}..HEAD`;
    buckets.unpushed.commits = ahead;
    buckets.unpushed.files = nameStatus(['diff', `${upstream}..HEAD`]);
    // True when the branch has never been pushed: every committed change is
    // also unpushed. Judge each file once — the agent needs to know that here.
    buckets.unpushed.overlaps_committed =
      buckets.committed.commits.length > 0 &&
      buckets.committed.commits.every((c) => ahead.some((a) => a.sha === c.sha));
  }
}

{
  const staged = nameStatus(['diff', '--cached']);
  const unstaged = nameStatus(['diff']);
  const seen = new Set();
  buckets.working.files = [...staged, ...unstaged, ...untracked()].filter((f) => {
    const key = `${f.status}:${f.path}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** How far behind the base this branch is — reported, never judged. */
const behind = Number(git(['rev-list', '--count', `HEAD..${base.ref}`], root) ?? '0');

/* -------------------------------------------------------------- CODEOWNERS -- */

/**
 * Last matching rule wins — the convention the repo's own CODEOWNERS header
 * states. Handles are reported verbatim: a display name is not a host login,
 * and resolving one would assign the wrong person.
 */
function codeownersRules() {
  for (const candidate of ['CODEOWNERS', '.github/CODEOWNERS', 'docs/CODEOWNERS']) {
    const abs = join(root, candidate);
    if (!existsSync(abs)) continue;
    const rules = [];
    for (const raw of readFileSync(abs, 'utf8').split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const [pattern, ...owners] = line.split(/\s+/);
      const handles = owners.filter((o) => o.startsWith('@'));
      if (pattern && handles.length) rules.push({ pattern, handles });
    }
    return { file: candidate, rules };
  }
  return { file: null, rules: [] };
}

/** Minimal gitignore-style glob → RegExp. Supports **, *, ?, and a leading /. */
function globToRegExp(pattern) {
  let p = pattern;
  const anchored = p.startsWith('/');
  if (anchored) p = p.slice(1);
  if (p.endsWith('/')) p += '**';

  let re = '';
  for (let i = 0; i < p.length; i++) {
    const c = p[i];
    if (c === '*') {
      if (p[i + 1] === '*') {
        re += '.*';
        i++;
        if (p[i + 1] === '/') i++;
      } else {
        re += '[^/]*';
      }
    } else if (c === '?') re += '[^/]';
    else re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  // An unanchored pattern with no slash matches at any depth, like gitignore.
  const prefix = anchored || p.includes('/') ? '^' : '^(?:.*/)?';
  return new RegExp(`${prefix}${re}(?:/.*)?$`);
}

const owners = codeownersRules();
const compiled = owners.rules.map((r) => ({ ...r, re: globToRegExp(r.pattern) }));

function ownersFor(path) {
  let match = null;
  for (const rule of compiled) if (rule.re.test(path)) match = rule; // last wins
  return match;
}

/* ------------------------------------------------------------ file grouping -- */

const allPaths = [
  ...new Set(
    Object.values(buckets)
      .flatMap((b) => b.files)
      .map((f) => f.path)
  ),
].sort();

/**
 * Which paths are new in this change — used by the agent to calibrate severity
 * by reach (a file nothing consumes yet is judged more leniently). Reported as
 * a fact; the calibration itself is the agent's.
 */
const addedPaths = new Set(
  Object.values(buckets)
    .flatMap((b) => b.files)
    .filter((f) => f.status === 'A' || f.status === '?')
    .map((f) => f.path)
);

const ownersByPath = {};
const suggestedReviewers = new Map();
for (const p of allPaths) {
  const rule = ownersFor(p);
  ownersByPath[p] = rule ? { pattern: rule.pattern, handles: rule.handles } : null;
  if (!rule) continue;
  for (const handle of rule.handles) {
    if (!suggestedReviewers.has(handle)) {
      suggestedReviewers.set(handle, {
        handle,
        codeowners_pattern: rule.pattern,
        resolved: null, // a handle is not a host login; see references/report-mechanism.md
      });
    }
  }
}

/* ------------------------------------------------------------------ output -- */

const facts = {
  facts_version: FACTS_VERSION,
  generated_at: new Date().toISOString(),
  repo: {
    root,
    host: detectHost(remoteUrl),
    remote_url: remoteUrl,
    branch,
    head_sha: head,
    on_base_branch: branch === baseShort,
  },
  base: {
    ref: base.ref,
    resolved_via: base.rung,
    sha: baseSha,
    merge_base: mergeBase,
    upstream: upstream,
    behind_by: Number.isFinite(behind) ? behind : null,
  },
  buckets,
  summary: {
    files_changed: allPaths.length,
    non_empty_buckets: Object.entries(buckets)
      .filter(([, b]) => b.files.length > 0)
      .map(([name]) => name),
    added_paths: [...addedPaths].sort(),
  },
  codeowners: { file: owners.file, by_path: ownersByPath },
  suggested_reviewers: [...suggestedReviewers.values()],
};

if (!flag('--no-write')) {
  const dir = join(root, REPORT_DIR);
  mkdirSync(dir, { recursive: true });
  const out = join(dir, 'facts.json');
  writeFileSync(out, `${JSON.stringify(facts, null, 2)}\n`, 'utf8');
  if (!flag('--json')) console.log(`facts written: ${posix.join(REPORT_DIR, 'facts.json')}`);
}

if (flag('--json') || flag('--no-write')) {
  console.log(JSON.stringify(facts, null, 2));
}

if (facts.summary.non_empty_buckets.length === 0) {
  console.error('collect-diff-facts: every bucket is empty — there is nothing to review.');
}
