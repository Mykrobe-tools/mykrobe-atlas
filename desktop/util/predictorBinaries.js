/* @flow */

import decompress from 'decompress';
import tmp from 'tmp';
import path from 'path';
import fs from 'fs-extra';

import debug from 'debug';
const d = debug('mykrobe:desktop-util:fetch-predictor-binaries');

const argv = require('minimist')(process.argv.slice(2));
d('argv', JSON.stringify(argv, null, 2));

import { executeCommand } from './executeCommand';
import { GH_TOKEN, fetchGitHubReleases, gitHubPublishConfig } from './gitHub';

export const RESOURCES_BIN_FOLDER = path.join(__dirname, '../resources/bin');
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
    release.assets.forEach((asset) => {
      if (asset.name === name) {
        downloads.push({
          platform,
          url: asset.url,
          browser_download_url: asset.browser_download_url,
          name: asset.name,
        });
      }
    });
  });
  // expect expectedPlatformAssets to have a download for each platform
  if (expectedPlatformAssets.length !== downloads.length) {
    return false;
  }
  return downloads;
};

export const getCurrentPredictorBinariesVersion = () => {
  const platforms = getExpectedPlatformAssetsForTag().map(
    ({ platform }) => platform
  );
  for (let i = 0; i < platforms.length; i++) {
    const platform = platforms[i];
    const platformFolder = path.join(RESOURCES_DESKTOP_FOLDER, platform, 'bin');
    const platformVersionFile = path.join(platformFolder, 'VERSION');
    if (fs.existsSync(platformVersionFile)) {
      const versionTag = fs.readFileSync(platformVersionFile, 'utf8');
      d(`Found executable version ${versionTag} from '${platformVersionFile}'`);
      return versionTag;
    }
  }
};

export const processDownloads = async ({ tag, downloads }: any) => {
  const tmpObj = tmp.dirSync({ prefix: 'mykrobe-' });
  const tmpDir = path.join(tmpObj.name, 'desktop');
  d('tmpDir', tmpDir);
  for (let i = 0; i < downloads.length; i++) {
    const { platform, url, name } = downloads[i];
    const platformTmpDir = path.join(tmpDir, platform);
    fs.ensureDirSync(platformTmpDir);
    // https://developer.github.com/v3/repos/releases/#get-a-single-release-asset
    // insert token as username
    const urlWithToken = `https://${GH_TOKEN}:@${url.substr(8)}`;
    d(`Downloading ${urlWithToken}`);
    const downloadFilename = path.join(platformTmpDir, name);
    // -L = follow redirect
    const command = `curl -L -H "Accept: application/octet-stream" -o "${downloadFilename}" ${urlWithToken}`;
    await executeCommand(command);
    // decompresses into sub-folder 'mykrobe_atlas'
    d(`Decompressing ${name}`);
    await decompress(downloadFilename, platformTmpDir);
    // remove the archive
    fs.removeSync(downloadFilename);
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
  const releases = await fetchGitHubReleases();
  // use the first release
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

export const fetchPredictorBinariesIfChanged = async () => {
  d(`Fetching Predictor binaries if available version has changed`);
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
  // TODO: modify - iterate releases until one satisifies the expected download
  const release = await fetchLatestRelease();
  const tag = release.tag_name;
  d(`GitHub release tag ${tag}`);
  const expectedPlatformAssets = getExpectedPlatformAssetsForTag(tag);
  d('expectedPlatformAssets', JSON.stringify(expectedPlatformAssets, null, 2));
  const downloads = getDownloads({ release, expectedPlatformAssets });
  if (!downloads) {
    const { owner, repo } = gitHubPublishConfig;
    throw `Cannot continue - GitHub release does not include expected assets - check https://github.com/${owner}/${repo}/releases/tag/${tag}`;
  }
  d('Processing downloads', JSON.stringify(downloads, null, 2));
  await processDownloads({ tag, downloads });
};
