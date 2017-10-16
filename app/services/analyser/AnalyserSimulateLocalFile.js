/* @flow */

/* eslint-disable */

import { spawn } from 'child_process';
import * as TargetConstants from '../../constants/TargetConstants';
import AnalyserBaseFile from './AnalyserBaseFile';
import MykrobeConfig from '../MykrobeConfig';

class AnalyserSimulateLocalFile extends AnalyserBaseFile {
  _progress = 0;

  incrementProgress = () => {
    this._progress += 10;
    this.emit('progress', {
      progress: this._progress,
      total: 100
    });
    if ( this._progress ===100 ) {
      this.sendResult();
    }
    else {
      setTimeout(this.incrementProgress, 500);
    }
  }

  sendResult = () => {
    const jsonString = require('./__mocks__/doneWithJsonString.json');
    this.doneWithJsonString(JSON.stringify(jsonString));
  }

  analyseBinaryFile(file: File): AnalyserSimulateLocalFile {
    this._progress = 0;
    setTimeout(this.incrementProgress, 2000);
    return this;
  }
}

export default AnalyserSimulateLocalFile;
