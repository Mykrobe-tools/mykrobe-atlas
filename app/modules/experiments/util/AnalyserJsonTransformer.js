/* @flow */

import { isArray } from 'makeandship-js-common/src/utils/is';

import susceptibilityTransformer from './transformers/susceptibility';
import speciesTransformer from './transformers/species';

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
  error?: any,
  distance?: any,
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
      if (isArray(sourceModel.results)) {
        // if it's an array, just do the first one for now
        sampleModel = sourceModel.results[0];
      } else {
        // use the explicitly defined predictor result
        sampleModel = sourceModel.results['predictor'];
      }
      // console.log('sampleModel', JSON.stringify(sampleModel, null, 2));
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
  ): AnalyserJsonTransformerResult {
    let transformed: AnalyserJsonTransformerResult = {};
    // return empty object if there is no data to parse
    if (
      !sourceModel ||
      typeof sourceModel !== 'object' ||
      Object.keys(sourceModel).length === 0
    ) {
      return transformed;
    }
    // check basic requirements
    if (!sourceModel.phylogenetics) {
      if (IS_ELECTRON) {
        // in Electron we allow user opening json file, so show an error
        throw new Error('Unsupported sample json format');
      }
      return transformed;
    }

    // can we display anything?

    transformed = {
      ...transformed,
      ...this.transformFlags(sourceModel),
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
      ...transformed,
      ...speciesTransformer(sourceModel),
    };

    // return now if there is no resistance to show

    if (!hasResistance) {
      return transformed;
    }

    let key;
    let value;

    const susceptibilityModel = sourceModel['susceptibility'];

    const genotypeModel =
      sourceModel['genotype_model'] || sourceModel['genotypeModel'];

    const susceptibility = susceptibilityTransformer(
      susceptibilityModel,
      genotypeModel
    );
    transformed = {
      ...transformed,
      ...susceptibility,
    };

    transformed.positive = [];
    transformed.negative = [];

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

    /*
    https://www.who.int/tb/areas-of-work/drug-resistant-tb/xdr-tb-faq/en/
    XDR-TB involves resistance to the two most powerful anti-TB drugs, isoniazid and rifampicin, also known as multidrug-resistance (MDR-TB), in addition to resistance to any of the fluoroquinolones (such as levofloxacin or moxifloxacin) and to at least one of the three injectable second-line drugs (amikacin, capreomycin or kanamycin).
    */

    // Check for multidrug-resistance (MDR)

    const mdr =
      transformed.resistant.includes('Isoniazid') &&
      transformed.resistant.includes('Rifampicin');

    if (mdr) {
      drugsResistance.mdr = true;

      // Check for extensively drug-resistant (XDR)

      const fluoroquinolonesResistant =
        transformed.resistant.includes('Ofloxacin') ||
        transformed.resistant.includes('Moxifloxacin') ||
        transformed.resistant.includes('Ciprofloxacin');

      if (fluoroquinolonesResistant) {
        if (
          transformed.resistant.includes('Amikacin') ||
          transformed.resistant.includes('Kanamycin') ||
          transformed.resistant.includes('Capreomycin')
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
      if (phyloGroup.includes('Non_tuberculosis_mycobacterium_complex')) {
        hasSpecies = true;
      }
      if (phyloGroup.includes('Mycobacterium_tuberculosis_complex')) {
        hasSpecies = true;
        hasResistance = true;
      }
    }

    return { hasSpecies, hasResistance };
  }
}

export default AnalyserJsonTransformer;
