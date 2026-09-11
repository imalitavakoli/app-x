# Optional caller examples

Copy-and-adapt. The skill works with none of these files installed. A live pipeline is a later copy of an example (or another host’s format), not these files themselves.

## What a caller must do

On merge-request / pull-request opened, start an **agent** and point it at:

`.agents/skills/x-code-diff-reviewer/SKILL.md`

Node alone cannot write the human report — a pipeline step that only runs scripts is not enough. The agent loads the skill, reviews the diff, and produces the reports.

## Hosts

The YAML files here are **example formats** (GitHub Actions, Bitbucket Pipelines). They are not the set of supported hosts. Any host that can start an agent on PR open can call this skill the same way.

Do not commit secrets into these examples or into a real pipeline that copies them.
