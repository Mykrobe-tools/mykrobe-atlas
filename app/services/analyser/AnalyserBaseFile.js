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

  analyseFile(file: File): AnalyserBaseFile {
    this.cancel();
    const extension = this.extensionForFileName(file.name);
    if (extension === '.json') {
      // return this.analyseJsonFile(file);
      return this.analyseBinaryFile(file);
    }
    else if (['.bam', '.gz', '.fastq'].indexOf(extension) !== -1) {
      return this.analyseBinaryFile(file);
    }
    else {
      this.failWithError(`Can only process files with extension: .json, .bam, .gz, .fastq - not ${extension}`);
      return this;
    }
  }

  failWithError(err: string) {
    setTimeout(() => {
      this.emit('error', {
        description: `Processing failed with error: ${err}`
      });
    }, 0);
  }

  doneWithJsonString(jsonString: string) {
    const transformer = new AnalyserJsonTransformer();
    transformer.transform(jsonString).then((result) => {
      const {json, transformed} = result;
      console.log('json', json);
      console.log('transformed', transformed);
      this.emit('done', result);
    })
    .catch((err) => {
      this.failWithError(err);
    });
  }

  analyseJsonFile(file: File): AnalyserBaseFile {
    const reader = new FileReader();

    reader.onload = (e) => {
      const dataString = reader.result;
      this.doneWithJsonString(dataString);
    };

    reader.onerror = (e) => {
      this.failWithError(`FileReader failed with error code ${e.target.error.code}`);
    };

    reader.readAsText(file);
    return this;
  }

  analyseBinaryFile(file: File): AnalyserBaseFile {
    console.log('analyseBinaryFile', file);
    return this;
  }

  analyseRemoteFile(file: File): AnalyserBaseFile {
    console.log('analyseRemoteFile', file);
    return this;
  }

  cancel(): void {
  }
}

export default AnalyserBaseFile;
