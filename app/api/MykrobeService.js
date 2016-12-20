/* @flow */

import MykrobeBaseFileAnalyser from './MykrobeBaseFileAnalyser';
import MykrobeWebFileAnalyser from './MykrobeWebFileAnalyser';
import MykrobeConfig from './MykrobeConfig';

class MykrobeService {
  config: MykrobeConfig

  constructor(config: MykrobeConfig = new MykrobeConfig()) {
    this.config = config;
  }

  analyseFile(file: File): MykrobeBaseFileAnalyser {
    return new MykrobeWebFileAnalyser(this.config).analyseFile(file);
  }
}

export default MykrobeService;
