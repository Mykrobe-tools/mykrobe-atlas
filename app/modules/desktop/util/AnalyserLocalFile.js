/* @flow */

import EventEmitter from 'events';
import path from 'path';
import { spawn } from 'child_process';
import readline from 'readline';
import fs from 'fs-extra';

import { isString } from 'makeandship-js-common/src/utils/is';

import AnalyserJsonTransformer from '../../experiments/util/AnalyserJsonTransformer';
import * as APIConstants from '../../../constants/APIConstants';

import { pathToBin } from './pathToBin';
import { extensionForFileName } from '../../../util';
import isAnalyserError from './isAnalyserError';

const DEBUG =
  process.env.DEBUG_PRODUCTION === '1' ||
  process.env.NODE_ENV === 'development';

const tmp = require('tmp');
const app = require('electron').remote.app;

class AnalyserLocalFile extends EventEmitter {
  jsonBuffer: string;
  isBufferingJson: boolean;
  processExited: boolean;
  child: child_process$ChildProcess;
  didReceiveError: boolean;
  readLineExited: boolean;
  tmpObj: ?Object;

  analyseFile(filePaths: Array<string>, id: string = ''): AnalyserLocalFile {
    this.cancel();
    for (let i = 0; i < filePaths.length; i++) {
      const filePath = filePaths[i];
      const extension = extensionForFileName(filePath);
      if (extension === '.json') {
        return this.analyseJsonFile(filePath);
      }
      if (
        !APIConstants.API_SAMPLE_EXTENSIONS_ARRAY_WITH_DOTS.includes(extension)
      ) {
        const acceptable = APIConstants.API_SAMPLE_EXTENSIONS_ARRAY_WITH_DOTS.join(
          ', '
        );
        this.failWithError(
          `Mykrobe can only process files with extension: ${acceptable} - not ${extension}`
        );
        return this;
      }
    }
    return this.analyseBinaryFile(filePaths, id);
  }

  failWithError(err: string | Error) {
    if (!DEBUG) {
      // fail immediately
      this.cancel();
    }
    let message = err;
    if (err.message) {
      message = err.message;
    }
    setTimeout(() => {
      this.emit('error', {
        description: message,
      });
    }, 0);
  }

  doneWithJsonString(jsonString: string) {
    this.cleanup();
    const transformer = new AnalyserJsonTransformer();
    transformer
      .transform(jsonString)
      .then((result) => {
        // const { json, transformed } = result;
        // console.log('json', json);
        // console.log('transformed', transformed);
        this.emit('done', result);
      })
      .catch((err) => {
        this.failWithError(err);
      });
  }

  constructor() {
    super();
    app &&
      app.on('quit', () => {
        this.cancel();
        console.log('ev:app quit');
      });
  }

  analyseJsonFile = (file: File | string): AnalyserLocalFile => {
    if (isString(file)) {
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

      reader.onerror = (e) => {
        this.failWithError(
          `FileReader failed with error code ${e.target.error.code}`
        );
      };

      reader.readAsText(file);
    }
    return this;
  };

  analyseBinaryFile = (filePaths: Array<string>): AnalyserLocalFile => {
    this.tmpObj = tmp.dirSync({ prefix: 'mykrobe-' });

    const skeletonDir = path.join(this.tmpObj.name, 'skeleton');
    const tmpDir = path.join(this.tmpObj.name, 'tmp');

    fs.ensureDirSync(skeletonDir);
    fs.ensureDirSync(tmpDir);

    // Sample name should not contain whitespace, replace with '-'
    let sampleName = path.parse(filePaths[0]).name;
    sampleName = sampleName.replace(/\s+/g, '-');

    const pathToBinValue = pathToBin();

    // FIXME: if we don't use --force, occasionally get error - some files cached??

    const args = [
      'predict',
      '--force',
      sampleName,
      'tb',
      filePaths.length > 1 ? '--seq' : '-1',
      ...filePaths,
      '--tmp',
      tmpDir,
      '--skeleton_dir',
      skeletonDir,
      '--format',
      'json',
      '--guess_sequence_method',
      '--quiet',
    ];

    console.log('Guess at command line:', pathToBinValue, args.join(' '));
    console.log('Spawning executable at path:', pathToBinValue);
    console.log('With arguments:', args);
    const child = spawn(pathToBinValue, args);
    this.setChildProcess(child);

    if (DEBUG) {
      const tmpDir = tmp.dirSync({ prefix: 'mykrobe-debug-' }).name;
      const cmdPath = path.join(tmpDir, 'AnalyserLocalFile.cmd.txt');
      console.log('Logging command to', cmdPath);
      fs.writeFileSync(cmdPath, `${pathToBinValue} ${args.join(' ')}`);
    }

    return this.monitorChildProcess();
  };

  setChildProcess = (child: child_process$ChildProcess) => {
    this.child = child;
    return this;
  };

  monitorChildProcess = () => {
    this.jsonBuffer = '';
    this.isBufferingJson = false;
    this.processExited = false;
    this.readLineExited = false;

    if (!this.child) {
      this.failWithError('Failed to start child process');
      return this;
    }

    this.child.on('error', (err) => {
      console.log('Failed to start child process.', err);
      this.failWithError(err);
    });

    if (DEBUG) {
      const tmpDir = tmp.dirSync({ prefix: 'mykrobe-debug-' }).name;
      const stdoutPath = path.join(tmpDir, 'AnalyserLocalFile.stdout.txt');
      const stderrPath = path.join(tmpDir, 'AnalyserLocalFile.stderr.txt');
      console.log('Logging stdout and stderr to', stdoutPath, stderrPath);
      const stdoutStream = fs.createWriteStream(stdoutPath);
      const stderrStream = fs.createWriteStream(stderrPath);
      this.child.stdout.pipe(stdoutStream);
      this.child.stderr.pipe(stderrStream);
    }

    readline
      .createInterface({
        input: this.child.stdout,
      })
      .on('line', (line) => {
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
          this.jsonBuffer = line.substr(line.indexOf('{'));
        }
      })
      .on('close', () => {
        console.log('readline stdin close');
        this.onReadLineExited();
      });

    readline
      .createInterface({
        input: this.child.stderr,
      })
      .on('line', (line) => {
        if (isAnalyserError(line)) {
          this.onReadLineError(line);
        } else {
          console.log('IGNORING ERROR: ' + line);
        }
      })
      .on('close', () => {
        console.log('readline stderr close');
      });

    this.child.on('exit', (code) => {
      console.log('Processing exited with code: ' + code);
      // 0 = exited normally, null = cancelled
      if (code === 0 || code === null) {
        this.onProcessExited();
      } else {
        this.failWithError(`Process exit unexpectedly with code ${code}`);
      }
    });

    return this;
  };

  onProcessExited = () => {
    this.processExited = true;
    this.checkDone();
  };

  onReadLineExited = () => {
    this.readLineExited = true;
    this.checkDone();
  };

  checkDone = () => {
    // wait until both readline and process have exited;
    // this can happen in different orders on different systems
    if (this.readLineExited && this.processExited && this.jsonBuffer.length) {
      this.doneWithJsonString(this.jsonBuffer);
    }
  };

  onReadLineError = (line: string) => {
    console.log('ERROR: ' + line);
    this.didReceiveError = true;
    this.failWithError(line);
  };

  cancel() {
    if (this.child) {
      this.child.kill();
      delete this.child;
    }
    this.cleanup();
  }

  cleanup() {
    console.log('cleanup');
    // this.tmpObj.removeCallback() doesn't always work
    this.tmpObj && fs.removeSync(this.tmpObj.name);
  }
}

export default AnalyserLocalFile;
