/* @flow */

import debug from 'debug';

const argv = require('minimist')(process.argv.slice(2));

console.log('argv', JSON.stringify(argv, null, 2));

if ( argv.exitWithCode ) {
  process.exit(argv.exitWithCode);
}