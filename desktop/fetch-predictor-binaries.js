/* @flow */

import download from 'progress-download';
import decompress from 'decompress';
import tmp from 'tmp';
import path from 'path';
import fs from 'fs-extra';

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
        downloadForPlatforms['darwin-x64'] = {
          url: asset.browser_download_url,
          name: asset.name,
        };
      } else if (
        asset.browser_download_url.includes(
          `mykrobe.command_line.windows.${tag}.tar.gz`
        )
      ) {
        downloadForPlatforms['win32-x64'] = {
          url: asset.browser_download_url,
          name: asset.name,
        };
      }
    }
  });
  console.log(
    'downloadForPlatforms',
    JSON.stringify(downloadForPlatforms, null, 2)
  );
  const tmpObj = tmp.dirSync({ prefix: 'mykrobe-' });
  const tmpDir = tmpObj.name;
  console.log('tmpDir', tmpDir);
  const asset = downloadForPlatforms['darwin-x64'];
  await download(asset.url, tmpDir);
  // decompresses into sub-folder 'mykrobe_atlas'
  await decompress(path.join(tmpDir, asset.name), tmpDir);
  // fs.removeSync(tmpDir);
})();
