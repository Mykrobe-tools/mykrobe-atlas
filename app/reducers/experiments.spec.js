import reducer from './experiments';
import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  isFetching: false,
  filterValues: [],
  samples: [],
  total: 0,
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
      filterValues: [],
      samples: [],
      total: null,
    });
  });

  it('should handle "RECEIVE_EXPERIMENTS" action', () => {
    expect(
      reducer(undefined, {
        type: ActionTypes.RECEIVE_EXPERIMENTS,
        data: { results: [{ lorem: 'ipsum' }], summary: { hits: 1 } },
      })
    ).toEqual({
      isFetching: false,
      filterValues: [],
      samples: [{ lorem: 'ipsum' }],
      total: 1,
    });
  });
});
