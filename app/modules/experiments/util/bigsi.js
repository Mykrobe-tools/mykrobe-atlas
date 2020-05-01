/* @flow */

import produce from 'immer';
import _get from 'lodash.get';

import { queryStringKeyExtractor } from 'makeandship-js-common/src/modules/generic/keyExtractors';

// use the query to identify each notification

export const notificationIdForBigsi = (bigsi) => {
  const cleaned = produce(bigsi, (draft) => {
    // strip the 'search_id' provided in server sent events
    delete draft.search_id;
    // strip the 'threshold' which seems to change for the same query
    draft.query.threshold && delete draft.query.threshold;
  });
  const notificationId = queryStringKeyExtractor(cleaned);
  return notificationId;
};

export const mapTypeToSearch = {
  sequence: 'Sequence search',
  'protein-variant': 'Protein variant search',
  'dna-variant': 'DNA variant search',
};

export const descriptionForBigsi = (bigsi) => {
  const query = _get(bigsi, 'query.seq');
  const type = _get(bigsi, 'type');
  const search = mapTypeToSearch[type] || 'Search';
  return query ? `${search} for ${query}` : search;
};
