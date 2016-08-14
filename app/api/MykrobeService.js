import MykrobeLocalFileAnalyser from './MykrobeLocalFileAnalyser';
import MykrobeConfig from './MykrobeConfig';

class MykrobeService {
  constructor(config = new MykrobeConfig()) {
    this.config = config;
  }

  analyseFileWithPath(path) {
    return new MykrobeLocalFileAnalyser(this.config).analyseFileWithPath(path);
  }
}

export default MykrobeService;
