/* @flow */

import sortObject from '../sortObject';
import { isPlainObject } from 'makeandship-js-common/src/utils/is';

/*

the "Resistant" allele N times is in [alternate][median_depth]
the "Susceptible" allele N times is in [reference][median_depth]

by default. This changes to:

[alternate][kmer_count]
and
[reference][kmer_count]

for another data type (which we now support but didn't previously).

*/

const USE_LEGACY_DESCRIPTION = false;

export const susceptibilityTypes = {
  UNKNOWN: 'UNKNOWN',
  SUSCEPTIBLE: 'SUSCEPTIBLE',
  RESISTANT: 'RESISTANT',
  INCONCLUSIVE: 'INCONCLUSIVE',
  INDUCIBLE: 'INDUCIBLE',
  NOT_TESTED: 'NOT_TESTED',
};

export const susceptibilityTypeTitles = {
  [susceptibilityTypes.UNKNOWN]: 'Unknown',
  [susceptibilityTypes.SUSCEPTIBLE]: 'Susceptible',
  [susceptibilityTypes.RESISTANT]: 'Resistant',
  [susceptibilityTypes.INCONCLUSIVE]: 'Inconclusive',
  [susceptibilityTypes.INDUCIBLE]: 'Inducible',
  [susceptibilityTypes.NOT_TESTED]: 'Not tested',
};

export type SusceptibilityType = $Keys<typeof susceptibilityTypes>;

const susceptibilityTransformer = (
  susceptibilityModel: any,
  genotypeModel: string = 'median_depth'
) => {
  let key;
  let value;
  let isInducible;

  const transformed = {
    susceptible: [],
    resistant: [],
    inconclusive: [],
    inducible: [],
    notTested: [],
    evidence: {},
    susceptibility: {},
  };

  for (key in susceptibilityModel) {
    let susceptibility: {
      type: SusceptibilityType,
      susceptible: boolean,
      resistant: boolean,
      inconclusive: boolean,
      inducible: boolean,
      notTested: boolean,
      mutation?: string,
      method?: string,
    } = {
      type: susceptibilityTypes.UNKNOWN,
      susceptible: false,
      resistant: false,
      inconclusive: false,
      inducible: false,
      notTested: false,
    };

    const susceptibilityModelEntry = susceptibilityModel[key];

    if (
      !isPlainObject(susceptibilityModelEntry) ||
      Object.keys(susceptibilityModelEntry).length === 0
    ) {
      // omit - no data or not an object
    } else if (
      susceptibilityModelEntry.susceptibility ||
      susceptibilityModelEntry.method
    ) {
      // metadata format
      if (susceptibilityModelEntry.susceptibility === 'Sensitive') {
        (susceptibility.type = susceptibilityTypes.SUSCEPTIBLE),
          transformed.susceptible.push(key);
        susceptibility.susceptible = true;
      } else if (susceptibilityModelEntry.susceptibility === 'Resistant') {
        (susceptibility.type = susceptibilityTypes.RESISTANT),
          transformed.resistant.push(key);
        susceptibility.resistant = true;
      } else if (susceptibilityModelEntry.susceptibility === 'Inconclusive') {
        (susceptibility.type = susceptibilityTypes.INCONCLUSIVE),
          transformed.inconclusive.push(key);
        susceptibility.inconclusive = true;
      } else if (susceptibilityModelEntry.susceptibility === 'Not tested') {
        (susceptibility.type = susceptibilityTypes.NOT_TESTED),
          transformed.notTested.push(key);
        susceptibility.notTested = true;
      }
      susceptibility.method = susceptibilityModelEntry.method;
    } else {
      // predictor format
      let predict =
        susceptibilityModelEntry['predict'] ||
        susceptibilityModelEntry['prediction'];
      predict = predict.toUpperCase();
      value = predict.substr(0, 1);
      isInducible = predict.indexOf('INDUCIBLE') !== -1;
      if (value === 'S') {
        (susceptibility.type = susceptibilityTypes.SUSCEPTIBLE),
          transformed.susceptible.push(key);
        susceptibility.susceptible = true;
      } else if (value === 'R') {
        (susceptibility.type = susceptibilityTypes.RESISTANT),
          transformed.resistant.push(key);
        susceptibility.resistant = true;
      } else if (value === 'N') {
        (susceptibility.type = susceptibilityTypes.INCONCLUSIVE),
          transformed.inconclusive.push(key);
        susceptibility.inconclusive = true;
      }
      if (isInducible) {
        transformed.inducible.push(key);
        susceptibility.inducible = true;
      }

      const calledBy =
        susceptibilityModelEntry['called_by'] ||
        susceptibilityModelEntry['calledBy'];
      if (calledBy) {
        for (let calledByKey in calledBy) {
          const genes = calledByKey.split('_');
          // if in format I491F-I491F, split and take just I491F
          if (genes[1].indexOf('-') > 0) {
            genes[1] = genes[1].split('-')[0];
          }
          const info = calledBy[calledByKey]['info'];
          const alternate = info['coverage']['alternate'];
          const reference = info['coverage']['reference'];

          susceptibility.mutation = `${genes[0]} (${genes[1]})`;

          let elements = [
            `Resistance mutation found: ${genes[1]} in gene ${genes[0]}`,
          ];
          if (USE_LEGACY_DESCRIPTION) {
            if (genotypeModel === 'median_depth') {
              elements = [
                ...elements,
                `Resistant allele coverage: ${alternate[genotypeModel]}`,
                `Susceptible allele coverage: ${reference[genotypeModel]}`,
              ];
            } else {
              elements = [
                ...elements,
                `${alternate[genotypeModel]} kmers from the resistant allele`,
                `${reference[genotypeModel]} kmers from the susceptible allele`,
              ];
            }
          } else {
            elements = [
              ...elements,
              `Depth ${alternate['median_depth']} on the resistant allele`,
              `Depth ${reference['median_depth']} on the susceptible allele`,
            ];
          }
          // group by title
          if (!transformed.evidence[key]) {
            // initialise
            transformed.evidence[key] = [];
          }
          transformed.evidence[key].push(elements);
        }
      }
    }

    transformed.susceptibility[key] = susceptibility;
  }
  transformed.susceptibility = sortObject(transformed.susceptibility);
  transformed.evidence = sortObject(transformed.evidence);
  return transformed;
};

export default susceptibilityTransformer;
