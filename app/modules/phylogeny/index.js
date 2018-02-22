/* @flow */

import { combineReducers } from 'redux';
import node from './node';

export {
  setNodeHighlighted,
  unsetNodeHighlightedAll,
  getHighlighted,
} from './node';

const reducer = combineReducers({
  node,
});

export default reducer;
