/* @flow */

import * as TargetConstants from '../../../../constants/TargetConstants';

const speciesTransformer = (
  sourceModel: Object
): {
  lineage: Array<string>,
  species: Array<string>,
  speciesAndLineageString: string,
  speciesString: string,
  lineageString: string,
} => {
  const species = Object.keys(sourceModel.phylogenetics.species);

  let lineage = [];
  if (TargetConstants.SPECIES_TB === TargetConstants.SPECIES) {
    lineage = Object.keys(sourceModel.phylogenetics.lineage);
  }

  let speciesAndLineageString = '';

  const speciesString =
    species && species.length
      ? species.join(' / ').replace(/_/g, ' ')
      : 'undefined';

  const lineageString =
    lineage && lineage.length ? lineage.join(' / ').replace(/_/g, ' ') : '';

  if (TargetConstants.SPECIES_TB === TargetConstants.SPECIES) {
    const lineageSuffix = lineageString ? ` (lineage: ${lineageString})` : '';
    speciesAndLineageString = `${speciesString}${lineageSuffix}`;
  } else {
    speciesAndLineageString = speciesString;
  }

  return {
    lineage,
    species,
    speciesAndLineageString,
    speciesString,
    lineageString,
  };
};

export default speciesTransformer;
