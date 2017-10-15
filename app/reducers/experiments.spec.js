import reducer from './experiments';
import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  isFetching: false,
  samples: [],
};

describe('experiments reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle "REQUEST_EXPERIMENTS" action', () => {
    expect(
      reducer(undefined, {
        type: ActionTypes.REQUEST_EXPERIMENTS,
      })
    ).toEqual({
      isFetching: true,
      samples: [],
    });
  });

  it('should handle "RECEIVE_EXPERIMENTS" action', () => {
    expect(
      reducer(undefined, {
        type: ActionTypes.RECEIVE_EXPERIMENTS,
        data: [{ lorem: 'ipsum' }],
      })
    ).toEqual({
      isFetching: false,
      samples: [{ lorem: 'ipsum' }],
    });
  });
});
