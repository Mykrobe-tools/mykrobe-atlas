/* @flow */

import * as TargetConstants from '../../../constants/TargetConstants';
import _ from 'lodash';

export type AnalyserJsonTransformerResult = {
  lineage: Array<string>,
  species: Array<string>,
  speciesAndLineageString: string,
  hasSpecies: boolean,
  hasResistance: boolean,
  susceptible: Array<string>,
  resistant: Array<string>,
  inconclusive: Array<string>,
  positive: Array<string>,
  negative: Array<string>,
  inducible: Array<string>,
  evidence: any,
  drugsResistance: {
    mdr: boolean,
    xdr: boolean,
  },
  samples?: any,
  tree?: any,
};

class AnalyserJsonTransformer {
  transform(jsonString: string) {
    return this.stringToJson(jsonString);
  }

  stringToJson(string: string): Promise<{ json: Object, transformed: Object }> {
    return new Promise((resolve, reject) => {
      let json;

      try {
        json = JSON.parse(string);
      } catch (error) {
        return reject(`Error reading json: ${error.message}`);
      }

      if (!json) {
        return reject(`Error reading json`);
      }

      try {
        const transformed = this.transformModel(json);
        return resolve({ json, transformed });
      } catch (error) {
        return reject(error);
      }
    });
  }

  transformModel(sourceModel: Object): Object {
    if (sourceModel.results) {
      // web
      let sampleModel;
      if (_.isArray(sourceModel.results)) {
        // if it's an array, just do the first one for now
        sampleModel = sourceModel.results[0];
      } else {
        // use the explicitly defined predictor result
        sampleModel = sourceModel.results['predictor'];
      }
      console.log('sampleModel', JSON.stringify(sampleModel, null, 2));
      const transformedSampleModel = this.transformSampleModel(sampleModel);
      return transformedSampleModel;
    }
    if (sourceModel.snpDistance) {
      // just do the first one for now
      const sampleIds = Object.keys(sourceModel.snpDistance.newick);
      const sampleId = sampleIds[0];

      const sampleModel = sourceModel.snpDistance.newick[sampleId];

      const transformedSampleModel = this.transformSampleModel(
        sampleModel,
        sourceModel.geoDistance.experiments
      );

      return transformedSampleModel;
    } else {
      // only one sample from Predictor
      const sampleIds = Object.keys(sourceModel);
      if (sampleIds.length === 1) {
        const sampleId = sampleIds[0];
        const sampleModel = sourceModel[sampleId];
        const transformedSampleModel = this.transformSampleModel(sampleModel);
        return transformedSampleModel;
      }
      // Already unwrapped
      const transformedSampleModel = this.transformSampleModel(sourceModel);
      return transformedSampleModel;
    }
  }

