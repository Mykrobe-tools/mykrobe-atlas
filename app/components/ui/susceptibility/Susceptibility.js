/* @flow */

import * as React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import uuid from 'uuid';

import { Phenotyping } from 'mykrobe-atlas-jsonschema/schemas/definitions/experiment/experiment-metadata-phenotyping';

import styles from './Susceptibility.module.scss';

import susceptibilityTransformer from '../../../modules/experiments/util/transformers/susceptibility';

const shortTitles = {
  isoniazid: 'H',
  rifampicin: 'R',
  pyrazinamide: 'Z',
  ethambutol: 'E',
  levofloxacin: 'Lfx',
  moxifloxacin: 'Mfx',
  gatifloxacin: 'Gfx',
  streptomycin: 'S',
  amikacin: 'Am',
  kanamycin: 'Km',
  capreomycin: 'Cm',
  ethionamide: 'Eto',
  cycloserine: 'Cs',
  terizidone: 'Trd',
  clofazimine: 'Cfz',
  linezolid: 'Lzd',
  bedaquiline: 'Bdq',
};

const Susceptibility = ({
  id = uuid.v4(),
  susceptibility,
}: React.ElementProps<*>): React.Element<*> | null => {
  const transformed = susceptibilityTransformer(susceptibility);
  const elements = [];
  const keys = Object.keys(transformed.susceptibility);
  keys.forEach((key) => {
    const keyLower = key.toLowerCase();
    const entry = transformed.susceptibility[key];
    const title = Phenotyping.properties[keyLower]?.title || key;
    const shortTitle =
      shortTitles[keyLower] || title.substr(0, 1).toUpperCase();
    const elementId = `${keyLower}${id}`;
    const elementKey = `${keyLower}`;
    if (entry.resistant) {
      elements.push(
        <span key={elementKey}>
          <span id={elementId} className={styles.resistant}>
            {shortTitle}{' '}
          </span>
          <UncontrolledTooltip delay={0} target={elementId}>
            {title} resistant{'\n'}
            {entry.mutation && (
              <React.Fragment>Mutation {entry.mutation}</React.Fragment>
            )}
          </UncontrolledTooltip>
        </span>
      );
    } else {
      elements.push(
        <span key={elementKey}>
          <span id={elementId} className={styles.susceptible}>
            {shortTitle}{' '}
          </span>
          <UncontrolledTooltip delay={0} target={elementId}>
            {title} susceptible
          </UncontrolledTooltip>
        </span>
      );
    }
  });
  const susceptibilityProfile = elements.length ? (
    <span className={styles.resistanceProfile}>{elements}</span>
  ) : (
    <React.Fragment>–</React.Fragment>
  );

  return (
    <React.Fragment>
      {susceptibilityProfile}
      <pre>{JSON.stringify({ id, susceptibility, transformed }, null, 2)}</pre>
    </React.Fragment>
  );
};

export default Susceptibility;
