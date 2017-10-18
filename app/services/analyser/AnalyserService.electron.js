/* @flow */

import AnalyserLocalFile from './AnalyserLocalFile';
import MykrobeConfig from '../MykrobeConfig';

import AnalyserSimulateLocalFile from './AnalyserSimulateLocalFile';

let instance = null;

class AnalyserService {
  config: MykrobeConfig;

  constructor(config: MykrobeConfig = new MykrobeConfig()) {
    this.config = config;
    if (!instance) {
      instance = this;
    }
    return instance;
  }

  analyseFile(file: File) {
    if (process.env.NODE_ENV === 'development') {
      return new AnalyserSimulateLocalFile(this.config).analyseFile(file);
    } else {
      return new AnalyserLocalFile(this.config).analyseFile(file);
    }
  }
}

export default AnalyserService;
