/* @flow */

/* eslint-disable */

import path from 'path';
import fs from 'fs';
import os from 'os';
import { spawn } from 'child_process';
import * as TargetConstants from '../../constants/TargetConstants';
import AnalyserBaseFile from './AnalyserBaseFile';
import MykrobeConfig from '../MykrobeConfig';
const tmp = require('tmp');

// $FlowFixMe: Ignore Electron require
const app = require('electron').remote.app;
const platform = os.platform(); // eslint-disable-line global-require
const arch = os.arch();

class AnalyserLocalFile extends AnalyserBaseFile {
  jsonBuffer: string;
  isBufferingJson: boolean;
  processExited: boolean;
  child: child_process$ChildProcess; // eslint-disable-line camelcase
  didReceiveError: boolean;
  tmpObj: ?Object;

  constructor(targetConfig: MykrobeConfig) {
    super(targetConfig);
    app.on('quit', () => {
      this.cancel();
      console.log('ev:app quit');
    });
  }

  analyseBinaryFile(file: File): AnalyserLocalFile {
    // in Electron we get the full local file path
    // $FlowFixMe: Ignore missing type values
    const filePath = file.path;

    console.log('analyseBinaryFile', filePath);

    this.tmpObj = tmp.dirSync();
    const skeletonDir = path.join(this.tmpObj.name, 'skeleton');

    const fileName = path.parse(filePath).name;

    this.jsonBuffer = '';
    this.isBufferingJson = false;
    this.processExited = false;

    const pathToBin = this.pathToBin();
    const dirToBin = path.join(this.dirToBin(), this.targetConfig.targetName);
    const args = [
      'predict',
      '--force',
      `"${fileName}"`,
      'tb',
      '-1',
      `"${filePath}"`,
      '--skeleton_dir',
      `"${skeletonDir}"`,
    ];

    console.log('Spawning executable at path:', pathToBin);
    console.log('With arguments:', args);
    console.log('Guess at command line:', pathToBin, args.join(' '));
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
      if ( !this.isBufferingJson ) {
        console.log(dataString);
      }
      else {
        console.log('Received json, muted');
      }
      if (dataString.indexOf('Progress:') >= 0) {
        console.log('progress');
        // we get a string like "[15 Oct 2017 16:19:47-Kac] Progress: 130,000/454,797"
        // extract groups of digits
        const trimmed = dataString.substr(dataString.indexOf('Progress:'));
        const digitGroups = trimmed.replace(/,/g,'').match(/\d+/g);
        if (digitGroups.length > 1) {
          const progress = parseInt(digitGroups[0]);
          const total = parseInt(digitGroups[1]);
          console.log('progress:'+progress);
          console.log('total:'+total);
          this.emit('progress', {
            progress,
            total
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
          console.log('done');
          this.doneWithJsonString(this.jsonBuffer);
        }
      }
    });

    this.child.stderr.on('data', data => {
      const dataString = data.toString('utf8');
      if ( dataString.startsWith('DEBUG') || dataString.startsWith('INFO') ) {
        console.log('IGNORING ERROR: ' + dataString);
        return;
      }
      this.didReceiveError = true;
      console.log('ERROR: ' + dataString);
      this.failWithError(dataString);
    });

    this.child.on('exit', code => {
      console.log('Processing exited with code: ' + code);
      // this.child = null;
      // deferring seems to allow the spawn to exit cleanly
      if (code === 0) {
        if (this.jsonBuffer.length) {
          console.log('done');
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
    this.tmpObj && this.tmpObj.removeCallback();
  }

  dirToBin() {
    const rootDir =
      process.env.NODE_ENV === 'development' ? process.cwd() : app.getAppPath();
    console.log('rootDir', rootDir);

    let dirToBin = '';

    if (process.env.NODE_ENV === 'development') {
      dirToBin = path.join(
        rootDir,
        `electron/resources/bin/${this.targetConfig.targetName}/${platform}-${arch}/bin`
      );
    } else {
      dirToBin = path.join(rootDir, '../bin');
    }
    console.log('dirToBin', dirToBin);
    return dirToBin;
  }

  pathToBin() {
    const UnsupportedError = new Error({
      message: 'Unsupported configuration',
      config: this.targetConfig
    });

    const dirToBin = this.dirToBin();

    let pathToBin = '';

    if (TargetConstants.TYPE_PREDICTOR === this.targetConfig.type) {
      if (TargetConstants.SPECIES_TB === this.targetConfig.species) {
        pathToBin = path.join(
          dirToBin,
          platform === 'win32' ? 'mykrobe_predictor.exe' : 'mykrobe_predictor'
        );
      }
      else {
        // unsupported configuration
        throw UnsupportedError;
      }
    } else {
      // unsupported configuration
      throw UnsupportedError;
    }

    console.log('pathToBin', pathToBin);

    return pathToBin;
  }
}

export default AnalyserLocalFile;
