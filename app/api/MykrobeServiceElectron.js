/* @flow */

import MykrobeLocalFileAnalyser from './MykrobeLocalFileAnalyser';
import MykrobeConfig from './MykrobeConfig';

let instance = null;

class MykrobeService {
  config: MykrobeConfig;

  constructor(config: MykrobeConfig = new MykrobeConfig()) {
    this.config = config;
    if (!instance) {
      instance = this;
    }
    return instance;
  }

  analyseFile(file: File) {
    return new MykrobeLocalFileAnalyser(this.config).analyseFile(file);
  }
}

export default MykrobeService;
