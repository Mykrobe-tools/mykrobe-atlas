/* @flow */

import _get from 'lodash.get';

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
