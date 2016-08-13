import MykrobeLocalFileAnalyser from './MykrobeLocalFileAnalyser';

class MykrobeService {
  constructor(config) {
    this.config = config;
  }

  analyseFileWithPath(path) {
    return new MykrobeLocalFileAnalyser(this.config).analyseFileWithPath(path);
  }
}

export default MykrobeService;
