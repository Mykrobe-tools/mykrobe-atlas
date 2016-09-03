import MykrobeConfig from './MykrobeConfig';
import _ from 'lodash';
import * as TargetConstants from 'constants/TargetConstants';

class MykrobeJsonTransformer {
  constructor(config = new MykrobeConfig()) {
    this.config = config;
  }

  transform(jsonString) {
    return new Promise((resolve, reject) => {
      this.stringToJson(jsonString).then((json) => {
        resolve(json);
      });
    });
  }

  stringToJson(string) {
    return new Promise((resolve, reject) => {
      // extract just the portion in curly braces {}
      const first = string.indexOf('{');
      const last = string.lastIndexOf('}');
      var extracted = string.substr(first, 1 + last - first);
      // replace escaped tabs, quotes, newlines
      extracted = extracted.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"');
      console.log(extracted);
      const json = JSON.parse(extracted);
      const transformed = this.transformModel(json);
      resolve({json, transformed});
    });
  }

  transformModel(sourceModel) {
    var o;
    var susceptibilityModel;
    var key;
    var calledVariants;
    var calledGenes;
    var value;
    var isInducible;
    var virulenceModel;
    var model = {};

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
      value = susceptibilityModel[key].substr(0, 1).toUpperCase();
      isInducible = susceptibilityModel[key].toUpperCase().indexOf('INDUCIBLE') !== -1;
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

    return model;
  }

  _sortObject(o) {
    var sorted = {};
    var key;
    var a = [];

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
