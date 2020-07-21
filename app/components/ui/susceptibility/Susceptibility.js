/* @flow */

import * as React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import uuid from 'uuid';

import { Phenotyping } from 'mykrobe-atlas-jsonschema/schemas/definitions/experiment/experiment-metadata-phenotyping';

import styles from './Susceptibility.module.scss';

import susceptibilityTransformer, {
  susceptibilityTypeTitles,
} from '../../../modules/experiments/util/transformers/susceptibility';

export const shortTitles = {
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
    const title = Phenotyping.properties[key]?.title || key;
    const typeTitle = susceptibilityTypeTitles[entry.type];
    const shortTitle =
      shortTitles[keyLower] || title.substr(0, 1).toUpperCase();
    const elementId = `${keyLower}${id}`;
    const elementKey = `${keyLower}`;
    elements.push(
      <span key={elementKey} className={styles.entryWrap}>
        <span id={elementId} className={styles[entry.type]}>
          {shortTitle}{' '}
        </span>
        <UncontrolledTooltip delay={0} target={elementId}>
          <div>
            {title} &middot; {typeTitle}
          </div>
          {entry.mutation && <div>Mutation &middot; {entry.mutation}</div>}
          {entry.method && <div>Method &middot; {entry.method}</div>}
        </UncontrolledTooltip>
      </span>
    );
  });
  const susceptibilityProfile = elements.length ? (
    <span className={styles.resistanceProfile}>{elements}</span>
  ) : (
    <React.Fragment>–</React.Fragment>
  );

  return susceptibilityProfile;
};

export default Susceptibility;
