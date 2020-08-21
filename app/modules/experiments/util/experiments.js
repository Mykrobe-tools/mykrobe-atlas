/* @flow */

import _get from 'lodash.get';

import { newickContainsNodeId } from './newick';

export const experimentsInTree = (
  experimentsTree,
  experiments,
  inTree = true
) => {
  console.log('experimentsInTree', { experimentsTree, experiments });
  return (
    experiments &&
    experiments.filter((experiment) => {
      const leafId = experiment?.leafId;
      let contains = false;
      if (leafId) {
        contains = newickContainsNodeId(experimentsTree, leafId);
      }
      if (contains) {
        return inTree;
      }
      return !inTree;
    })
  );
};

export const experimentsWithGeolocation = (
  experiments,
  withGeolocation = true
) => {
  return (
    experiments &&
    experiments.filter((experiment) => {
      const longitudeIsolate = _get(
        experiment,
        'metadata.sample.longitudeIsolate'
      );
      const latitudeIsolate = _get(
        experiment,
        'metadata.sample.latitudeIsolate'
      );
      if (longitudeIsolate && latitudeIsolate) {
        return withGeolocation;
      }
      return !withGeolocation;
    })
  );
};
