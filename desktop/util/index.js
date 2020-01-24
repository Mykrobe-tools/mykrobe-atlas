/* @flow */

import { execSync } from 'child_process';
import os from 'os';

export {
  fetchGitHubReleases,
  fetchGitHub,
  gitHubPublishConfig,
} from './gitHub';

export { updateStaticPackageJson } from './staticPackageJson';

export {
  fetchPredictorBinaries,
  fetchPredictorBinariesIfChanged,
} from './predictorBinaries';

import debug from 'debug';
const d = debug('mykrobe:desktop-util');

export const arch = os.arch();
export const plat = os.platform();

export const executeCommand = async (command: string) => {
  d(command);
  execSync(command, { stdio: [0, 1, 2] });
};
