/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';

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
        prediction: 'S',
      },
      Moxifloxacin: {
        prediction: 'S',
      },
      Isoniazid: {
        prediction: 'S',
      },
      Kanamycin: {
        prediction: 'S',
      },
      Ethambutol: {
        prediction: 'S',
      },
      Streptomycin: {
        prediction: 'S',
      },
      Ciprofloxacin: {
        prediction: 'S',
      },
      Pyrazinamide: {
        prediction: 'S',
      },
      Rifampicin: {
        prediction: 'S',
      },
      Amikacin: {
        prediction: 'S',
      },
      Capreomycin: {
        prediction: 'S',
      },
    },
  },
  metadata: { susceptibility: metadataPhenotyping },
};

storiesOf('Susceptibility', module)
  .add('Predictor format', () => <Susceptibility {...variations.predictor} />)
  .add('Metadata format', () => <Susceptibility {...variations.metadata} />);
