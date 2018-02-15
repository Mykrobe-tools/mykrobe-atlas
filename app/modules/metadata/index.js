/* @flow */

import { combineReducers } from 'redux';
import metadata from './metadata';
import template from './template';

export { getMetadata, setMetadata, postMetadataForm } from './metadata';

export { getTemplate, fetchTemplate } from './template';

const reducer = combineReducers({
  metadata,
  template,
});

export default reducer;
