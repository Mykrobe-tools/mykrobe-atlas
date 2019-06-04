/* @flow */

import _get from 'lodash.get';

import { newickContainsNodeId } from './newick';

export const experimentsInTree = (
  experimentsTree,
  experiments,
  inTree = true
) => {
  return experiments.filter(experiment => {
    const isolateId = _get(experiment, 'metadata.sample.isolateId') || '–';
    const contains = newickContainsNodeId(experimentsTree, isolateId);
    if (contains) {
      return inTree;
    }
    return !inTree;
  });
};

export const experimentsWithGeolocation = (
  experiments,
  withGeolocation = true
) => {
  return experiments.filter(experiment => {
    const longitudeIsolate = _get(
      experiment,
      'metadata.sample.longitudeIsolate'
    );
    const latitudeIsolate = _get(experiment, 'metadata.sample.latitudeIsolate');
    if (longitudeIsolate && latitudeIsolate) {
      return withGeolocation;
    }
    return !withGeolocation;
  });
};
