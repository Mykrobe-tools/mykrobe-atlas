/* @flow */

const { notarize } = require('electron-notarize');
import debug from 'debug';

const d = debug('mykrobe:desktop-notarize');

const pkg = require('../package.json');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    d(`Skipping notarize for platform '${electronPlatformName}'`);
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
  d(`Calling notarize with args`, JSON.stringify(args, null, 2));
  return await notarize(args);
};
