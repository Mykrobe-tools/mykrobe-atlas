/* @flow */

import MykrobeBaseFileAnalyser from './MykrobeBaseFileAnalyser';
import MykrobeWebFileAnalyser from './MykrobeWebFileAnalyser';
import MykrobeConfig from './MykrobeConfig';
import MykrobeUploader from './MykrobeUploader';

let instance = null;

class MykrobeService {
  config: MykrobeConfig;
  uploader: MykrobeUploader;

  constructor(config: MykrobeConfig = new MykrobeConfig()) {
    if (!instance) {
      this.config = config;
      this.uploader = new MykrobeUploader();
      instance = this;
    }
    return instance;
  }

  analyseFile(file: File): MykrobeBaseFileAnalyser {
    return new MykrobeWebFileAnalyser(this.config).analyseFile(file);
  }

  analyseRemoteFile(file: Object): MykrobeBaseFileAnalyser {
    return new MykrobeWebFileAnalyser(this.config).analyseBinaryFile(file);
  }
}

export default MykrobeService;
