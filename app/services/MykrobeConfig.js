/* @flow */

import * as TargetConstants from '../constants/TargetConstants';

class MykrobeConfig {
  targetName: string;
  type: string;
  species: string;

  constructor() {
    this.targetName = require('../../package.json').targetName;

    // at the current time only TB is actively implemented
    // throw an error for any other version

    if (this.targetName === 'atlas-desktop-tb') {
      this.type = TargetConstants.TYPE_DESKTOP;
      this.species = TargetConstants.SPECIES_TB;
    } else if (this.targetName === 'atlas-tb') {
      this.type = TargetConstants.TYPE_WEB;
      this.species = TargetConstants.SPECIES_TB;
    } else {
      // target not recognised
      throw new Error(`Unsupported target name '${this.targetName}'`);
    }
  }

  isDesktop() {
    return this.type === TargetConstants.TYPE_DESKTOP;
  }

  isWeb() {
    return this.type === TargetConstants.TYPE_WEB;
  }
}
export default MykrobeConfig;
