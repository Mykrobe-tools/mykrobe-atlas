/* @flow */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import { fetchJsonMiddleware } from '../api';
import { API_URL } from '../../constants/APIConstants.js';

import reducer, { initialState, updateMetadata, setMetadata } from './metadata';

const createMockStore = configureMockStore([thunk, fetchJsonMiddleware]);

describe('metadata module', () => {
  const store = createMockStore(initialState);
  let mockState;

  beforeEach(() => {
    store.clearActions();
    nock.cleanAll();
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
      isFetching: false,
      metadata: { lorem: 'ipsum' },
    });
  });

  it('should handle "updateMetadata" action', async () => {
    nock(API_URL)
      .put('/experiments/1')
      .reply(200, { status: 'success', data: { lorem: 'ipsum' } });
    await store.dispatch(updateMetadata('1', {}));
    const dispatchedActions = store.getActions();
    dispatchedActions.forEach(dispatchedAction => {
      mockState = reducer(mockState, dispatchedAction);
    });
    expect(mockState).toMatchSnapshot();
  });
});
