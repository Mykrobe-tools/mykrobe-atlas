/* @flow */

import path from 'path';
import fs from 'fs';
import os from 'os';
import { spawn } from 'child_process';
import readline from 'readline';

import * as TargetConstants from '../../../constants/TargetConstants';
import AnalyserBaseFile from './AnalyserBaseFile';

const tmp = require('tmp');
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

  constructor() {
    super();
    app &&
      app.on('quit', () => {
        this.cancel();
        console.log('ev:app quit');
      });
  }

  analyseJsonFile(file: File | string): AnalyserBaseFile {
    if (typeof file === 'string') {
      fs.readFile(file, (err, data) => {
        if (err) throw err;
        const dataString = data.toString();
        this.doneWithJsonString(dataString);
      });
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const dataString = reader.result;
        this.doneWithJsonString(dataString);
      };

      reader.onerror = e => {
        this.failWithError(
          `FileReader failed with error code ${e.target.error.code}`
        );
      };

      reader.readAsText(file);
    }
    return this;
  }

  analyseBinaryFile(filePaths: Array<string>): AnalyserLocalFile {
    this.tmpObj = tmp.dirSync();
    const skeletonDir = path.join(this.tmpObj.name, 'skeleton');

    const fileName = path.parse(filePaths[0]).name;

    this.jsonBuffer = '';
    this.isBufferingJson = false;
    this.processExited = false;

    const pathToBin = this.pathToBin();

    // FIXME: if we don't use --force, occasionally get error - some files cached??

    const args = [
      'predict',
      '--force',
      fileName,
      'tb',
      '-1',
      filePaths.length > 1 ? '--seq' : '',
      filePaths.join(' '),
      '--skeleton_dir',
      skeletonDir,
      '--format',
      'json',
      '--quiet',
    ];

    console.log('Guess at command line:', pathToBin, args.join(' '));
    console.log('Spawning executable at path:', pathToBin);
    console.log('With arguments:', args);
    this.child = spawn(pathToBin, args);

    if (!this.child) {
      this.failWithError('Failed to start child process');
      return this;
    }

    this.child.on('error', err => {
      console.log('Failed to start child process.', err);
      this.failWithError(err);
    });

    readline
      .createInterface({
        input: this.child.stdout,
      })
      .on('line', line => {
        if (this.didReceiveError) {
          return;
        }
        if (!this.isBufferingJson) {
          console.log(line);
        } else {
          console.log('Received json, muted');
        }
        if (line.indexOf('Progress:') >= 0) {
          console.log('progress');
          // we get a string like "[15 Oct 2017 16:19:47-Kac] Progress: 130,000/454,797"
          // extract groups of digits
          const trimmed = line.substr(line.indexOf('Progress:'));
          const digitGroups = trimmed.replace(/,/g, '').match(/\d+/g);
          if (digitGroups.length > 1) {
            const progress = parseInt(digitGroups[0]);
            const total = parseInt(digitGroups[1]);
            console.log('progress:' + progress);
            console.log('total:' + total);
            this.emit('progress', {
              progress,
              total,
            });
          }
        }

        if (this.isBufferingJson) {
          this.jsonBuffer += line;
        } else if (line.indexOf('{') !== -1) {
          // start collecting as soon as we see { in the buffer
          this.isBufferingJson = true;
          this.jsonBuffer = line;
        }

        // sometimes receive json after process has exited
        if (this.isBufferingJson && this.processExited) {
          if (this.jsonBuffer.length) {
            console.log('done');
            this.doneWithJsonString(this.jsonBuffer);
          }
        }
      });

    /*
    ingore errors like
    INFO:mykrobe.cmds.amr:Running AMR prediction with panels …
    [08 Jan 2019 12:20:42-wac] Saving graph to: …
    WARNING:mykrobe.cortex.mccortex:Not running mccortex…
    */

    readline
      .createInterface({
        input: this.child.stderr,
      })
      .on('line', line => {
        if (
          line.startsWith('INFO') ||
          line.startsWith('DEBUG') ||
          line.startsWith('WARNING') ||
          line.startsWith('[')
        ) {
          console.log('IGNORING ERROR: ' + line);
          return;
        }
        this.didReceiveError = true;
        console.log('ERROR: ' + line);
        this.failWithError(line);
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

  cancel() {
    if (this.child) {
      this.child.kill();
      delete this.child;
    }
    try {
      this.tmpObj && this.tmpObj.removeCallback();
    } catch (error) {
      // may fail if the temp directory is not empty
    }
  }

  dirToBin() {
    const rootDir =
      process.env.NODE_ENV === 'development' ? process.cwd() : app.getAppPath();
    console.log('rootDir', rootDir);

    let dirToBin = '';

    if (process.env.NODE_ENV === 'development') {
      dirToBin = path.join(
        rootDir,
        `desktop/resources/bin/${
          TargetConstants.TARGET_NAME
        }/${platform}-${arch}/bin`
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
      config: TargetConstants,
    });

    const dirToBin = this.dirToBin();

    let pathToBin = '';

    if (TargetConstants.SPECIES_TB === TargetConstants.SPECIES) {
      pathToBin = path.join(
        dirToBin,
        platform === 'win32' ? 'mykrobe_atlas.exe' : 'mykrobe_atlas'
      );
    } else {
      // unsupported configuration
      throw UnsupportedError;
    }

    console.log('pathToBin', pathToBin);

    return pathToBin;
  }
}

export default AnalyserLocalFile;
