/* @flow */

import os from 'os';
const argv = require('minimist')(process.argv.slice(2));

// determine arch and platforms from command line arguments

export default () => {
  let archs;
  let platforms;

  if (argv.all) {
    // archs = ['ia32', 'x64'];
    // platforms = ['linux', 'win32', 'darwin'];
    // there is no Linux build at the moment, also no 32-bit
    archs = ['x64'];
    platforms = ['win32', 'darwin'];
  } else {
    platforms = [];
    // archs = ['ia32', 'x64'];
    if (argv.mac) {
      archs = ['x64'];
      platforms.push('darwin');
    }
    if (argv.win) {
      archs = [];
      if (argv.ia32) {
        archs.push('ia32');
      }
      if (argv.x64 || !archs.length) {
        archs.push('x64');
      }
      platforms.push('win32');
    }
    if (argv.linux) {
      archs = ['x64'];
      platforms.push('linux');
    }
  }

  if (!platforms.length) {
    platforms = [os.platform()];
  }

  if (!archs || !archs.length) {
    archs = [os.arch()];
  }

  return { platforms, archs };
};
