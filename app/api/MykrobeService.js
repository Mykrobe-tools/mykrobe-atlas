import MykrobeWebFileAnalyser from './MykrobeWebFileAnalyser';
import MykrobeConfig from './MykrobeConfig';

class MykrobeService {
  constructor(config = new MykrobeConfig()) {
    this.config = config;
  }

  analyseFileWithPath(filePath) {
    return new MykrobeWebFileAnalyser(this.config).analyseFileWithPath(filePath);
  }
}

export default MykrobeService;
