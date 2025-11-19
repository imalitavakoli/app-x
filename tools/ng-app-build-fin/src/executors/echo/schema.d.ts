export interface EchoExecutorSchema {
  changelog: string;
  environmentsPath: string;
  projectName: string;
  projectBuildTarget: string;
  handleGit?: boolean;
}
