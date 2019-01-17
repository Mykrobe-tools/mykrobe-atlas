/* @flow */

import EventEmitter from 'events';

// TODO: we can remove the transformer - it is created on demand by a redux selector
import AnalyserJsonTransformer from '../../experiments/util/AnalyserJsonTransformer';
import * as APIConstants from '../../../constants/APIConstants';

class AnalyserBaseFile extends EventEmitter {
  extensionForFileName(fileName: string) {
    const extension = fileName.substr(fileName.lastIndexOf('.'));
    return extension.toLowerCase();
  }

  analyseFile(filePaths: Array<string>, id: string = ''): AnalyserBaseFile {
    this.cancel();
    for (let i = 0; i < filePaths.length; i++) {
      const filePath = filePaths[i];
      const extension = this.extensionForFileName(filePath);
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
          `Can only process files with extension: ${acceptable} - not ${extension}`
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

  analyseBinaryFile(filePaths: Array<string>): AnalyserBaseFile {
    console.log('analyseBinaryFile', filePaths);
    return this;
  }

  analyseRemoteFile(file: File | string): AnalyserBaseFile {
    console.log('analyseRemoteFile', file);
    return this;
  }

  cancel(): void {}
}

export default AnalyserBaseFile;
