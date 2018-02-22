/* @flow */

import { combineReducers } from 'redux';
import metadata from './metadata';
import template from './template';

export {
  getMetadata,
  setMetadata,
  updateMetadata,
  getIsFetching,
} from './metadata';

export { getTemplate, requestTemplate } from './template';

const reducer = combineReducers({
  metadata,
  template,
});

export default reducer;
