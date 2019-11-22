/* @flow */

const { notarize } = require('electron-notarize');
const argv = require('minimist')(process.argv.slice(2));

import debug from 'debug';
const d = debug('mykrobe:desktop-notarize');

const pkg = require('../package.json');

exports.default = async context => {
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
    appleId: 'si@simonheys.com',
    appleIdPassword: '@keychain:Application Loader: si@simonheys.com',
    // $ xcrun altool --list-providers -u 'si@simonheys.com' -p @keychain:"Application Loader: si@simonheys.com"
    // ProviderShortname
    ascProvider: '67D36TNWRH',
  };

  d(`Calling electron-notarize with args`, JSON.stringify(args, null, 2));

  return await notarize(args);
};
