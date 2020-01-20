/* @flow */

import download from 'progress-download';
import decompress from 'decompress';
import tmp from 'tmp';
import path from 'path';
import fs from 'fs-extra';

import debug from 'debug';
const d = debug('mykrobe:desktop-fetch-predictor-binaries');

const argv = require('minimist')(process.argv.slice(2));
d('argv', JSON.stringify(argv, null, 2));

import { updateStaticPackageJson, fetchGitHubReleases } from './util';

export const RESOURCES_BIN_FOLDER = path.join(__dirname, 'resources', 'bin');
export const RESOURCES_DESKTOP_FOLDER = path.join(
  RESOURCES_BIN_FOLDER,
  'desktop'
);
export const RESOURCES_DESKTOP_OLD_FOLDER = path.join(
  RESOURCES_BIN_FOLDER,
  'desktop.old'
);

export const getExpectedPlatformAssetsForTag = (tag: string): Array<*> => [
  {
    platform: 'darwin-x64',
    name: `mykrobe.command_line.osx.${tag}.tar.gz`,
  },
  {
    platform: 'win32-x64',
    name: `mykrobe.command_line.windows.${tag}.tar.gz`,
  },
];

export const getDownloads = ({
  release,
  expectedPlatformAssets,
}: any): Array<*> => {
  const downloads = [];
  expectedPlatformAssets.forEach(({ platform, name }) => {
    release.assets.forEach(asset => {
      if (asset.name === name) {
        downloads.push({
          platform,
          url: asset.browser_download_url,
          name: asset.name,
        });
      }
    });
  });
  return downloads;
};

export const processDownloads = async ({ tag, downloads }: any) => {
  const tmpObj = tmp.dirSync({ prefix: 'mykrobe-' });
  const tmpDir = path.join(tmpObj.name, 'desktop');
  d('tmpDir', tmpDir);
  for (let i = 0; i < downloads.length; i++) {
    const { platform, url, name } = downloads[i];
    const platformTmpDir = path.join(tmpDir, platform);
    d(`Downloading ${url}`);
    await download(url, platformTmpDir);
    // decompresses into sub-folder 'mykrobe_atlas'
    d(`Decompressing ${name}`);
    await decompress(path.join(platformTmpDir, name), platformTmpDir);
    // remove the archive
    fs.removeSync(path.join(platformTmpDir, name));
    // rename sub-folder 'mykrobe_atlas' -> 'bin'
    fs.renameSync(
      path.join(platformTmpDir, 'mykrobe_atlas'),
      path.join(platformTmpDir, 'bin')
    );
    // write version tag into VERSION file
    fs.writeFileSync(path.join(platformTmpDir, 'bin', 'VERSION'), tag);
  }
  // rename old desktop folder
  if (fs.existsSync(RESOURCES_DESKTOP_FOLDER)) {
    fs.moveSync(
      path.join(RESOURCES_DESKTOP_FOLDER),
      path.join(RESOURCES_DESKTOP_OLD_FOLDER),
      { overwrite: true }
    );
  }
  // move new desktop folder into place
  fs.renameSync(tmpDir, RESOURCES_DESKTOP_FOLDER);
  // delete tmp folder
  fs.removeSync(tmpDir);
};

export const fetchLatestRelease = async () => {
  d('Fetching GitHub releases');
  const releases = await fetchGitHubReleases({
    owner: 'martinghunt',
    repo: 'mykrobe',
  });
  // use the first release
  // TODO: modify - iterate releases until one satisifies the expected download
  const release = releases[0];
  d('Using first GitHub release:', JSON.stringify(release, null, 2));
  return release;
};

export const currentPredictorBinariesMatchReleaseVersion = async () => {
  d(`Checking if current binaries match GitHub release version`);
  const release = await fetchLatestRelease();
  const tag = release.tag_name;
  d(`GitHub release tag ${tag}`);
  const expectedPlatformAssets = getExpectedPlatformAssetsForTag(tag);
  for (let i = 0; i < expectedPlatformAssets.length; i++) {
    const expectedPlatformAsset = expectedPlatformAssets[i];
    const { platform } = expectedPlatformAsset;
    d(`Platform ${platform}`);
    const platformFolder = path.join(RESOURCES_DESKTOP_FOLDER, platform, 'bin');
    const platformVersionFile = path.join(platformFolder, 'VERSION');
    d(`Checking for existence of ${platformVersionFile}`);
    if (!fs.existsSync(platformVersionFile)) {
      d(`Does not exist`);
      return false;
    }
    const versionTag = fs.readFileSync(platformVersionFile, 'utf8');
    d(`VERSION tag ${versionTag}`);
    if (tag !== versionTag) {
      return false;
    }
  }
  return true;
};

export const fetchPredictorBinariesIfNotMatch = async () => {
  const currentPredictorBinariesMatch = await currentPredictorBinariesMatchReleaseVersion();
  if (currentPredictorBinariesMatch) {
    d(`All versions match`);
    return;
  }
  d(`Versions do not match`);
  await fetchPredictorBinaries();
};

export const fetchPredictorBinaries = async () => {
  d(`Fetching Predictor binaries`);
  const release = await fetchLatestRelease();
  const tag = release.tag_name;
  d(`GitHub release tag ${tag}`);
  const expectedPlatformAssets = getExpectedPlatformAssetsForTag(tag);
  d('expectedPlatformAssets', JSON.stringify(expectedPlatformAssets, null, 2));
  // TODO: fail if we did not find a release with expected assets
  const downloads = getDownloads({ release, expectedPlatformAssets });
  d('downloads', JSON.stringify(downloads, null, 2));
  try {
    d('Processing downloads');
    await processDownloads({ tag, downloads });
    // if successful, update executable display version
    d('Updating display executable version');
    updateStaticPackageJson({ executableVersion: tag });
  } catch (e) {
    d(e);
    d('Download and installation failed - nothing changed');
  }
};

(async () => {
  if (argv.force) {
    d(`Fetch forced`);
    await fetchPredictorBinaries();
  } else {
    await fetchPredictorBinariesIfNotMatch();
  }
})();
