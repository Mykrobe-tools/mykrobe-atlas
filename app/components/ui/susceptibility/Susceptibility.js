/* @flow */

import * as React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import uuid from 'uuid';

import styles from './Susceptibility.module.scss';

import susceptibilityTransformer from '../../../modules/experiments/util/transformers/susceptibility';

const Susceptibility = ({
  id = uuid.v4(),
  susceptibility,
}: React.ElementProps<*>): React.Element<*> | null => {
  const transformed = susceptibilityTransformer(susceptibility);
  const elements = [];
  const keys = Object.keys(transformed.susceptibility);
  keys.forEach((key) => {
    const entry = transformed.susceptibility[key];
    const initial = key.substr(0, 1).toUpperCase();
    const elementId = `${key}${id}`;
    const elementKey = `${key}`;
    if (entry.resistant) {
      elements.push(
        <span key={elementKey}>
          <span id={elementId} className={styles.resistant}>
            {initial}{' '}
          </span>
          <UncontrolledTooltip delay={0} target={elementId}>
            {key} resistant{'\n'}
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
            {initial}{' '}
          </span>
          <UncontrolledTooltip delay={0} target={elementId}>
            {key} susceptible
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
