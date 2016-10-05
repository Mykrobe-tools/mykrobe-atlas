import { EventEmitter } from 'events';
import * as TargetConstants from 'constants/TargetConstants';
import MykrobeJsonTransformer from './MykrobeJsonTransformer';

class MykrobeBaseFileAnalyser extends EventEmitter {
  constructor(targetConfig) {
    super();
    this.targetConfig = targetConfig;
  }

  extensionForPath(filePath) {
    const extension = filePath.substr(filePath.lastIndexOf('.'));
    return extension.toLowerCase();
  }

  analyseFileWithPath(filePath) {
    this.cancel();
    const extension = this.extensionForPath(filePath);
    if ('.json' === extension) {
      return this.analyseJsonFileWithPath(filePath);
    }
    else if (['.bam', '.gz', '.fastq'].indexOf(extension) !== -1) {
      return this.analyseBinaryFileWithPath(filePath);
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

  analyseJsonFileWithPath(filePath) {
    const reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (e) => {
      const dataString = e.target.result;
      this.doneWithJsonString(dataString);
    };

    reader.onerror = (e) => {
      this.failWithError(`FileReader failed with error code ${e.target.error.code}`);
    };

    reader.readAsText(filePath);
    return this;
  }

  analyseBinaryFileWithPath(filePath) {
    console.log('analyseBinaryFileWithPath', filePath);
  }

  cancel() {
  }
}

export default MykrobeBaseFileAnalyser;
