#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const MARKER_START = '<!-- x-code-diff-reviewer:start -->';
export const MARKER_END = '<!-- x-code-diff-reviewer:end -->';

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function upsertMarkedBlock(existingBody, reportMarkdown) {
  const report = String(reportMarkdown ?? '').replace(/[ \t]+$/gm, '').replace(/\s+$/, '');
  const block = `${MARKER_START}\n${report}\n${MARKER_END}`;
  const body = String(existingBody ?? '');
  const re = new RegExp(`${escapeRe(MARKER_START)}[\\s\\S]*?${escapeRe(MARKER_END)}`);
  if (re.test(body)) return body.replace(re, () => block);
  if (!body.trim()) return `${block}\n`;
  return `${block}\n\n${body.replace(/^\n+/, '')}`;
}

export function detectHost(url) {
  if (!url) return 'unknown';
  if (/github\.com/i.test(url)) return 'github';
  if (/bitbucket\.org/i.test(url)) return 'bitbucket';
  return 'unknown';
}

export function skipResult(reason) {
  return { status: 'skipped', reason };
}

export function publishedResult({ url, host }) {
  return { status: 'published', url, host };
}

export function parseBitbucketRemote(url) {
  if (!url) return null;
  const m = String(url).match(/bitbucket\.org[:/]([^/]+)\/([^/]+?)(?:\.git)?\/?$/i);
  if (!m) return null;
  return { workspace: m[1], repo: m[2] };
}

export function parseGitHubRemote(url) {
  if (!url) return null;
  const m = String(url).match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?\/?$/i);
  if (!m) return null;
  return { owner: m[1], repo: m[2] };
}

export function classifySkip({ host, url, hasAuth }) {
  if (host === 'unknown') return 'unknown-host';
  if (host !== 'github' && host !== 'bitbucket') return 'no-mapping';
  if (hasAuth === false) return 'no-auth';
  if (!url) return 'no-pr';
  return null;
}

export function githubHasAuth({ ghMissing, hasToken }) {
  return !ghMissing || Boolean(hasToken);
}

export function isOpenPullState(state) {
  return String(state || '').toLowerCase() === 'open';
}

function httpFindSkipReason(status) {
  if (status === 401 || status === 403) return 'no-auth';
  if (status >= 400) return 'no-pr';
  return null;
}

export function bitbucketListSkipReason(status) {
  return httpFindSkipReason(status);
}

export function githubRestFindSkipReason(status) {
  return httpFindSkipReason(status);
}

export function bitbucketGetByIdFailure(status) {
  const skipReason = httpFindSkipReason(status);
  if (!skipReason) return null;
  return { found: false, skipReason };
}

export function resolveBitbucketRepo({ remoteUrl, prUrlArg }) {
  if (prUrlArg) return parseBitbucketPrUrl(prUrlArg);
  return parseBitbucketRemote(remoteUrl);
}

const REPORT_REL = join('.agents', '_local', 'skills', 'x-code-diff-reviewer', 'latest.md');
const GH_BODY_FILE = join(tmpdir(), 'x-code-diff-reviewer-body.md');

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

function argValue(argv, name) {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : null;
}

function printSkip(reason) {
  console.log(JSON.stringify(skipResult(reason)));
  process.exit(0);
}

function printPublished({ url, host }) {
  console.log(JSON.stringify(publishedResult({ url, host })));
  process.exit(0);
}

function failWrite(status) {
  console.error(status);
  process.exit(1);
}

function runGh(args, cwd) {
  try {
    const stdout = execFileSync('gh', args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 10 * 1024 * 1024,
    }).trim();
    return { ok: true, stdout };
  } catch (err) {
    return {
      ok: false,
      missing: err?.code === 'ENOENT',
      stderr: String(err?.stderr || err?.message || '').trim(),
    };
  }
}

