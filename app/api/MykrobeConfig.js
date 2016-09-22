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
    else if ('atlas-tb' === this.targetName) {
      this.type = TargetConstants.TYPE_ATLAS;
      this.species = TargetConstants.SPECIES_TB;
    }
    else {
      // target not recognised
      throw new Error(`Unsupported target name '${this.targetName}'`);
    }
  }
}
export default MykrobeConfig;
