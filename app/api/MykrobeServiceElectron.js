/* @flow */

import MykrobeLocalFileAnalyser from './MykrobeLocalFileAnalyser';
import MykrobeConfig from './MykrobeConfig';

class MykrobeService {
  config: MykrobeConfig

  constructor(config: MykrobeConfig = new MykrobeConfig()) {
    this.config = config;
  }

  analyseFile(file: File) {
    return new MykrobeLocalFileAnalyser(this.config).analyseFile(file);
  }
}

export default MykrobeService;
