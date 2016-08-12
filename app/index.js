import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
import './app.global.css';
import log from 'electron-log';

const platform = require('os').platform();
log.info('platform', platform);

log.info('process.cwd():', process.cwd());

const app = require('electron').remote.app;
var basepath = app.getAppPath();
log.info('basepath:', basepath);


const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);


render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);

let targetName = require('../package.json').targetName,
  MykrobeTarget = MykrobeTarget || {},
  kTargetTypePredictor = 0,
  kTargetSpeciesSAureus = 0,
  kTargetSpeciesTB = 1;

MykrobeTarget.targetName = targetName;

if (targetName === 'predictor-s-aureus') {
  MykrobeTarget.type = kTargetTypePredictor;
  MykrobeTarget.species = kTargetSpeciesSAureus;
}
else if (targetName === 'predictor-tb') {
  MykrobeTarget.type = kTargetTypePredictor;
  MykrobeTarget.species = kTargetSpeciesTB;
}
else {
	// default;
  MykrobeTarget.type = kTargetTypePredictor;
  MykrobeTarget.species = kTargetSpeciesSAureus;
}

const pathToBin = _pathToBin();

log.info('pathToBin', pathToBin);

const spawn = require('child_process').spawn;

const child = spawn(pathToBin);
child.stdout.on('data', (data) => {
  const dataString = data.toString('utf8');
  log.info(dataString);
  // console.log('data', data);
});
child.stderr.on('data', function (data) {
  const dataString = data.toString('utf8');
  log.error('ERROR', dataString);
});

function _pathToBin() {
  let that = this,
    path = require('path'),
    platform = require('os').platform(),
    platformFolder = '',
    chmodSync = require('fs').chmodSync,
    pathToBin = '';

    // will be 'darwin', 'win64' or 'win64'
    // FIXME: not tested for Linux
  platformFolder = platform;

  switch (platform) {
    case 'darwin':
            // use 'osx' folder for Mac
      platformFolder = 'osx';
      break;
  }
  const app = require('electron').remote.app;

  const root = (process.env.NODE_ENV === 'development') ? process.cwd() : app.getAppPath();
  log.info('root', root);

  if (kTargetSpeciesTB === MykrobeTarget.species) {
    pathToBin = path.join(root, 'app', 'bin', MykrobeTarget.targetName, platformFolder, 'Mykrobe.predictor.tb');
  }
  else {
    pathToBin = path.join(root, 'app', 'bin', MykrobeTarget.targetName, platformFolder, 'Mykrobe.predictor.staph');
  }
  log.info('pathToBin', pathToBin);


  chmodSync(pathToBin, 755);
  return pathToBin;
}
