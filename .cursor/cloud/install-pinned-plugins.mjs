#!/usr/bin/env node
/**
 * Cursor Cloud — install SHA-pinned plugins from `.agents/_pins/plugins/catalog.json`
 * into `~/.cursor/skills/` so Cloud Agents can load them.
 *
 * Idempotent. Pure Node (no package deps) so it can run from `environment.json`
 * before or alongside `pnpm install`. Only entries whose `harnesses` include
 * `cursor-cloud` are installed.
 *
 * Marker: `~/.cursor/x-pins/<plugin>.json` — version + sha for the workflow checker.
 */
import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HARNESS = 'cursor-cloud';
const scriptDir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(scriptDir, '..', '..');
const CATALOG = join(ROOT, '.agents', '_pins', 'plugins', 'catalog.json');
const HOME = process.env.HOME || process.env.USERPROFILE;

if (!HOME) {
  console.error('install-pinned-plugins: HOME is unset');
  process.exit(1);
}

const skillsRoot = join(HOME, '.cursor', 'skills');
const pinsRoot = join(HOME, '.cursor', 'x-pins');

function loadCatalog() {
  if (!existsSync(CATALOG)) {
    throw new Error(`missing pin catalog: ${CATALOG}`);
  }
  const raw = JSON.parse(readFileSync(CATALOG, 'utf8'));
  const plugins = Array.isArray(raw?.plugins) ? raw.plugins : [];
  return plugins.filter(
    (p) =>
      p &&
      typeof p.name === 'string' &&
      Array.isArray(p.harnesses) &&
      p.harnesses.includes(HARNESS),
  );
}

function run(cmd, args) {
  const r = spawnSync(cmd, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (r.status !== 0) {
    const err = (r.stderr || r.stdout || '').trim();
    throw new Error(`${cmd} ${args.join(' ')} failed (${r.status}): ${err}`);
  }
  return r.stdout;
}

function alreadyInstalled(name, sha) {
  const marker = join(pinsRoot, `${name}.json`);
  if (!existsSync(marker)) return false;
  try {
    const m = JSON.parse(readFileSync(marker, 'utf8'));
    return m.sha === sha && m.harness === HARNESS;
  } catch {
    return false;
  }
}

function installPlugin(entry) {
  const { name, version, source } = entry;
  const url = source?.url;
  const sha = source?.sha;
  if (!url || !sha) {
    throw new Error(`plugin ${name}: source.url and source.sha are required`);
  }

  if (alreadyInstalled(name, sha)) {
    console.log(
      `install-pinned-plugins: ${name}@${sha.slice(0, 7)} already present`,
    );
    return;
  }

  const tmp = mkdtempSync(join(tmpdir(), `x-pin-${name}-`));
  try {
    console.log(`install-pinned-plugins: cloning ${name} @ ${sha.slice(0, 7)}`);
    run('git', ['clone', '--filter=blob:none', url, tmp]);
    run('git', ['-C', tmp, 'checkout', '--detach', sha]);

    const skillsSrc = join(tmp, 'skills');
    if (!existsSync(skillsSrc)) {
      throw new Error(`${name}: no skills/ directory at ${sha}`);
    }

    mkdirSync(skillsRoot, { recursive: true });
    mkdirSync(pinsRoot, { recursive: true });

    for (const ent of readdirSync(skillsSrc)) {
      const src = join(skillsSrc, ent);
      if (!statSync(src).isDirectory()) continue;
      if (!existsSync(join(src, 'SKILL.md'))) continue;
      const dest = join(skillsRoot, ent);
      rmSync(dest, { recursive: true, force: true });
      cpSync(src, dest, { recursive: true });
    }

    writeFileSync(
      join(pinsRoot, `${name}.json`),
      JSON.stringify(
        {
          name,
          version: version ?? null,
          sha,
          harness: HARNESS,
          skillsRoot,
          installedAt: new Date().toISOString(),
        },
        null,
        2,
      ) + '\n',
    );
    console.log(`install-pinned-plugins: ${name} ready under ${skillsRoot}`);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

try {
  const plugins = loadCatalog();
  if (!plugins.length) {
    console.log(
      `install-pinned-plugins: no catalog entries for harness ${HARNESS}`,
    );
    process.exit(0);
  }
  for (const p of plugins) installPlugin(p);
} catch (err) {
  console.error(`install-pinned-plugins: ${err.message || err}`);
  process.exit(1);
}