  transformSampleModel(
    sourceModel: Object,
    relatedModels: ?Array<Object>
  ): Object {
    // return empty object if there is no data to parse
    if (
      !sourceModel ||
      typeof sourceModel !== 'object' ||
      Object.keys(sourceModel).length === 0
    ) {
      return {};
    }
    // check basic requirements
    if (!sourceModel.phylogenetics) {
      if (IS_ELECTRON) {
        // in Electron we allow user opening json file, so show an error
        throw new Error('Unsupported sample json format');
      }
      return {};
    }

    let transformed: AnalyserJsonTransformerResult = {};

    // can we display anything?

    transformed = {
      ...this.transformFlags(sourceModel),
      ...transformed,
    };

    const { hasSpecies, hasResistance } = transformed;

    if (!hasSpecies && !hasResistance) {
      const error = `This sample does not appear to contain any Mycobacterial data (or it is amplicon data, which is not supported), and therefore the predictor does not give susceptibility predictions`;
      if (IS_ELECTRON) {
        throw new Error(error);
      }
      return { error };
    }

    // style species for display

    transformed = {
      ...this.transformSpecies(sourceModel),
      ...transformed,
    };

    // return now if there is no resistance to show

    if (!hasResistance) {
      return transformed;
    }

    transformed.susceptible = [];
    transformed.resistant = [];
    transformed.inconclusive = [];
    transformed.positive = [];
    transformed.negative = [];
    transformed.inducible = [];
    transformed.evidence = {};

    /*

    the "Resistant" allele N times is in [alternate][median_depth]
    the "Susceptible" allele N times is in [reference][median_depth]

    by default. This changes to:

    [alternate][kmer_count]
    and
    [reference][kmer_count]

    for another data type (which we now support but didn't previously).

    */

    let o;
    let key;
    let value;
    let isInducible;

    const susceptibilityModel = sourceModel['susceptibility'];

    const genotypeModel =
      sourceModel['genotype_model'] ||
      sourceModel['genotypeModel'] ||
      'median_depth';

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

    transformed.evidence = this._sortObject(transformed.evidence);

    const virulenceModel =
      sourceModel['virulence_toxins'] || sourceModel['virulenceToxins'];

    if (virulenceModel) {
      for (key in virulenceModel) {
        value = virulenceModel[key].toUpperCase();
        if (value === 'POSITIVE') {
          transformed.positive.push(key);
        } else if (value === 'NEGATIVE') {
          transformed.negative.push(key);
        }
      }
    }

    let drugsResistance = {
      mdr: false,
      xdr: false,
    };

    if (
      transformed.resistant.indexOf('Isoniazid') !== -1 &&
      transformed.resistant.indexOf('Rifampicin') !== -1
    ) {
      drugsResistance.mdr = true;
      /*
        If MDR AND R to both fluoroquinolones and one of the other these 3 (Amikacin, Kanamycin, Capreomycin), then call it XDR (Extensively Drug Resistant)
        */
      if (transformed.resistant.indexOf('Quinolones')) {
        if (
          transformed.resistant.indexOf('Amikacin') !== -1 ||
          transformed.resistant.indexOf('Kanamycin') !== -1 ||
          transformed.resistant.indexOf('Capreomycin') !== -1
        ) {
          drugsResistance.xdr = true;
        }
      }
    }

    transformed.drugsResistance = drugsResistance;

    // tree and neighbours
    if (sourceModel.neighbours && relatedModels) {
      let neighbourKeys = Object.keys(sourceModel.neighbours);
      let samples = {};
      for (let i = 0; i < 2; i++) {
        const neighbour = sourceModel.neighbours[neighbourKeys[i]];
        let keys = Object.keys(neighbour);
        let neighbourSampleModel = relatedModels[i];
        let sampleId: string = keys[0];
        neighbourSampleModel.id = sampleId;
        samples[sampleId] = neighbourSampleModel;
      }
      transformed.samples = samples;

      transformed.tree = sourceModel.tree;
    }

    return transformed;
  }

  /*
    {
      "phylogenetics": {
      "lineage": {
        "Beijing_East_Asia": {
          "percent_coverage": 100,
          "median_depth": 36
        }
      },
      "sub_complex": {
        "Unknown": {
          "percent_coverage": -1,
          "median_depth": -1
        }
      },
      "phylo_group": {
        "Mycobacterium_tuberculosis_complex": {
          "percent_coverage": 99.496,
          "median_depth": 38
        }
      },
      "species": {
        "Mycobacterium_tuberculosis": {
          "percent_coverage": 98.454,
          "median_depth": 34
        }
      }
    },
  */

  /*
  test if the phylo_group is either:
  1) Non_tuberculosis_mycobacterium_complex, in which case only the species will be shown an no AMR predictions
  2) Mycobacterium_tuberculosis_complex, in which case both species and AMR prediction will be performed.
  */

  transformFlags(
    sourceModel: Object
  ): { hasSpecies: boolean, hasResistance: boolean } {
    let hasSpecies = false;
    let hasResistance = false;

    if (sourceModel.phylogenetics && sourceModel.phylogenetics.phylo_group) {
      const phyloGroup = Object.keys(sourceModel.phylogenetics.phylo_group);
      if (phyloGroup.indexOf('Non_tuberculosis_mycobacterium_complex') !== -1) {
        hasSpecies = true;
      }
      if (phyloGroup.indexOf('Mycobacterium_tuberculosis_complex') !== -1) {
        hasSpecies = true;
        hasResistance = true;
      }
    }

    return { hasSpecies, hasResistance };
  }

  transformSpecies(
    sourceModel: Object
  ): {
    lineage: Array<string>,
    species: Array<string>,
    speciesAndLineageString: string,
    speciesString: string,
    lineageString: string,
  } {
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
  }

  _sortObject(o: Object) {
    let sorted = {};
    let key;
    let a = [];

    for (key in o) {
      if (o.hasOwnProperty(key)) {
        a.push(key);
      }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
      sorted[a[key]] = o[a[key]];
    }
    return sorted;
  }
}

export default AnalyserJsonTransformer;
