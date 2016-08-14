import { EventEmitter } from 'events';
import path from 'path';
import fs from 'fs';
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

  removeSkeletonFiles() {
    const dirToBin = this.dirToBin();

    var delete_skeleton_file_tb = path.join(dirToBin, 'predictor-tb/data/skeleton_binary/tb/skeleton.k15.ctx');
    console.log('CHECKING ' + delete_skeleton_file_tb);
    fs.stat(delete_skeleton_file_tb, function (err, stat) {
      if (err == null) {
        console.log('Skeleton file exists, removing.');

        fs.unlink(delete_skeleton_file_tb, function (err) {
          if (err) throw err;
          console.log('DELETE ' + delete_skeleton_file_tb);
        });

      } else {
        console.log('This file does not exist:\n\n' + delete_skeleton_file_tb);
      }
    });

    var delete_skeleton_file_staph = path.join(dirToBin, 'predictor-s-aureus/data/skeleton_binary/staph/skeleton.k15.ctx');
    console.log('CHECKING ' + delete_skeleton_file_staph);
    fs.stat(delete_skeleton_file_staph, function (err, stat) {
      if (err == null) {
        console.log('Skeleton file exists, removing.');

        fs.unlink(delete_skeleton_file_staph, function (err) {
          if (err) throw err;
          console.log('DELETE ' + delete_skeleton_file_staph);
        });

      } else {
        console.log('This file does not exist:\n\n' + delete_skeleton_file_staph);
      }
    });
    return this;
  }

  analyseFileWithPath(filePath) {
    this.cancel();
    this.removeSkeletonFiles();

    const spawn = require('child_process').spawn; // eslint-disable-line global-require

    console.log('analyseFileWithPath', filePath);

    this.jsonBuffer = '';
    this.isBufferingJson = false;
    this.processExited = false;

    const pathToBin = this.pathToBin();
    const dirToBin = path.join(this.dirToBin(), this.targetConfig.targetName);
    const args = ['--file', filePath, '--install_dir', dirToBin, '--format', 'JSON', '--progress'];
    this.child = spawn(pathToBin, args);

    this.child.on('error', (err) => {
      console.log('Failed to start child process.', err);
      this.emit('error', {
        description: `Failed to start child process with error: ${err}`
      });
    });

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
    const rootDir = (process.env.NODE_ENV === 'development') ? process.cwd() : app.getAppPath();
    console.log('rootDir', rootDir);

    var dirToBin = '';
    if (process.env.NODE_ENV === 'development') {
      dirToBin = path.join(rootDir, 'static', 'bin');
    }
    else {
      dirToBin = path.join(rootDir, 'bin');
    }
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
      pathToBin = path.join(dirToBin, this.targetConfig.targetName, platformFolder, 'Mykrobe.predictor.tb');
    }
    else {
      pathToBin = path.join(dirToBin, this.targetConfig.targetName, platformFolder, 'Mykrobe.predictor.staph');
    }
    console.log('pathToBin', pathToBin);

    // chmodSync(pathToBin, 755);
    return pathToBin;
  }
}

export default MykrobeLocalFileAnalyser;
