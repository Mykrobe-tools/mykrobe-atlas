/* @flow */

import memoizeOne from 'memoize-one';

export const getNewickTokens = memoizeOne(newick =>
  newick.split(/\s*(;|\(|\)|,|:)\s*/)
);

export const newickContainsNodeId = (newick, nodeId) => {
  const tokens = getNewickTokens(newick);
  return tokens && tokens.includes(nodeId);
};
