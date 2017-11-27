/* @flow */

import { execSync } from 'child_process';
import os from 'os';

const ENV_HOME = process.env.HOME;
const IS_CYGWIN = !!/cygwin/.test(ENV_HOME);

export const escapePath = unescaped => {
  if (os.platform() === 'darwin') {
    return unescaped.replace(/(\s)/g, '\\ ');
  }
  return unescaped;
};

export const executeCommand = command => {
  if (IS_CYGWIN) {
    command =
      ENV_HOME.replace(/(cygwin[0-9]*).*/, '$1') +
      '\\bin\\bash.exe -c "' +
      command.replace(/\\/g, '/').replace(/"/g, '\\"') +
      '"';
  }
  console.log(command);
  execSync(command, { stdio: [0, 1, 2] });
};
