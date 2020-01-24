/* @flow */

import debug from 'debug';
const d = debug('mykrobe:desktop-fetch-predictor-binaries');

const argv = require('minimist')(process.argv.slice(2));
d('argv', JSON.stringify(argv, null, 2));

import {
  fetchPredictorBinaries,
  fetchPredictorBinariesIfChanged,
} from './util';

(async () => {
  try {
    if (argv.force) {
      d(`Fetch forced`);
      await fetchPredictorBinaries();
    } else {
      await fetchPredictorBinariesIfChanged();
    }
  } catch (e) {
    d(e);
    d('Download and install failed - nothing changed');
  }
})();
