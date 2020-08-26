/* @flow */

import os from 'os';

export {
  fetchGitHubReleases,
  fetchGitHub,
  gitHubPublishConfig,
} from './gitHub';

export { updateBuildPackageJson } from './buildPackageJson';

export {
  fetchLatestRelease,
  fetchPredictorBinaries,
  fetchPredictorBinariesIfChanged,
} from './predictorBinaries';

export { executeCommand } from './executeCommand';

export { default as checkCanPublishWithEnv } from './checkCanPublishWithEnv';

export const arch = os.arch();
export const plat = os.platform();
