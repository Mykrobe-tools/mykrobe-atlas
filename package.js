require('babel-polyfill');

const os = require('os');
const webpack = require('webpack');
const electronCfg = require('./webpack.config.electron');
const cfg = require('./webpack.config.production');
const packager = require('electron-packager');
const del = require('del');
const exec = require('child_process').exec;
const argv = require('minimist')(process.argv.slice(2));
const pkg = require('./package.json');
const path = require('path');
const deps = Object.keys(pkg.dependencies);
const devDeps = Object.keys(pkg.devDependencies);

const shouldUseAsar = argv.asar || argv.a || false;
const shouldBuildAll = argv.all || false;

const icon = path.resolve(__dirname, `resources/icon/${pkg.targetName}/icon`);

const DEFAULT_OPTS = {
  dir: './static',
  name: pkg.productName,
  icon: icon,
  asar: shouldUseAsar,
  'extend-info': './resources/plist/extend-info.plist',
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
  exec('npm list electron-prebuilt --depth=0 --dev', (err, stdout) => {
    if (err) {
      DEFAULT_OPTS.version = '1.3.5';
    }
    else {
      DEFAULT_OPTS.version = stdout.split('electron-prebuilt@')[1].replace(/\s/g, '');
    }
    startPack();
  });
}

function build(cfg) {
  return new Promise((resolve, reject) => {
    webpack(cfg, (err, stats) => {
      if (err) return reject(err);
      resolve(stats);
    });
  });
}

function startPack() {
  console.log('start pack...');
  build(electronCfg)
    .then(() => build(cfg))
    .then(() => del('release'))
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
  if ('darwin' === plat && 'ia32' === arch) {
    return;
  }

  const iconObj = {
    icon: DEFAULT_OPTS.icon + (() => {
      let extension = '.png';
      if ('darwin' === plat) {
        extension = '.icns';
      }
      else if ('win32' === plat) {
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
    out: `release/${plat}-${arch}`
  });

  console.log(JSON.stringify(opts, null, 2));

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
