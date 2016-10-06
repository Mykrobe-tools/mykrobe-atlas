import MykrobeWebFileAnalyser from './MykrobeWebFileAnalyser';
import MykrobeConfig from './MykrobeConfig';

class MykrobeService {
  constructor(config = new MykrobeConfig()) {
    this.config = config;
  }

  analyseFile(file) {
    return new MykrobeWebFileAnalyser(this.config).analyseFile(file);
  }
}

export default MykrobeService;
