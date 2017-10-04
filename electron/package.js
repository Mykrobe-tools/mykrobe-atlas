/* @flow */

const os = require('os');
const webpack = require('webpack');
const gutil = require('gulp-util');
const electronCfg = require('./webpack.config.electron');
const cfg = require('./webpack.config.production');
const packager = require('electron-packager');
const del = require('del');
const exec = require('child_process').exec;
const argv = require('minimist')(process.argv.slice(2));
const pkg = require('../package.json');
const path = require('path');
const deps = Object.keys(pkg.dependencies);
const devDeps = Object.keys(pkg.devDependencies);

const shouldUseAsar = argv.asar || argv.a || false;
const shouldBuildAll = argv.all || false;

const icon = path.resolve(__dirname, `resources/icon/${pkg.targetName}/icon`);

const DEFAULT_OPTS = {
  dir: path.resolve(__dirname, './static'),
  name: pkg.productName,
  icon: icon,
  asar: shouldUseAsar,
  version: '',
  'extend-info': path.resolve(__dirname, './resources/plist/extend-info.plist'),
  ignore: [
    '^/test($|/)',
    '^/release($|/)',
    '^/main.development.js',
    'skeleton.k15.ctx'
  ].concat(devDeps.map((name) => `/node_modules/${name}($|/)`))
  .concat(
    deps.filter((name) => !electronCfg.externals.includes(name))
      .map((name) => `/node_modules/${name}($|/)`)
  )
};

// this is the version of Electron to use
const version = argv.version || argv.v;

if (version) {
  DEFAULT_OPTS.version = version;
  startPack();
}
else {
  // use the same version as the currently-installed electron-prebuilt
  exec('npm list electron-prebuilt --json --dev', (error, stdout, stderr) => {
    if (error) {
      console.error('error', error, stderr, stdout);
      DEFAULT_OPTS.version = '1.3.3';
    }
    else {
      const json = JSON.parse(stdout);
      const version = json.dependencies['electron-prebuilt'].version;
      DEFAULT_OPTS.version = version;
    }
    startPack();
  });
}

function build(cfg) {
  return new Promise((resolve, reject) => {
    console.log('build', JSON.stringify(cfg, null, 2));
    webpack(cfg, (err, stats) => {
      if (err) return reject(err);
      gutil.log('[webpack:build]', stats.toString({
        chunks: false, // Makes the build much quieter
        colors: true
      }));
      resolve(stats);
    });
  });
}

function startPack() {
  console.log('start pack...');
  build(electronCfg)
    .then(() => build(cfg))
    .then(() => del(path.resolve(__dirname, 'release')))
    .then((paths) => {
      if (shouldBuildAll) {
        // build for all platforms
        const archs = ['ia32', 'x64'];
        const platforms = ['linux', 'win32', 'darwin'];

        platforms.forEach((plat) => {
          archs.forEach((arch) => {
            pack(plat, arch, log(plat, arch));
          });
        });
      }
      else {
        // build for current platform only
        pack(os.platform(), os.arch(), log(os.platform(), os.arch()));
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

function pack(plat, arch, cb) {
  // there is no darwin ia32 electron
  if (plat === 'darwin' && arch === 'ia32') {
    return;
  }

  const iconObj = {
    icon: DEFAULT_OPTS.icon + (() => {
      let extension = '.png';
      if (plat === 'darwin') {
        extension = '.icns';
      }
      else if (plat === 'win32' || plat === 'win64') {
        extension = '.ico';
      }
      return extension;
    })()
  };

  const opts = Object.assign({}, DEFAULT_OPTS, iconObj, {
    platform: plat,
    arch,
    prune: true,
    'app-version': pkg.version || DEFAULT_OPTS.version,
    out: path.resolve(__dirname, `release/${plat}-${arch}`)
  });

  // console.log(JSON.stringify(opts, null, 2));

  packager(opts, cb);
}

function log(plat, arch) {
  return (err, filepath) => {
    if (err) {
      return console.error(err);
    }
    console.log(`${plat}-${arch} finished!`);
  };
}
