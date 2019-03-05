/* @flow */

import sortObject from '../sortObject';

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

const susceptibilityTransformer = (
  susceptibilityModel: any,
  genotypeModel: string = 'median_depth'
) => {
  let o;
  let key;
  let value;
  let isInducible;

  const transformed = {
    susceptible: [],
    resistant: [],
    inconclusive: [],
    inducible: [],
    evidence: {},
    susceptibility: {},
  };

  for (key in susceptibilityModel) {
    let susceptibility: {
      susceptible: boolean,
      resistant: boolean,
      inconclusive: boolean,
      inducible: boolean,
      mutation?: string,
    } = {
      susceptible: false,
      resistant: false,
      inconclusive: false,
      inducible: false,
    };
    let predict =
      susceptibilityModel[key]['predict'] ||
      susceptibilityModel[key]['prediction'];
    predict = predict.toUpperCase();
    value = predict.substr(0, 1);
    isInducible = predict.indexOf('INDUCIBLE') !== -1;
    if (value === 'S') {
      transformed.susceptible.push(key);
      susceptibility.susceptible = true;
    } else if (value === 'R') {
      transformed.resistant.push(key);
      susceptibility.resistant = true;
    } else if (value === 'N') {
      transformed.inconclusive.push(key);
      susceptibility.inconclusive = true;
    }
    if (isInducible) {
      transformed.inducible.push(key);
      susceptibility.inducible = true;
    }

    const calledBy =
      susceptibilityModel[key]['called_by'] ||
      susceptibilityModel[key]['calledBy'];
    if (calledBy) {
      for (let calledByKey in calledBy) {
        // group by title
        o = [];
        if (transformed.evidence[key]) {
          o = transformed.evidence[key];
        } else {
          // initialise
          transformed.evidence[key] = o;
        }
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
        o.push(elements);
      }
    }
    transformed.susceptibility[key] = susceptibility;
  }
  transformed.susceptibility = sortObject(transformed.susceptibility);
  transformed.evidence = sortObject(transformed.evidence);
  return transformed;
};

export default susceptibilityTransformer;
