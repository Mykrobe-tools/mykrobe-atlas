/* @flow */

import { fetchGitHubReleases } from './util/gitHub';

(async () => {
  const releases = await fetchGitHubReleases();
  console.log('releases', JSON.stringify(releases, null, 2));
})();
