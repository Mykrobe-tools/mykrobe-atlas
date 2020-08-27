/* @flow */

import _get from 'lodash.get';

import { newickContainsNodeId } from './newick';

export const filterExperimentsInTree = (
  experimentsTree,
  experiments,
  inTree = true
) => {
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

export const filterExperimentsWithGeolocation = (
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
