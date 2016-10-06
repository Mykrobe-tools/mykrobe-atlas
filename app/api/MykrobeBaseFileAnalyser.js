import { EventEmitter } from 'events';
import * as TargetConstants from 'constants/TargetConstants';
import MykrobeJsonTransformer from './MykrobeJsonTransformer';

class MykrobeBaseFileAnalyser extends EventEmitter {
  constructor(targetConfig) {
    super();
    this.targetConfig = targetConfig;
  }

  extensionForFileName(fileName) {
    const extension = fileName.substr(fileName.lastIndexOf('.'));
    return extension.toLowerCase();
  }

  analyseFile(file) {
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

  failWithError(err) {
    setTimeout(() => {
      this.emit('error', {
        description: `Processing failed with error: ${err}`
      });
    }, 0);
  }

  doneWithJsonString(jsonString) {
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

  analyseJsonFile(file) {
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

  analyseBinaryFile(file) {
    console.log('analyseBinaryFile', file);
  }

  cancel() {
  }
}

export default MykrobeBaseFileAnalyser;
