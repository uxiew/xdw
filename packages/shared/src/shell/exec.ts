import {
  exec, spawn,
  type ExecOptions,
} from "node:child_process";
import { detectDefaultShell } from 'default-shell';

export type ShellType = ExecOptions['shell']

/**
* Exec command with user profile. automatically detects the user's shell.
*/
export function execute(
  command: string[],
  options: ExecOptions = {},
  loadProfile: boolean = false,
): Promise<void> {
  const { cwd = '.', shell = detectDefaultShell() } = options
  return new Promise((resolve, reject) => {
    let finalShell, finalCommand = command;

    if (loadProfile && typeof shell === 'string') {
      // https://github.com/MohamedK1/raycast-extensions/blob/main/extensions/shell/src/index.tsx#L61
      finalCommand = ['-i', '-c', `"${command.join(' ')}"`];
      finalShell = shell;
    }

    // console.log(finalCommand, finalShell, cwd, shell, shelljs.exec('gst'))
    const childProcess = spawn(
      finalShell || finalCommand[0],
      finalShell ? finalCommand
        : finalCommand.slice(1),
      {
        stdio: 'inherit',
        shell: finalShell,
        cwd: cwd,
      }
    );

    childProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
      } else {
        resolve();
      }
    });
  });
}
