/* @flow */

import * as TargetConstants from '../constants/TargetConstants';

class MykrobeConfig {
  targetName: string
  type: string
  species: string

  constructor() {
    this.targetName = require('../../package.json').targetName;

    if (this.targetName === 'predictor-s-aureus') {
      this.type = TargetConstants.TYPE_PREDICTOR;
      this.species = TargetConstants.SPECIES_S_AUREUS;
    }
    else if (this.targetName === 'predictor-tb') {
      this.type = TargetConstants.TYPE_PREDICTOR;
      this.species = TargetConstants.SPECIES_TB;
    }
    else if (this.targetName === 'atlas-tb') {
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
