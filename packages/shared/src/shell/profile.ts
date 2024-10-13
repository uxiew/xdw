import os from "node:os";
import path from "node:path";

/**
 * supports more shell types, including bash, zsh, fish, csh, tcsh, ksh, dash, and sh.
 * Added support for Windows environments, including cmd.exe and PowerShell
 */
export function getProfileFile(shell: string): string {
  const homeDir = os.homedir();
  const isWindows = os.platform() === 'win32';
  const shellName = path.basename(shell).toLowerCase();

  if (isWindows) {
    // on Windows OS
    switch (shellName) {
      case 'cmd.exe':
        return '%USERPROFILE%\\Documents\\WindowsPowerShell\\profile.ps1';
      case 'powershell.exe':
      case 'pwsh.exe':
        return path.join(homeDir, 'Documents', 'WindowsPowerShell', 'profile.ps1');
      default:
        return ''; // other shell no profile
    }
  } else {
    // on Unix-like OS
    switch (shellName) {
      case 'bash':
        return path.join(homeDir, '.bashrc');
      case 'zsh':
        return path.join(homeDir, '.zshrc');
      case 'fish':
        return path.join(homeDir, '.config', 'fish', 'config.fish');
      case 'csh':
      case 'tcsh':
        return path.join(homeDir, '.cshrc');
      case 'ksh':
        return path.join(homeDir, '.kshrc');
      case 'dash':
      case 'sh':
        return path.join(homeDir, '.profile');
      default:
        return '';
    }
  }
}
