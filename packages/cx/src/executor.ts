import path from 'node:path';
import fs from 'node:fs';
import { createColors } from 'picocolors';
import { execute, ShellType } from '@xdw/shared';
const colors = createColors()

export type ProcessArgv = string[]

interface CommandOptions {
  cwd?: string;
  shell?: ShellType;
}

function execCommand(
  command: string[],
  cwd: string,
  shell: ShellType,
  loadProfile: boolean = true,
) {
  console.log(colors.underline(
    colors.gray(`Running ${colors.cyan(command.join(' '))} in ${colors.green(cwd)}: `)
  ));

  return execute(command, { shell, cwd }, loadProfile);
}

/**
* Run the specified command
*/
export async function run(command: ProcessArgv, options: CommandOptions = {}): Promise<unknown> {
  const originalDir = process.cwd();
  const { cwd = '.', shell } = options;
  const targetDir = path.resolve(originalDir, cwd);

  if (!fs.existsSync(targetDir)) {
    throw new Error(`Directory not found: ${targetDir} `);
  }
  return execCommand(command, targetDir, shell);
}
