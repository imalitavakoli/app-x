export interface EchoV1ExecutorSchema {
  changelog: string;
  environmentsPath: string;
  projectName: string;
  projectBuildTarget: string;
  handleGit?: boolean;
}
