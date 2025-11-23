export interface FinV1ExecutorSchema {
  changelog: string;
  environmentsPath: string;
  projectName: string;
  projectBuildTarget: string;
  handleGit?: boolean;
}
