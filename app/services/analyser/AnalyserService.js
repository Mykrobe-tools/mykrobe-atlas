/* @flow */

import AnalyserBaseFile from './AnalyserBaseFile';
import AnalyserWebFile from './AnalyserWebFile';
import MykrobeConfig from '../MykrobeConfig';

let instance = null;

class AnalyserService {
  config: MykrobeConfig;

  constructor(config: MykrobeConfig = new MykrobeConfig()) {
    if (!instance) {
      this.config = config;
      instance = this;
    }
    return instance;
  }

  analyseFile(file: File, id: string): AnalyserBaseFile {
    return new AnalyserWebFile(this.config).analyseFile(file, id);
  }

  analyseRemoteFile(file: Object): AnalyserBaseFile {
    return new AnalyserWebFile(this.config).analyseBinaryFile(file);
  }

  fetchExperiment(id: string) {
    return new AnalyserWebFile(this.config).fetchExperiment(id);
  }
}

export default AnalyserService;
