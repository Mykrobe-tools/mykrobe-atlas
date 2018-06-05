/* @flow */

import * as TargetConstants from '../constants/TargetConstants';

class MykrobeConfig {
  targetName: string;
  species: string;

  constructor() {
    this.targetName = require('../../package.json').targetName;

    // at the current time only TB is actively implemented
    // throw an error for any other version

    if (this.targetName === 'atlas-tb') {
      this.species = TargetConstants.SPECIES_TB;
    } else if (this.targetName === 'atlas-s-aureus') {
      this.species = TargetConstants.SPECIES_S_AUREUS;
    } else {
      // target not recognised
      throw new Error(`Unsupported target name '${this.targetName}'`);
    }
  }
}
export default MykrobeConfig;
