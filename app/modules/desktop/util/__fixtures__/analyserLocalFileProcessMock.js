/* @flow */

import debug from 'debug';

const argv = require('minimist')(process.argv.slice(2));

if ( argv.exitWithCode ) {
  process.exit(argv.exitWithCode);
}

// process.stdout.write(JSON.stringify(argv,null,2) + '\n');

if ( argv.progress ) {
  console.log(`[15 Oct 2017 16:19:47-Kac] Progress: 130,000/454,797`);
}

if ( argv.emit ) {
  console.log(argv.emit);
}