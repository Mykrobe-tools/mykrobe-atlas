import * as TargetConstants from 'constants/TargetConstants';
import MykrobeBaseFileAnalyser from './MykrobeBaseFileAnalyser';

class MykrobeWebFileAnalyser extends MykrobeBaseFileAnalyser {
  analyseBinaryFileWithPath(filePath) {
    console.log('analyseBinaryFileWithPath', filePath);
    console.error('TODO: upload file to API and report progress');
    return this;
  }

  cancel() {
    return this;
  }

}

export default MykrobeWebFileAnalyser;
