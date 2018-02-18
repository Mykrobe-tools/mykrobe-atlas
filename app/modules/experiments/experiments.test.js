/* @flow */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import reducer, {
  initialState,
  requestExperiments,
  receiveExperiments,
} from './experiments';

const createMockStore = configureMockStore([thunk]);

describe('experiments reducer', () => {
  const store = createMockStore(initialState);
  let mockState;

  beforeEach(() => {
    store.clearActions();
  });

  it('should return the initial state', () => {
    mockState = reducer();
    expect(mockState).toEqual(initialState);
  });

  it('should handle "requestExperiments" action', async () => {
    await store.dispatch(requestExperiments());
    const dispatchedActions = store.getActions();
    mockState = reducer(undefined, dispatchedActions[0]);
    expect(mockState).toEqual({
      isFetching: true,
      samples: [],
      total: null,
    });
  });

  it('should handle "receiveExperiments" action', async () => {
    await store.dispatch(
      receiveExperiments({
        results: [{ lorem: 'ipsum' }],
        summary: { hits: 1 },
      })
    );
    const dispatchedActions = store.getActions();
    mockState = reducer(undefined, dispatchedActions[0]);
    expect(mockState).toEqual({
      isFetching: false,
      samples: [{ lorem: 'ipsum' }],
      total: 1,
    });
  });
});
