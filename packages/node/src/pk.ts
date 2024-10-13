// # TODO  like`pnpm - C xxx`

import { } from '@xdw/cx'


function getPkgManager() {

}

export async function execPnpmCommand(command: ProcessArgv, cwd: string) {
  console.log(`Executing pnpm command in ${cwd}: pnpm ${command.join(' ')}`);
  return exec(['npm', ...command], cwd);
}
