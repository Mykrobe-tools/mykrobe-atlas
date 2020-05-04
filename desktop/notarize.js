/* @flow */

const { notarize } = require('electron-notarize');
const argv = require('minimist')(process.argv.slice(2));

import debug from 'debug';
const d = debug('mykrobe:desktop-notarize');

const pkg = require('../package.json');

exports.default = async (context) => {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    d(`Skipping notarize for platform '${electronPlatformName}'`);
    return;
  }

  if (argv['skip-notarize']) {
    d(`Skipping notarize`);
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  const args = {
    appBundleId: pkg.build.appId,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.MAC_NOTARIZE_APPLE_ID,
    appleIdPassword: process.env.MAC_NOTARIZE_APPLE_ID_PASSWORD,
    ascProvider: process.env.MAC_NOTARIZE_ASC_PROVIDER,
  };

  d(`Calling electron-notarize with args`, JSON.stringify(args, null, 2));

  return await notarize(args);
};
