/* @flow */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import reducer, { initialState, setMetadata } from './metadata';

const createMockStore = configureMockStore([thunk]);

describe('metadata reducer', () => {
  const store = createMockStore(initialState);
  let mockState;

  beforeEach(() => {
    store.clearActions();
  });

  it('should return the initial state', () => {
    mockState = reducer();
    expect(mockState).toEqual(initialState);
  });

  it('should handle "setMetadata" action', async () => {
    await store.dispatch(setMetadata({ lorem: 'ipsum' }));
    const dispatchedActions = store.getActions();
    mockState = reducer(undefined, dispatchedActions[0]);
    expect(mockState).toEqual({
      metadata: { lorem: 'ipsum' },
    });
  });

  // TODO: add postMetadataForm test
});
