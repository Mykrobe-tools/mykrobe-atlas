/* @flow */

import * as ActionTypes from 'constants/ActionTypes';

export function postMetadataForm(metadata: Object) {
  // TODO: post metadata form to API
  return {
    type: ActionTypes.POST_METADATA_FORM
  }
}

export function setMetadata(metadata: Object) {
  return {
    type: ActionTypes.SET_METADATA,
    metadata
  };
}
