import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
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
  shareSequence: true
};

export default function metadata(state = initialState, action = {}) {
  switch (action.type) {
    case ActionTypes.POST_METADATA_FORM:
      return initialState;
    case ActionTypes.SET_METADATA:
      return action.metadata;
    default:
      return state;
  }
}
