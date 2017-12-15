/* @flow */

import MykrobeConfig from '../MykrobeConfig';
import * as TargetConstants from '../../constants/TargetConstants';

class AnalyserJsonTransformer {
  config: MykrobeConfig;

  constructor(config: MykrobeConfig = new MykrobeConfig()) {
    this.config = config;
  }

  transform(jsonString: string) {
    return this.stringToJson(jsonString);
  }

  stringToJson(string: string) {
    return new Promise((resolve, reject) => {
      const json = JSON.parse(string);
      try {
        const transformed = this.transformModel(json);
        resolve({ json, transformed });
      } catch (error) {
        reject(error);
      }
    });
  }

  transformModel(sourceModel: Object) {
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
      const sampleId = sampleIds[0];
      const sampleModel = sourceModel[sampleId];
      const transformedSampleModel = this.transformSampleModel(sampleModel);
      return transformedSampleModel;
    }
  }

  transformSampleModel(sourceModel: Object, relatedModels: ?Array<Object>) {
    let o;
    let susceptibilityModel;
    let key;
    let calledVariants; // eslint-disable-line
    let calledGenes; // eslint-disable-line
    let value;
    let isInducible;
    let virulenceModel;
    let model = {};

    // is this a valid species?

    // build array of included species
    model.species = Object.keys(sourceModel.phylogenetics.species);
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
      model.lineage = Object.keys(sourceModel.phylogenetics.lineage);
      // sourceLineage = sourceModel.phylogenetics.lineage;
      // for ( key in sourceLineage ) {
      // value = sourceLineage[key].toLowerCase();
      // if ( 'major' === value ) {
      // model.lineage.push(key);
      // }
      // }
    }

    let speciesPretty = '';
    let unstyledSpeciesPretty = '';

    if (TargetConstants.SPECIES_TB === this.config.species) {
      const s = model.species
        ? model.species.join(' / ').replace(/_/g, ' ')
        : 'undefined';
      const l = model.lineage
        ? ' (lineage: ' + model.lineage.join(', ').replace(/_/g, ' ') + ')'
        : '';
      speciesPretty = `<em>${s}</em>${l}`;
      unstyledSpeciesPretty = `${s}${l}`;
    } else {
      speciesPretty = model.species
        ? model.species.join(' / ').replace(/_/g, ' ')
        : 'undefined';
      unstyledSpeciesPretty = speciesPretty;
    }

    model.speciesPretty = unstyledSpeciesPretty;

    if (TargetConstants.SPECIES_TB === this.config.species) {
      if (model.species.indexOf('Mycobacterium_tuberculosis') === -1) {
        throw `This sample does not appear to contain any Mycobacterial data (or it is amplicon data, which is not supported), and therefore the predictor does not give susceptibility predictions`;
      }
    }

    model.susceptible = [];
    model.resistant = [];
    model.inconclusive = [];
    model.positive = [];
    model.negative = [];
    model.inducible = [];

    susceptibilityModel = sourceModel['susceptibility'];

    // calledVariants = sourceModel['called_variants'];
    // calledGenes = sourceModel['called_genes'];

    model.evidence = {};

    /*
    for (key in calledVariants) {
      const mutation = calledVariants[key];
      const title = mutation['induced_resistance'];
      const genes = key.split('_');
      // group by title
      o = [];
      if (model.evidence[title]) {
        o = model.evidence[title];
      } else {
        // initialise
        model.evidence[title] = o;
      }
      o.push([
        'Resistance mutation found: ' + genes[1] + ' in gene ' + genes[0],
        'Resistant allele seen ' + mutation['R_median_cov'] + ' times',
        'Susceptible allele seen ' + mutation['S_median_cov'] + ' times',
      ]);
    }

    for (key in calledGenes) {
      const spot = calledGenes[key];
      const title = spot['induced_resistance'];
      // group by title
      o = [];
      if (model.evidence[title]) {
        o = model.evidence[title];
      } else {
        // initialise
        model.evidence[title] = o;
      }
      o.push([
        key + ' gene found',
        'Percent recovered: ' + spot['per_cov'] + '%',
        'Median coverage: ' + spot['median_cov'],
      ]);
    }
    */

    model.evidence = this._sortObject(model.evidence);

    // ignore the values
    model.phyloGroup = Object.keys(sourceModel.phylogenetics.phylo_group);

    /*
It should be I491F in rpoB – it shouldn't be repeated like that in the output, sorry!

Otherwise the "Resistant" allele N times is in [alternate][median_depth]
and  the "Susceptible" allele N times is in [reference][median_depth]

by default.

However, as Zam mentioned, this changes to:

[alternate][kmer_count]
and
[reference][kmer_count]

for another data type (which we now support but didn't previously).

I'll have to add another k,v in the output which specifies whether to use "median_depth" or "kmer_count".

The phrasing would also change from
"has been seen X times" to something like "X kmers from the resistance/susceptible allele"

    */

    const genotypeModel = sourceModel.genotype_model || 'median_depth';

    for (key in susceptibilityModel) {
      const predict = susceptibilityModel[key]['predict'].toUpperCase();
      value = predict.substr(0, 1);
      isInducible = predict.indexOf('INDUCIBLE') !== -1;
      if (value === 'S') {
        model.susceptible.push(key);
      } else if (value === 'R') {
        model.resistant.push(key);
      } else if (value === 'N') {
        model.inconclusive.push(key);
      }
      if (isInducible) {
        model.inducible.push(key);
      }
      if ('called_by' in susceptibilityModel[key]) {
        const calledBy = susceptibilityModel[key]['called_by'];
        for (let calledByKey in calledBy) {
          // group by title
          o = [];
          if (model.evidence[key]) {
            o = model.evidence[key];
          } else {
            // initialise
            model.evidence[key] = o;
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

    if ('virulence_toxins' in sourceModel) {
      virulenceModel = sourceModel['virulence_toxins'];
      for (key in virulenceModel) {
        value = virulenceModel[key].toUpperCase();
        if (value === 'POSITIVE') {
          model.positive.push(key);
        } else if (value === 'NEGATIVE') {
          model.negative.push(key);
        }
      }
    }

    let drugsResistance = {
      mdr: false,
      xdr: false,
    };

    if (
      model.resistant.indexOf('Isoniazid') !== -1 &&
      model.resistant.indexOf('Rifampicin') !== -1
    ) {
      drugsResistance.mdr = true;
      /*
        If MDR AND R to both fluoroquinolones and one of the other these 3 (Amikacin, Kanamycin, Capreomycin), then call it XDR (Extensively Drug Resistant)
        */
      if (model.resistant.indexOf('Quinolones')) {
        if (
          model.resistant.indexOf('Amikacin') !== -1 ||
          model.resistant.indexOf('Kanamycin') !== -1 ||
          model.resistant.indexOf('Capreomycin') !== -1
        ) {
          drugsResistance.xdr = true;
        }
      }
    }

    model.drugsResistance = drugsResistance;

    // tree and neighbours
    if (sourceModel.neighbours) {
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
      model.samples = samples;

      model.tree = sourceModel.tree;
    }

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
export default AnalyserJsonTransformer;
