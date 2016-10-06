import MykrobeLocalFileAnalyser from './MykrobeLocalFileAnalyser';
import MykrobeConfig from './MykrobeConfig';

class MykrobeService {
  constructor(config = new MykrobeConfig()) {
    this.config = config;
  }

  analyseFile(file) {
    return new MykrobeLocalFileAnalyser(this.config).analyseFile(file);
  }
}

export default MykrobeService;