async function httpJson(url, { method = 'GET', token, json } = {}) {
  const headers = {
    Accept: 'application/json',
    'User-Agent': 'x-code-diff-reviewer',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (json !== undefined) headers['Content-Type'] = 'application/json';
  const res = await fetch(url, {
    method,
    headers,
    body: json !== undefined ? JSON.stringify(json) : undefined,
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  return { ok: res.ok, status: res.status, data };
}

function parseGitHubPrUrl(url) {
  const m = String(url || '').match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/i);
  if (!m) return null;
  return { owner: m[1], repo: m[2], number: Number(m[3]) };
}

export function parseBitbucketPrUrl(url) {
  const m = String(url || '').match(/bitbucket\.org\/([^/]+)\/([^/]+)\/pull-requests\/(\d+)/i);
  if (!m) return null;
  return { workspace: m[1], repo: m[2].replace(/\.git$/i, ''), id: Number(m[3]) };
}

async function findGitHubPull({ root, branch, remoteUrl, prUrlArg }) {
  const parsed = parseGitHubRemote(remoteUrl) || parseGitHubPrUrl(prUrlArg);
  const viewArgs = prUrlArg
    ? ['pr', 'view', prUrlArg, '--json', 'url,body,state']
    : ['pr', 'view', '--json', 'url,body,state'];
  const view = runGh(viewArgs, root);
  if (view.ok) {
    try {
      const data = JSON.parse(view.stdout);
      if (!isOpenPullState(data.state)) return { found: false, skipReason: 'no-pr' };
      return {
        found: true,
        url: data.url,
        body: data.body ?? '',
        number: parseGitHubPrUrl(data.url)?.number,
        owner: parsed?.owner,
        repo: parsed?.repo,
        usedGh: true,
      };
    } catch {
      return { found: false, skipReason: 'no-pr' };
    }
  }
  const token = process.env.GITHUB_TOKEN;
  if (!githubHasAuth({ ghMissing: view.missing, hasToken: Boolean(token) })) {
    return { found: false, skipReason: 'no-auth' };
  }
  if (!(view.missing && token && parsed)) return { found: false, skipReason: 'no-pr' };

  if (prUrlArg) {
    const fromUrl = parseGitHubPrUrl(prUrlArg);
    if (!fromUrl) return { found: false, skipReason: 'no-pr' };
    const res = await httpJson(
      `https://api.github.com/repos/${fromUrl.owner}/${fromUrl.repo}/pulls/${fromUrl.number}`,
      { token },
    );
    if (!res.ok) {
      return { found: false, skipReason: githubRestFindSkipReason(res.status) };
    }
    if (!res.data || !isOpenPullState(res.data.state)) {
      return { found: false, skipReason: 'no-pr' };
    }
    return {
      found: true,
      url: res.data.html_url,
      body: res.data.body ?? '',
      number: res.data.number,
      owner: fromUrl.owner,
      repo: fromUrl.repo,
      usedGh: false,
    };
  }

  const head = `${parsed.owner}:${branch}`;
  const res = await httpJson(
    `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/pulls?head=${encodeURIComponent(head)}&state=open`,
    { token },
  );
  if (!res.ok) {
    return { found: false, skipReason: githubRestFindSkipReason(res.status) };
  }
  if (!Array.isArray(res.data) || res.data.length === 0) {
    return { found: false, skipReason: 'no-pr' };
  }
  const pr = res.data[0];
  return {
    found: true,
    url: pr.html_url,
    body: pr.body ?? '',
    number: pr.number,
    owner: parsed.owner,
    repo: parsed.repo,
    usedGh: false,
  };
}

async function updateGitHubPull(root, pr, body) {
  if (pr.usedGh) {
    writeFileSync(GH_BODY_FILE, body, 'utf8');
    try {
      const editArgs = pr.url
        ? ['pr', 'edit', pr.url, '--body-file', GH_BODY_FILE]
        : ['pr', 'edit', '--body-file', GH_BODY_FILE];
      const edit = runGh(editArgs, root);
      if (edit.ok) return;
      if (!edit.missing) failWrite(edit.stderr || 'gh pr edit failed');
    } finally {
      try {
        unlinkSync(GH_BODY_FILE);
      } catch {
        /* ignore */
      }
    }
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token || !pr.owner || !pr.repo || !pr.number) {
    failWrite(pr.usedGh ? 'gh missing and GITHUB_TOKEN unset' : 'GitHub update failed');
  }
  const res = await httpJson(
    `https://api.github.com/repos/${pr.owner}/${pr.repo}/pulls/${pr.number}`,
    { method: 'PATCH', token, json: { body } },
  );
  if (!res.ok) failWrite(res.status);
}

async function findBitbucketPull({ branch, remoteUrl, prUrlArg, token }) {
  const parsed = resolveBitbucketRepo({ remoteUrl, prUrlArg });
  if (!parsed) return { found: false, skipReason: 'no-pr' };

  if (prUrlArg) {
    const id = parsed.id;
    if (!id) return { found: false, skipReason: 'no-pr' };
    const res = await httpJson(
      `https://api.bitbucket.org/2.0/repositories/${parsed.workspace}/${parsed.repo}/pullrequests/${id}`,
      { token },
    );
    if (!res.ok) return bitbucketGetByIdFailure(res.status);
    if (!isOpenPullState(res.data?.state)) return { found: false, skipReason: 'no-pr' };
    return {
      found: true,
      id: res.data.id,
      title: res.data.title,
      description: res.data.description ?? '',
      url: res.data.links?.html?.href || prUrlArg,
      workspace: parsed.workspace,
      repo: parsed.repo,
    };
  }

  let url = `https://api.bitbucket.org/2.0/repositories/${parsed.workspace}/${parsed.repo}/pullrequests?state=OPEN&pagelen=50`;
  let match = null;
  while (url) {
    const res = await httpJson(url, { token });
    if (!res.ok) {
      return { found: false, skipReason: bitbucketListSkipReason(res.status) };
    }
    const values = res.data?.values ?? [];
    match = values.find((pr) => pr?.source?.branch?.name === branch) || null;
    if (match) break;
    url = res.data?.next || null;
  }
  if (!match) return { found: false, skipReason: 'no-pr' };

  const detail = await httpJson(
    `https://api.bitbucket.org/2.0/repositories/${parsed.workspace}/${parsed.repo}/pullrequests/${match.id}`,
    { token },
  );
  if (!detail.ok) return bitbucketGetByIdFailure(detail.status);
  return {
    found: true,
    id: detail.data.id,
    title: detail.data.title,
    description: detail.data.description ?? '',
    url: detail.data.links?.html?.href,
    workspace: parsed.workspace,
    repo: parsed.repo,
  };
}

async function updateBitbucketPull(pr, description, token) {
  const res = await httpJson(
    `https://api.bitbucket.org/2.0/repositories/${pr.workspace}/${pr.repo}/pullrequests/${pr.id}`,
    {
      method: 'PUT',
      token,
      json: { title: pr.title, description },
    },
  );
  if (!res.ok) failWrite(res.status);
}

async function main() {
  const argv = process.argv.slice(2);
  const prUrlArg = argValue(argv, '--pr-url');

  const root = git(['rev-parse', '--show-toplevel'], process.cwd());
  if (!root) {
    console.error('publish-pr-description: not a git repository (or git is unavailable).');
    process.exit(2);
  }

  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD'], root);
  const remoteUrl = git(['remote', 'get-url', 'origin'], root);
  const host = detectHost(prUrlArg || remoteUrl);

  const reportPath = join(root, REPORT_REL);
  if (!existsSync(reportPath)) {
    console.error('publish-pr-description: latest.md missing');
    process.exit(2);
  }

  const hasAuth = host === 'bitbucket' ? Boolean(process.env.BITBUCKET_TOKEN) : undefined;
  const earlySkip = classifySkip({
    host,
    url: prUrlArg || remoteUrl || 'lookup',
    hasAuth,
  });
  if (earlySkip) printSkip(earlySkip);

  const reportMarkdown = readFileSync(reportPath, 'utf8');

  if (host === 'github') {
    let pr;
    try {
      pr = await findGitHubPull({ root, branch, remoteUrl, prUrlArg });
    } catch {
      printSkip(classifySkip({ host: 'github', url: null }));
    }
    if (!pr?.found) {
      printSkip(pr?.skipReason || classifySkip({ host: 'github', url: null }));
    }
    const newBody = upsertMarkedBlock(pr.body ?? '', reportMarkdown);
    await updateGitHubPull(root, pr, newBody);
    printPublished({ url: pr.url, host: 'github' });
  }

  if (host === 'bitbucket') {
    const token = process.env.BITBUCKET_TOKEN;
    let result;
    try {
      result = await findBitbucketPull({ branch, remoteUrl, prUrlArg, token });
    } catch {
      printSkip(classifySkip({ host: 'bitbucket', url: null }));
    }
    if (!result?.found) {
      printSkip(result?.skipReason || classifySkip({ host: 'bitbucket', url: null }));
    }
    const newBody = upsertMarkedBlock(result.description ?? '', reportMarkdown);
    await updateBitbucketPull(result, newBody, token);
    printPublished({ url: result.url, host: 'bitbucket' });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err?.message || err);
    process.exit(1);
  });
}
