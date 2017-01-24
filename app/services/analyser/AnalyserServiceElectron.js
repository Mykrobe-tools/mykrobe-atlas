/* @flow */

import AnalyserLocalFile from './AnalyserLocalFile';
import MykrobeConfig from '../MykrobeConfig';

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
    return new AnalyserLocalFile(this.config).analyseFile(file);
  }
}

export default AnalyserService;
