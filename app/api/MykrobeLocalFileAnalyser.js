import { EventEmitter } from 'events';
import path from 'path';
import { chmodSync } from 'fs';
import * as TargetConstants from '../constants/TargetConstants';


const app = require('electron').remote.app;

class MykrobeLocalFileAnalyser extends EventEmitter {
  constructor(targetConfig) {
    super();
    this.targetConfig = targetConfig;
    app.on('quit', () => {
      this.cancel();
      console.log('ev:app quit');
    });
  }

  analyseFileWithPath(filePath) {
    this.cancel();

    const spawn = require('child_process').spawn; // eslint-disable-line global-require

    console.log('analyseFileWithPath', filePath);

    this.jsonBuffer = '';
    this.isBufferingJson = false;
    this.processExited = false;

    const dirToBin = this.dirToBin();
    const pathToBin = this.pathToBin();
    const args = ['--file', filePath, '--install_dir', dirToBin, '--format', 'JSON', '--progress'];
    this.child = spawn(pathToBin, args);

    this.child.stdout.on('data', (data) => {
      if (this.didReceiveError) {
        return;
      }
      const dataString = data.toString('utf8');
      console.log(dataString);
      if (0 === dataString.indexOf('Progress')) {
        // console.log('progress');
        // we get a string like "Progress 1000000/1660554"
        // extract groups of digits
        const digitGroups = dataString.match(/\d+/g);
        if (digitGroups.length > 1) {
          const progress = parseInt(digitGroups[0]);
          const total = parseInt(digitGroups[1]);
          // console.log('progress:'+progress);
          // console.log('total:'+total);
          this.emit('progress', {
            progress,
            total
          });
        }
      }

      if (this.isBufferingJson) {
        this.jsonBuffer += dataString;
      }
      else if (dataString.indexOf('{') !== -1) {
        // start collecting as soon as we see { in the buffer
        this.isBufferingJson = true;
        this.jsonBuffer = dataString;
      }

      // sometimes receive json after process has exited
      if (this.isBufferingJson && this.processExited) {
        if (this.jsonBuffer.length) {
          this.emit('done', this.jsonBuffer);
        }
      }
    });

    this.child.stderr.on('data', (data) => {
      this.didReceiveError = true;
      console.log('ERROR: ' + data);
      // deferring seems to allow the spawn to exit cleanly
      setTimeout(() => {
        this.emit('error', {
          description: `Processing failed with error: ${data}`
        });
      }, 0);
      // this.cancelLoadFile();
    });

    this.child.on('exit', (code) => {
      console.log('Processing exited with code: ' + code);
      // this.child = null;
      // deferring seems to allow the spawn to exit cleanly
      if (0 === code) {
        if (this.jsonBuffer.length) {
          setTimeout(() => {
            this.emit('done', this.jsonBuffer);
          }, 0);
        }
      }
      this.processExited = true;
    });

    return this;
  }

  cancel() {
    if (this.child) {
      this.child.kill();
      this.child = null;
    }
    return this;
  }

  dirToBin() {
    // path into the app folder
    const root = (process.env.NODE_ENV === 'development') ? process.cwd() : app.getAppPath();

    const dirToBin = path.join(root, 'app', 'bin', this.targetConfig.targetName);
    console.log('dirToBin', dirToBin);

    return dirToBin;
  }

  pathToBin() {
    // will be 'darwin', 'win64' or 'win64'
    const platform = require('os').platform(); // eslint-disable-line global-require
    // FIXME: not tested for Linux
    let platformFolder = platform;

    // use 'osx' folder for Mac
    if ('darwin' === platform) {
      platformFolder = 'osx';
    }

    const dirToBin = this.dirToBin();

    let pathToBin = '';

    if (TargetConstants.SPECIES_TB === this.targetConfig.species) {
      pathToBin = path.join(dirToBin, platformFolder, 'Mykrobe.predictor.tb');
    }
    else {
      pathToBin = path.join(dirToBin, platformFolder, 'Mykrobe.predictor.staph');
    }
    console.log('pathToBin', pathToBin);

    // chmodSync(pathToBin, 755);
    return pathToBin;
  }
}

export default MykrobeLocalFileAnalyser;
