#!/usr/bin/env node
import { type ShellType } from "@xdw/shared";
import { run } from "./executor";

// CLI interface
export function runCLI() {
  const args = process.argv.slice(2);

  let targetDir = process.cwd();
  let command: string[] = [];
  let shell: ShellType = undefined;

  if (args.length === 0) {
    return console.log('Use `cx -h` to see available commands.')
  }
  if (args.includes("-h") || args.includes("--help")) {
    return console.log(
      `Run shell command in a folder without changing the current directory

  Usage:
    cx [path] [ -s | --shell ] [shell] [--] <command>
    cx [ -h | --help ]

  Examples:
    cx ./to/path -s /bin/zsh -- echo "hi"`)
  }

  for (let i = 0; i < args.length; i++) {
    targetDir = args[0]
    if (args.length === 1) return
    if (args[i] === '-s' || args[i] === '--shell') {
      shell = args[i + 1];
      i++;
    } else if (args[i] === '--') {
      command = args.slice(i + 1);
      break;
    } else {
      args[i] && command.push(args[i]);
    }
  }

  try {
    run(command, { cwd: targetDir, shell });
  } catch (error) {
    console.error('Error:', (error as Error).message);
    process.exit(1);
  }
}

// Run CLI if this script is executed directly
runCLI();
