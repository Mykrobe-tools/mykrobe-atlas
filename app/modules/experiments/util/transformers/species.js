/* @flow */

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

  let lineage = sourceModel.phylogenetics.lineage.lineage;

  let speciesAndLineageString = '';

  const speciesString =
    species && species.length
      ? species.join(' / ').replace(/_/g, ' ')
      : 'undefined';

  const lineageString =
    lineage && lineage.length ? lineage.join(' / ').replace(/_/g, ' ') : '';

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
