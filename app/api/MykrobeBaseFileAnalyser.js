/* @flow */

import EventEmitter from 'events';
import MykrobeJsonTransformer from './MykrobeJsonTransformer';
import MykrobeConfig from './MykrobeConfig';

class MykrobeBaseFileAnalyser extends EventEmitter {
  targetConfig: MykrobeConfig;

  constructor(targetConfig: MykrobeConfig) {
    super();
    this.targetConfig = targetConfig;
  }

  extensionForFileName(fileName: string) {
    const extension = fileName.substr(fileName.lastIndexOf('.'));
    return extension.toLowerCase();
  }

  analyseFile(file: File): MykrobeBaseFileAnalyser {
    this.cancel();
    const extension = this.extensionForFileName(file.name);
    if ('.json' === extension) {
      return this.analyseJsonFile(file);
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
    const transformer = new MykrobeJsonTransformer();
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

  analyseJsonFile(file: File): MykrobeBaseFileAnalyser {
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

  analyseBinaryFile(file: File): MykrobeBaseFileAnalyser {
    console.log('analyseBinaryFile', file);
    return this;
  }

  cancel(): void {
  }
}

export default MykrobeBaseFileAnalyser;
