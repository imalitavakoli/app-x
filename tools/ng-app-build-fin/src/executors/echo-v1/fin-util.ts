// Utility functions for ng-app-build-fin executor
import { ExecutorContext } from '@nx/devkit';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export function validateOptions(options: any): {
  valid: boolean;
  message?: string;
} {
  const required = [
    'changelog',
    'environmentsPath',
    'projectName',
    'projectBuildTarget',
  ];
  for (const key of required) {
    if (!options[key]) {
      return { valid: false, message: `Missing required option: ${key}` };
    }
  }
  return { valid: true };
}

export function getLatestVersionFromChangelog(
  changelogPath: string,
): { version: string; description: string } | null {
  const content = fs.readFileSync(changelogPath, 'utf-8');
  const versionMatch = content.match(
    /\[(\d+\.\d+\.\d+)] - (\d{4}-\d{2}-\d{2})/,
  );
  if (!versionMatch) return null;
  const version = versionMatch[1];
  // Find the description under the latest version
  const descMatch = content.match(
    /\[\d+\.\d+\.\d+] - \d{4}-\d{2}-\d{2}\s*([\s\S]*?)(?:\n\[|$)/,
  );
  let description = descMatch ? descMatch[1].trim().split('\n')[0] : '';
  if (description.length > 50) description = description.slice(0, 50);
  return { version, description };
}

export function createAndSwitchFinBranch(
  projectName: string,
  version: string,
): boolean {
  const branch = `${projectName}/v${version}`;
  try {
    execSync(`git checkout -b ${branch}`);
    execSync(`git push --set-upstream origin ${branch}`);
    return true;
  } catch (e) {
    return false;
  }
}

export function updateEnvironmentFiles(envPath: string, version: string): void {
  const files = fs.readdirSync(envPath).filter((f) => f.endsWith('.ts'));
  for (const file of files) {
    const filePath = path.join(envPath, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    if (!content.includes('const environment')) continue;
    if (!content.includes('version')) continue;
    content = content.replace(
      /version:\s*['"].*?['"]/,
      `version: '${version}'`,
    );
    fs.writeFileSync(filePath, content, 'utf-8');
  }
}

export function deleteOldFinFiles(finPath: string): void {
  if (!fs.existsSync(finPath)) return;
  const files = fs.readdirSync(finPath);
  for (const file of files) {
    if (file === 'web.config' || file === '.htaccess') continue;
    const filePath = path.join(finPath, file);
    fs.rmSync(filePath, { recursive: true, force: true });
  }
}

export function copyDistToFin(distPath: string, finPath: string): void {
  if (!fs.existsSync(distPath)) return;
  fs.mkdirSync(finPath, { recursive: true });
  const files = fs.readdirSync(distPath);
  for (const file of files) {
    const src = path.join(distPath, file);
    const dest = path.join(finPath, file);
    if (fs.lstatSync(src).isDirectory()) {
      copyDistToFin(src, dest);
    } else {
      fs.copyFileSync(src, dest);
    }
  }
}

export function commitAndPushFin(
  projectName: string,
  version: string,
  description: string,
): boolean {
  const msg = `${projectName}/v${version}: ${description}`;
  try {
    execSync('git add .');
    execSync(`git commit -m "${msg}"`);
    execSync('git push');
    return true;
  } catch (e) {
    return false;
  }
}
