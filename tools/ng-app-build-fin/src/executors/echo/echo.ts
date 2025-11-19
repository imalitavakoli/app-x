import {
  PromiseExecutor,
  runExecutor as nxRunExecutor,
  ExecutorContext,
} from '@nx/devkit';
import { EchoExecutorSchema } from './schema';
import {
  validateOptions,
  getLatestVersionFromChangelog,
  createAndSwitchFinBranch,
  updateEnvironmentFiles,
  deleteOldFinFiles,
  copyDistToFin,
  commitAndPushFin,
} from './fin-util';

const runExecutor: PromiseExecutor<EchoExecutorSchema> = async (
  options,
  context: ExecutorContext,
) => {
  // Step 1: Validate options
  const validation = validateOptions(options);
  if (!validation.valid) {
    console.error(validation.message || 'Invalid options');
    return { success: false };
  }

  // Step 2: Get latest version and description from changelog
  const changelogInfo = getLatestVersionFromChangelog(options.changelog);
  if (!changelogInfo) {
    console.error('Could not parse version from changelog');
    return { success: false };
  }
  const { version, description } = changelogInfo;

  // Step 3: (Git) Create FIN branch
  if (options.handleGit) {
    const branchOk = createAndSwitchFinBranch(options.projectName, version);
    if (!branchOk) {
      console.error('Failed to create or switch to FIN branch');
      return { success: false };
    }
  }

  // Step 4: Update environments files
  try {
    updateEnvironmentFiles(options.environmentsPath, version);
  } catch (e) {
    console.error('Failed to update environment files');
    return { success: false };
  }

  // Step 5: Build project
  try {
    const buildResult = await nxRunExecutor(
      { project: options.projectName, target: options.projectBuildTarget },
      {},
      context,
    );
    // nxRunExecutor returns an async iterable, so iterate if possible
    for await (const res of buildResult) {
      if (!res.success) {
        console.error('Build executor failed');
        return { success: false };
      }
    }
  } catch (e) {
    console.error('Build executor threw an error');
    return { success: false };
  }

  // Step 6: Delete old FIN files
  const finPath = `fin/apps/${options.projectName}/browser`;
  try {
    deleteOldFinFiles(finPath);
  } catch (e) {
    console.error('Failed to delete old FIN files');
    return { success: false };
  }

  // Step 7: Copy new dist files
  const distPath = `dist/apps/${options.projectName}/browser`;
  try {
    copyDistToFin(distPath, finPath);
  } catch (e) {
    console.error('Failed to copy dist files to FIN');
    return { success: false };
  }

  // Step 8: (Git) Commit and push changes
  if (options.handleGit) {
    const commitOk = commitAndPushFin(
      options.projectName,
      version,
      description,
    );
    if (!commitOk) {
      console.error('Failed to commit or push FIN changes');
      return { success: false };
    }
  }

  return { success: true };
};

export default runExecutor;
