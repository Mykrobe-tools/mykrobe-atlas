/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import CenterContainerStorybook from '../../../util/storybook/CenterContainerStorybook';

import Susceptibility from './Susceptibility';

const metadataPhenotyping = {
  rifampicin: {
    susceptibility: 'Sensitive',
    method: 'Other',
  },
  ethambutol: {
    susceptibility: 'Resistant',
    method: 'Microtitre plate',
  },
  pyrazinamide: {
    susceptibility: 'Inconclusive',
    method: 'Microtitre plate',
  },
  isoniazid: {
    susceptibility: 'Not tested',
    method: 'Other',
  },
  rifabutin: {
    susceptibility: 'Inconclusive',
    method: 'MGIT',
  },
  ofloxacin: {
    susceptibility: 'Resistant',
    method: 'Other',
  },
  ciprofloxacin: {
    method: 'Not known',
  },
  levofloxacin: {
    method: 'Microtitre plate',
    susceptibility: 'Resistant',
  },
  gatifloxacin: {
    susceptibility: 'Sensitive',
    method: 'Microtitre plate',
  },
  amikacin: {
    susceptibility: 'Resistant',
    method: 'MGIT',
  },
  kanamycin: {
    susceptibility: 'Sensitive',
  },
  gentamicin: {
    susceptibility: 'Resistant',
    method: 'MGIT',
  },
  streptomycin: {
    susceptibility: 'Sensitive',
    method: 'Microtitre plate',
  },
  capreomycin: {
    susceptibility: 'Resistant',
    method: 'MGIT',
  },
  clofazimine: {
    susceptibility: 'Sensitive',
    method: 'MODS',
  },
  pas: {
    susceptibility: 'Not tested',
    method: 'Microtitre plate',
  },
  linezolid: {
    susceptibility: 'Resistant',
  },
  ethionamideProthionamide: {
    susceptibility: 'Inconclusive',
  },
  rerizidone: {
    susceptibility: 'Inconclusive',
  },
  amoxicilinClavulanate: {
    susceptibility: 'Resistant',
  },
  thioacetazone: {
    method: 'Microtitre plate',
    susceptibility: 'Inconclusive',
  },
  imipenemImipenemcilastatin: {
    susceptibility: 'Resistant',
  },
  meropenem: {
    susceptibility: 'Sensitive',
  },
  clarythromycin: {
    susceptibility: 'Resistant',
  },
  highDoseIsoniazid: {
    susceptibility: 'Sensitive',
  },
  bedaquiline: {
    susceptibility: 'Sensitive',
  },
  delamanid: {
    susceptibility: 'Inconclusive',
  },
  prothionamide: {
    susceptibility: 'Resistant',
  },
  pretothionamide: {
    susceptibility: 'Resistant',
  },
  pretomanid: {
    susceptibility: 'Sensitive',
  },
};

const variations = {
  predictor: {
    susceptibility: {
      Ofloxacin: {
        predict: 'S',
      },
      Moxifloxacin: {
        predict: 'S',
      },
      Isoniazid: {
        predict: 'R',
        called_by: {
          'katG_S315X-GCT2155167GGT': {
            variant: null,
            genotype: [1, 1],
            genotype_likelihoods: [
              -5820.99135631956,
              -99999999,
              -82.7661725622509,
            ],
            info: {
              coverage: {
                reference: {
                  percent_coverage: 0,
                  median_depth: 0,
                  min_non_zero_depth: 0,
                  kmer_count: 0,
                  klen: 21,
                },
                alternate: {
                  percent_coverage: 100,
                  median_depth: 43,
                  min_non_zero_depth: 40,
                  kmer_count: 850,
                  klen: 20,
                },
              },
              expected_depths: [55],
              contamination_depths: [],
              filter: [],
              conf: 5738,
            },
            _cls: 'Call.VariantCall',
          },
        },
      },
      Kanamycin: {
        predict: 'S',
      },
      Ethambutol: {
        predict: 'S',
      },
      Streptomycin: {
        predict: 'S',
      },
      Ciprofloxacin: {
        predict: 'S',
      },
      Pyrazinamide: {
        predict: 'S',
      },
      Rifampicin: {
        predict: 'R',
        called_by: {
          'rpoB_S450X-TCG761154TTG': {
            variant: null,
            genotype: [1, 1],
            genotype_likelihoods: [
              -6249.837967310699,
              -99999999,
              -55.92699491580406,
            ],
            info: {
              coverage: {
                reference: {
                  percent_coverage: 0,
                  median_depth: 0,
                  min_non_zero_depth: 0,
                  kmer_count: 0,
                  klen: 21,
                },
                alternate: {
                  percent_coverage: 100,
                  median_depth: 51,
                  min_non_zero_depth: 48,
                  kmer_count: 960,
                  klen: 20,
                },
              },
              expected_depths: [55],
              contamination_depths: [],
              filter: [],
              conf: 6194,
            },
            _cls: 'Call.VariantCall',
          },
        },
      },
      Amikacin: {
        predict: 'S',
      },
      Capreomycin: {
        predict: 'S',
      },
    },
  },
  metadata: { susceptibility: metadataPhenotyping },
};

storiesOf('ui/Susceptibility', module)
  .addDecorator((story) => <CenterContainerStorybook story={story()} />)
  .add('Predictor format', () => <Susceptibility {...variations.predictor} />)
  .add('Metadata format', () => <Susceptibility {...variations.metadata} />);
