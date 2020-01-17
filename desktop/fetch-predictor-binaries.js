/* @flow */

import { fetchGitHubReleases } from './util/gitHub';

(async () => {
  const releases = await fetchGitHubReleases({
    owner: 'martinghunt',
    repo: 'mykrobe',
  });
  // use the first release
  const release = releases[0];
  console.log('release', JSON.stringify(release, null, 2));
  const tag = release.tag_name;
  console.log(`Release tag ${tag}`);
  const downloadForPlatforms = {};
  release.assets.forEach(asset => {
    if (asset.browser_download_url) {
      // macOS binary? - mykrobe.command_line.osx.v1.0.6.tar.gz
      if (
        asset.browser_download_url.includes(
          `mykrobe.command_line.osx.${tag}.tar.gz`
        )
      ) {
        downloadForPlatforms['darwin-x64'] = asset.browser_download_url;
      } else if (
        asset.browser_download_url.includes(
          `mykrobe.command_line.windows.${tag}.tar.gz`
        )
      ) {
        downloadForPlatforms['win32-x64'] = asset.browser_download_url;
      }
    }
  });
  console.log(
    'downloadForPlatforms',
    JSON.stringify(downloadForPlatforms, null, 2)
  );
})();
