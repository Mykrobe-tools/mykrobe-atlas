/* @flow */

import MykrobeConfig from './MykrobeConfig';
import _ from 'lodash';
import * as TargetConstants from 'constants/TargetConstants';
import type { Sample } from 'types/Sample';

const samplesForTest: Array<Sample> = [
  {
    'id': '1',
    'date': '29 September 2016',
    'locationName': 'London',
    'locationLatLngForTest': {
      'lat': '51.5074',
      'lng': '0.1278'
    },
    'colorForTest': '#c30042'
  },
  {
    'id': '2',
    'date': '28 September 2016',
    'locationName': 'Bangalore',
    'locationLatLngForTest': {
      'lat': '12.97',
      'lng': '77.59'
    },
    'colorForTest': '#0f82d0'
  }
];

class MykrobeJsonTransformer {
  config: MykrobeConfig;

  constructor(config: MykrobeConfig = new MykrobeConfig()) {
    this.config = config;
  }

  transform(jsonString: string) {
    return new Promise((resolve, reject) => {
      this.stringToJson(jsonString).then((transformed) => {
        resolve(transformed);
      });
    });
  }

  stringToJson(string: string) {
    return new Promise((resolve, reject) => {
      // extract just the portion in curly braces {}
      const first = string.indexOf('{');
      const last = string.lastIndexOf('}');
      let extracted = string.substr(first, 1 + last - first);
      // replace escaped tabs, quotes, newlines
      extracted = extracted.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"');
      // console.log(extracted);
      const json = JSON.parse(extracted);
      const transformed = this.transformModel(json);
      resolve({json, transformed});
    });
  }

  transformModel(sourceModel: Object) {
    // just do the first one for now
    const sampleIds = _.keys(sourceModel);
    const sampleId = sampleIds[0];

    const sampleModel = sourceModel[sampleId];
    const transformedSampleModel = this.transformSampleModel(sampleModel);

    return transformedSampleModel;
  }

  transformSampleModel(sourceModel: Object) {
    let o;
    let susceptibilityModel;
    let key;
    let calledVariants;
    let calledGenes;
    let value;
    let isInducible;
    let virulenceModel;
    let model = {};

    model.susceptible = [];
    model.resistant = [];
    model.inconclusive = [];
    model.positive = [];
    model.negative = [];
    model.inducible = [];

    susceptibilityModel = sourceModel['susceptibility'];

    calledVariants = sourceModel['called_variants'];
    calledGenes = sourceModel['called_genes'];

    model.evidence = {};

    for (key in calledVariants) {
      const mutation = calledVariants[key];
      const title = mutation['induced_resistance'];
      const genes = key.split('_');
      // group by title
      o = [];
      if (model.evidence[title]) {
        o = model.evidence[title];
      }
      else {
        // initialise
        model.evidence[title] = o;
      }
      o.push([
        'Resistance mutation found: ' + genes[1] + ' in gene ' + genes[0],
        'Resistant allele seen ' + (mutation['R_median_cov']) + ' times',
        'Susceptible allele seen ' + (mutation['S_median_cov']) + ' times'
      ]);
    }

    for (key in calledGenes) {
      const spot = calledGenes[key];
      const title = spot['induced_resistance'];
      // group by title
      o = [];
      if (model.evidence[title]) {
        o = model.evidence[title];
      }
      else {
        // initialise
        model.evidence[title] = o;
      }
      o.push([
        key + ' gene found',
        'Percent recovered: ' + spot['per_cov'] + '%',
        'Median coverage: ' + spot['median_cov']
      ]);
    }

    model.evidence = this._sortObject(model.evidence);

    // ignore the values
    model.phyloGroup = _.keys(sourceModel.phylogenetics.phylo_group);

    // build array of included species
    model.species = _.keys(sourceModel.phylogenetics.species);
    // if ( kTargetSpeciesTB === MykrobeTarget.species ) {
    // sourceSpecies = sourceModel.phylogenetics.species;
    // }
    // else {
    //     sourceSpecies = sourceModel.species;
    // }
    // for ( key in sourceSpecies ) {
    //     value = sourceSpecies[key].toLowerCase();
    //     if ( 'major' === value ) {
    //         model.species.push(key);
    //     }
    // }

    model.lineage = [];
    if (TargetConstants.SPECIES_TB === this.config.species) {
      model.lineage = _.keys(sourceModel.phylogenetics.lineage);
      // sourceLineage = sourceModel.phylogenetics.lineage;
      // for ( key in sourceLineage ) {
      // value = sourceLineage[key].toLowerCase();
      // if ( 'major' === value ) {
      // model.lineage.push(key);
      // }
      // }
    }

    for (key in susceptibilityModel) {
      const predict = susceptibilityModel[key]['predict'].toUpperCase();
      value = predict.substr(0, 1);
      isInducible = predict.indexOf('INDUCIBLE') !== -1;
      if ('S' === value) {
        model.susceptible.push(key);
      }
      else if ('R' === value) {
        model.resistant.push(key);
      }
      else if ('N' === value) {
        model.inconclusive.push(key);
      }
      if (isInducible) {
        model.inducible.push(key);
      }
    }

    if ('virulence_toxins' in sourceModel) {
      virulenceModel = sourceModel['virulence_toxins'];
      for (key in virulenceModel) {
        value = virulenceModel[key].toUpperCase();
        if ('POSITIVE' === value) {
          model.positive.push(key);
        }
        else if ('NEGATIVE' === value) {
          model.negative.push(key);
        }
      }
    }

    let drugsResistance = {
      mdr: false,
      xdr: false
    };

    if (model.resistant.indexOf('Isoniazid') !== -1 && model.resistant.indexOf('Rifampicin') !== -1) {
      drugsResistance.mdr = true;
        /*
        If MDR AND R to both fluoroquinolones and one of the other these 3 (Amikacin, Kanamycin, Capreomycin), then call it XDR (Extensively Drug Resistant)
        */
      if (model.resistant.indexOf('Quinolones')) {
        if (model.resistant.indexOf('Amikacin') !== -1 || model.resistant.indexOf('Kanamycin') !== -1 || model.resistant.indexOf('Capreomycin') !== -1) {
          drugsResistance.xdr = true;
        }
      }
    }

    model.drugsResistance = drugsResistance;

    let speciesPretty = '';

    if (TargetConstants.SPECIES_TB === this.config.species) {
      speciesPretty = model.species.join(' / ') + ' (lineage: ' + model.lineage + ')';
    }
    else {
      speciesPretty = model.species.join(' / ');
    }

    model.speciesPretty = speciesPretty;

    // tree and neighbours

    model.tree = sourceModel.tree;

    let neighbourKeys = _.keys(sourceModel.neighbours);
    let samples = {};
    // two samples for demo
    // take one from samplesForTest and set the id
    for (let i = 0; i < 2; i++) {
      const neighbour = sourceModel.neighbours[neighbourKeys[i]];
      let keys = _.keys(neighbour);
      let demoSampleModel = samplesForTest[i];
      let sampleId: string = keys[0];
      demoSampleModel.id = sampleId;
      samples[sampleId] = demoSampleModel;
    }
    model.samples = samples;

    return model;
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
export default MykrobeJsonTransformer;
