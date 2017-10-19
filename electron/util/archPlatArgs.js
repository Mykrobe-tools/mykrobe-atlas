/* @flow */

import os from 'os';
const argv = require('minimist')(process.argv.slice(2));

// dtermine arch and platforms from command line arguments

export default () => {
  let archs;
  let platforms;

  if (argv.all) {
    archs = ['ia32', 'x64'];
    platforms = ['linux', 'win32', 'darwin'];
  } else {
    platforms = [];
    archs = ['ia32', 'x64'];
    if (argv.mac) {
      platforms.push('darwin');
    }
    if (argv.win) {
      platforms.push('win32');
      if (argv.x64 && !argv.ia32) {
        archs = ['x64'];
      }
    }
    if (argv.linux) {
      platforms.push('linux');
    }
  }

  if (!platforms.length) {
    platforms = [os.platform()];
  }

  if (!archs.length) {
    archs = [os.arch()];
  }

  return { platforms, archs };
};
