"use strict";
// # TODO  like`pnpm - C xxx`
Object.defineProperty(exports, "__esModule", { value: true });
exports.execPnpmCommand = execPnpmCommand;
function getPkgManager() {
}
async function execPnpmCommand(command, cwd) {
    console.log(`Executing pnpm command in ${cwd}: pnpm ${command.join(' ')}`);
    return exec(['npm', ...command], cwd);
}
//# sourceMappingURL=pk.js.map