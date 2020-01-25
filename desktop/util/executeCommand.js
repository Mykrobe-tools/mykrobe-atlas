/* @flow */

import { execSync } from 'child_process';

import debug from 'debug';
const d = debug('mykrobe:desktop-util:execute-command');

export const executeCommand = async (command: string) => {
  d(command);
  execSync(command, { stdio: [0, 1, 2] });
};
