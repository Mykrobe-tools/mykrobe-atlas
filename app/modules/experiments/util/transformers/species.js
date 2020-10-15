/* @flow */

import { isArray } from 'makeandship-js-common/src/utils/is';

const speciesTransformer = (
  sourceModel: Object
): {
  lineage: Array<string>,
  species: Array<string>,
  speciesAndLineageString: string,
  speciesString: string,
  lineageString?: string,
} => {
  const species = Object.keys(sourceModel.phylogenetics.species);

  let lineage;
  if (isArray(sourceModel.phylogenetics.lineage?.lineage)) {
    // updated lineages in array format
    lineage = sourceModel.phylogenetics.lineage.lineage;
  } else {
    // legacy lineages in object / keys format
    lineage = Object.keys(sourceModel.phylogenetics.lineage);
  }

  let speciesAndLineageString = '';

  const speciesString =
    species && species.length
      ? species.join(' / ').replace(/_/g, ' ')
      : 'undefined';

  let lineageString;

  if (lineage) {
    if (lineage.length > 1) {
      lineageString = `mixed ${lineage.join(', ')}`;
    } else if (lineage.length === 1) {
      lineageString = lineage[0];
    }
  }

  const lineageSuffix = lineageString ? ` (${lineageString})` : '';
  speciesAndLineageString = `${speciesString}${lineageSuffix}`;

  return {
    lineage,
    species,
    speciesAndLineageString,
    speciesString,
    lineageString,
  };
};

export default speciesTransformer;
