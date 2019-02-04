/* @flow */

import EventEmitter from 'events';
import path from 'path';
import { spawn } from 'child_process';
import readline from 'readline';
import log from 'electron-log';
import fs from 'fs-extra';

import { isString } from 'makeandship-js-common/src/util/is';

import AnalyserJsonTransformer from '../../experiments/util/AnalyserJsonTransformer';
import * as APIConstants from '../../../constants/APIConstants';

import {
  rootDir,
  pathToBin,
  pathToMccortex,
  validateTarget,
} from './pathToBin';
import extensionForFileName from './extensionForFileName';

const DEBUG =
  process.env.DEBUG_PRODUCTION === '1' ||
  process.env.NODE_ENV === 'development';

const tmp = require('tmp');
const app = require('electron').remote.app;

// TODO - refactor into action-based Saga

class AnalyserLocalFile extends EventEmitter {
  jsonBuffer: string;
  isBufferingJson: boolean;
  processExited: boolean;
  child: child_process$ChildProcess; // eslint-disable-line camelcase
  didReceiveError: boolean;
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
      if (filePath.indexOf(' ') > 0) {
        this.failWithError(
          'Mykrobe does not currently work with files or paths containing spaces'
        );
        return this;
      }
    }
    return this.analyseBinaryFile(filePaths, id);
  }

  failWithError(err: string | Error) {
    this.cancel();
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
      .then(result => {
        // const { json, transformed } = result;
        // console.log('json', json);
        // console.log('transformed', transformed);
        this.emit('done', result);
      })
      .catch(err => {
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

  analyseJsonFile(file: File | string): AnalyserLocalFile {
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
    validateTarget();

    this.tmpObj = tmp.dirSync({ prefix: 'mykrobe-' });
    const skeletonDir = path.join(this.tmpObj.name, 'skeleton');

    const fileName = path.parse(filePaths[0]).name;

    this.jsonBuffer = '';
    this.isBufferingJson = false;
    this.processExited = false;

    const pathToBinValue = pathToBin();
    const pathToMccortexValue = pathToMccortex();

    // FIXME: if we don't use --force, occasionally get error - some files cached??

    const args = [
      'predict',
      '--force',
      fileName,
      'tb',
      filePaths.length > 1 ? '--seq' : '-1',
      ...filePaths,
      '--skeleton_dir',
      skeletonDir,
      '--mccortex31_path',
      pathToMccortexValue,
      '--format',
      'json',
      '--guess_sequence_method',
      '--quiet',
    ];

    log.info('Guess at command line:', pathToBinValue, args.join(' '));
    log.info('Spawning executable at path:', pathToBinValue);
    log.info('With arguments:', args);
    this.child = spawn(pathToBinValue, args);

    if (!this.child) {
      this.failWithError('Failed to start child process');
      return this;
    }

    this.child.on('error', err => {
      log.error('Failed to start child process.', err);
      this.failWithError(err);
    });

    if (DEBUG) {
      const tmpDir = tmp.dirSync({ prefix: 'mykrobe-debug-' }).name;
      const cmdPath = path.join(tmpDir, 'AnalyserLocalFile.cmd.txt');
      log.info('Logging command to', cmdPath);
      fs.writeFileSync(cmdPath, `${pathToBinValue} ${args.join(' ')}`);
      const stdoutPath = path.join(tmpDir, 'AnalyserLocalFile.stdout.txt');
      const stderrPath = path.join(tmpDir, 'AnalyserLocalFile.stderr.txt');
      log.info('Logging stdout and stderr to', stdoutPath, stderrPath);
      const stdoutStream = fs.createWriteStream(stdoutPath);
      const stderrStream = fs.createWriteStream(stderrPath);
      this.child.stdout.pipe(stdoutStream);
      this.child.stderr.pipe(stderrStream);
    }

    readline
      .createInterface({
        input: this.child.stdout,
      })
      .on('line', line => {
        if (this.didReceiveError) {
          return;
        }
        if (!this.isBufferingJson) {
          log.info(line);
        } else {
          log.info('Received json, muted');
        }
        if (line.indexOf('Progress:') >= 0) {
          log.info('progress');
          // we get a string like "[15 Oct 2017 16:19:47-Kac] Progress: 130,000/454,797"
          // extract groups of digits
          const trimmed = line.substr(line.indexOf('Progress:'));
          const digitGroups = trimmed.replace(/,/g, '').match(/\d+/g);
          if (digitGroups.length > 1) {
            const progress = parseInt(digitGroups[0]);
            const total = parseInt(digitGroups[1]);
            log.info('progress:' + progress);
            log.info('total:' + total);
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
            log.info('done');
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
          log.warn('IGNORING ERROR: ' + line);
          return;
        }
        this.didReceiveError = true;
        log.error('ERROR: ' + line);
        this.failWithError(line);
      });

    this.child.on('exit', code => {
      log.info('Processing exited with code: ' + code);
      // this.child = null;
      // deferring seems to allow the spawn to exit cleanly
      if (code === 0) {
        if (this.jsonBuffer.length) {
          log.info('done');
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
    this.cleanup();
  }

  cleanup() {
    // this.tmpObj.removeCallback() doesn't always work
    this.tmpObj && fs.removeSync(this.tmpObj.name);
  }
}

export default AnalyserLocalFile;
