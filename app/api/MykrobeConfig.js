import * as TargetConstants from 'constants/TargetConstants';

class MykrobeConfig {
  constructor() {
    this.targetName = require('../../package.json').targetName;

    if ('predictor-s-aureus' === this.targetName) {
      this.type = TargetConstants.TYPE_PREDICTOR;
      this.species = TargetConstants.SPECIES_S_AUREUS;
    }
    else if ('predictor-tb' === this.targetName) {
      this.type = TargetConstants.TYPE_PREDICTOR;
      this.species = TargetConstants.SPECIES_TB;
    }
    else {
      // default;
      this.type = TargetConstants.TYPE_PREDICTOR;
      this.species = TargetConstants.SPECIES_S_AUREUS;
    }
  }
}
export default MykrobeConfig;
