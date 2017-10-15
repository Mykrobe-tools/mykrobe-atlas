/* @flow */

/* eslint-disable */

import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import * as TargetConstants from '../../constants/TargetConstants';
import AnalyserBaseFile from './AnalyserBaseFile';
import MykrobeConfig from '../MykrobeConfig';

// $FlowFixMe: Ignore Electron require
const app = require('electron').remote.app;

class AnalyserLocalFile extends AnalyserBaseFile {
  jsonBuffer: string;
  isBufferingJson: boolean;
  processExited: boolean;
  child: child_process$ChildProcess; // eslint-disable-line camelcase
  didReceiveError: boolean;

  constructor(targetConfig: MykrobeConfig) {
    super(targetConfig);
    app.on('quit', () => {
      this.cancel();
      console.log('ev:app quit');
    });
  }

  removeSkeletonFiles() {
    const dirToBin = this.dirToBin();
    const filesToDelete = [
      'predictor-tb/data/skeleton_binary/tb/skeleton.k15.ctx',
      'predictor-s-aureus/data/skeleton_binary/staph/skeleton.k15.ctx',
    ];
    filesToDelete.forEach(filePath => {
      const fullPath = path.join(dirToBin, filePath);
      fs.stat(fullPath, (statErr, stat) => {
        if (statErr === null) {
          console.log('Skeleton file exists, removing.');
          fs.unlink(fullPath, unlinkErr => {
            if (unlinkErr) {
              console.log('error deleting', unlinkErr);
            } else {
              console.log('deleted', fullPath);
            }
          });
        } else {
          console.log('This file does not exist', fullPath);
        }
      });
    });
    return this;
  }

  analyseBinaryFile(file: File): AnalyserLocalFile {
    // in Electron we get the full local file path
    // $FlowFixMe: Ignore missing type values
    const filePath = file.path;

    this.removeSkeletonFiles();

    console.log('analyseBinaryFile', filePath);

    this.jsonBuffer = '';
    this.isBufferingJson = false;
    this.processExited = false;

    const pathToBin = this.pathToBin();
    const dirToBin = path.join(this.dirToBin(), this.targetConfig.targetName);
    const args = [
      '--file',
      filePath,
      '--install_dir',
      dirToBin,
      '--format',
      'JSON',
      '--progress',
    ];
    this.child = spawn(pathToBin, args);
    if (!this.child) {
      this.failWithError('Failed to start child process');
      return this;
    }

    this.child.on('error', err => {
      console.log('Failed to start child process.', err);
      this.failWithError(err);
    });

    this.child.stdout.on('data', data => {
      if (this.didReceiveError) {
        return;
      }
      const dataString = data.toString('utf8');
      console.log(dataString);
      if (dataString.indexOf('Progress') === 0) {
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
            total,
          });
        }
      }

      if (this.isBufferingJson) {
        this.jsonBuffer += dataString;
      } else if (dataString.indexOf('{') !== -1) {
        // start collecting as soon as we see { in the buffer
        this.isBufferingJson = true;
        this.jsonBuffer = dataString;
      }

      // sometimes receive json after process has exited
      if (this.isBufferingJson && this.processExited) {
        if (this.jsonBuffer.length) {
          console.log('done', this.jsonBuffer);
          this.doneWithJsonString(this.jsonBuffer);
        }
      }
    });

    this.child.stderr.on('data', data => {
      this.didReceiveError = true;
      console.log('ERROR: ' + data);
      this.failWithError(data);
    });

    this.child.on('exit', code => {
      console.log('Processing exited with code: ' + code);
      // this.child = null;
      // deferring seems to allow the spawn to exit cleanly
      if (code === 0) {
        if (this.jsonBuffer.length) {
          console.log('done', this.jsonBuffer);
          this.doneWithJsonString(this.jsonBuffer);
        }
      }
      this.processExited = true;
    });

    return this;
  }

  cancel(): void {
    if (this.child) {
      this.child.kill();
      delete this.child;
    }
  }

  dirToBin() {
    const rootDir =
      process.env.NODE_ENV === 'development' ? process.cwd() : app.getAppPath();
    console.log('rootDir', rootDir);

    let dirToBin = '';
    if (process.env.NODE_ENV === 'development') {
      dirToBin = path.join(rootDir, 'static', 'bin');
    } else {
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
    if (platform === 'darwin') {
      platformFolder = 'osx';
    }

    const UnsupportedError = new Error({
      message: 'Unsupported configuration',
      config: this.targetConfig,
    });

    const dirToBin = this.dirToBin();

    let pathToBin = '';

    if (TargetConstants.TYPE_PREDICTOR === this.targetConfig.type) {
      if (TargetConstants.SPECIES_TB === this.targetConfig.species) {
        pathToBin = path.join(
          dirToBin,
          this.targetConfig.targetName,
          platformFolder,
          'Mykrobe.predictor.tb'
        );
      } else if (TargetConstants.SPECIES_TB === this.targetConfig.species) {
        pathToBin = path.join(
          dirToBin,
          this.targetConfig.targetName,
          platformFolder,
          'Mykrobe.predictor.tb'
        );
      } else {
        // unsupported configuration
        throw UnsupportedError;
      }
    } else if (TargetConstants.TYPE_ATLAS === this.targetConfig.type) {
      if (TargetConstants.SPECIES_TB === this.targetConfig.species) {
        pathToBin = path.join(
          dirToBin,
          this.targetConfig.targetName,
          platformFolder,
          'Mykrobe.atlas.tb'
        );
      } else {
        // unsupported configuration
        throw UnsupportedError;
      }
    } else {
      // unsupported configuration
      throw UnsupportedError;
    }

    console.log('pathToBin', pathToBin);

    // chmodSync(pathToBin, 755);
    return pathToBin;
  }
}

export default AnalyserLocalFile;
