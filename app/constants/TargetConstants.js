/* @flow */

export const TYPE_WEB = 'TYPE_WEB';
export const TYPE_DESKTOP = 'TYPE_DESKTOP';
export const SPECIES_S_AUREUS = 'SPECIES_S_AUREUS';
export const SPECIES_TB = 'SPECIES_TB';

export const TARGET_NAME = require('../../package.json').targetName;

let species;

if (TARGET_NAME === 'atlas-tb' || TARGET_NAME === 'desktop') {
  species = SPECIES_TB;
} else if (TARGET_NAME === 'atlas-s-aureus') {
  species = SPECIES_S_AUREUS;
} else {
  // target not recognised
  throw new Error(`Unsupported target name '${TARGET_NAME}'`);
}

export const SPECIES = species;
