/* @flow */

import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  template: [],
  metadata: {
    location: 'GB',
    labId: '',
    date: '',
    responsiblePersonId: '',
    responsiblePersonData: '',
    patientId: '',
    sampleId: '',
    sequencingMachine: '',
    patientHistory: '',
    sampleType: '',
    susceptibility: {},
    hivPositive: '',
    treatedForTB: '',
    shareSequence: true,
  },
};

export default function metadata(
  state: Object = initialState,
  action: Object = {}
) {
  switch (action.type) {
    case ActionTypes.POST_METADATA_FORM:
      return {
        template: state.template,
        metadata: initialState.metadata,
      };
    case ActionTypes.SET_METADATA_TEMPLATE:
      return {
        template: action.template,
        metadata: state.metadata,
      };
    case ActionTypes.SET_METADATA:
      return {
        template: state.template,
        metadata: action.metadata,
      };
    default:
      return state;
  }
}
