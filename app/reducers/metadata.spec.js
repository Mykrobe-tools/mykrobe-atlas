import reducer from './metadata';
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

describe('metadata reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle "POST_METADATA_FORM" action', () => {
    expect(
      reducer(undefined, {
        type: ActionTypes.POST_METADATA_FORM,
      })
    ).toEqual(initialState);
  });

  it('should handle "SET_METADATA" action', () => {
    expect(
      reducer(undefined, {
        type: ActionTypes.SET_METADATA,
        metadata: { lorem: 'ipsum' },
      })
    ).toEqual({
      template: [],
      metadata: { lorem: 'ipsum' },
    });
  });
});
