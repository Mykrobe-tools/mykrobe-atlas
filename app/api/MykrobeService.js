import MykrobeLocalFileAnalyser from './MykrobeLocalFileAnalyser';
import MykrobeConfig from './MykrobeConfig';

class MykrobeService {
  constructor(config = new MykrobeConfig()) {
    this.config = config;
  }

  analyseFileWithPath(filePath) {
    return new MykrobeLocalFileAnalyser(this.config).analyseFileWithPath(filePath);
  }
}

export default MykrobeService;
