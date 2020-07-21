/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import Susceptibility from './Susceptibility';

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
};

storiesOf('Susceptibility', module).add('Predictor data', () => (
  <Susceptibility {...variations.predictor} />
));
