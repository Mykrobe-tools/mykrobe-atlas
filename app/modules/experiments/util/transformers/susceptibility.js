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
  };

  for (key in susceptibilityModel) {
    let predict =
      susceptibilityModel[key]['predict'] ||
      susceptibilityModel[key]['prediction'];
    predict = predict.toUpperCase();
    value = predict.substr(0, 1);
    isInducible = predict.indexOf('INDUCIBLE') !== -1;
    if (value === 'S') {
      transformed.susceptible.push(key);
    } else if (value === 'R') {
      transformed.resistant.push(key);
    } else if (value === 'N') {
      transformed.inconclusive.push(key);
    }
    if (isInducible) {
      transformed.inducible.push(key);
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

        if (genotypeModel === 'median_depth') {
          o.push([
            'Resistance mutation found: ' + genes[1] + ' in gene ' + genes[0],
            'Resistant allele coverage: ' + alternate[genotypeModel],
            'Susceptible allele coverage: ' + reference[genotypeModel],
          ]);
        } else {
          o.push([
            'Resistance mutation found: ' + genes[1] + ' in gene ' + genes[0],
            alternate[genotypeModel] + ' kmers from the resistant allele',
            reference[genotypeModel] + ' kmers from the susceptible allele',
          ]);
        }
      }
    }
  }
  transformed.evidence = sortObject(transformed.evidence);
  return transformed;
};

export default susceptibilityTransformer;
