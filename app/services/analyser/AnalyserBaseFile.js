/* @flow */

import EventEmitter from 'events';
import AnalyserJsonTransformer from './AnalyserJsonTransformer';
import MykrobeConfig from '../MykrobeConfig';

class AnalyserBaseFile extends EventEmitter {
  targetConfig: MykrobeConfig;

  constructor(targetConfig: MykrobeConfig) {
    super();
    this.targetConfig = targetConfig;
  }

  extensionForFileName(fileName: string) {
    const extension = fileName.substr(fileName.lastIndexOf('.'));
    return extension.toLowerCase();
  }

  analyseFile(file: File | string, id: string = ''): AnalyserBaseFile {
    this.cancel();
    let filename;
    if (typeof file === 'string') {
      filename = file;
    } else {
      filename = file.name;
    }
    const extension = this.extensionForFileName(filename);
    if (extension === '.json') {
      return this.analyseJsonFile(file);
    } else if (['.bam', '.gz', '.fastq'].indexOf(extension) !== -1) {
      return this.analyseBinaryFile(file, id);
    } else {
      this.failWithError(
        `Can only process files with extension: .json, .bam, .gz, .fastq - not ${extension}`
      );
      return this;
    }
  }

  failWithError(err: string | Error) {
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
    // const fs = require('fs');
    // fs.writeFileSync('doneWithJsonString.json', jsonString);
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

  analyseJsonFile(file: File | string): AnalyserBaseFile {
    console.log('analyseJsonFile', file);
    return this;
  }

  analyseBinaryFile(file: File | string): AnalyserBaseFile {
    console.log('analyseBinaryFile', file);
    return this;
  }

  analyseRemoteFile(file: File | string): AnalyserBaseFile {
    console.log('analyseRemoteFile', file);
    return this;
  }

  cancel(): void {}
}

export default AnalyserBaseFile;
