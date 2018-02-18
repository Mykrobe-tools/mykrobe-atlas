/* @flow */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import { BASE_URL } from '../../constants/APIConstants.js';

import reducer, {
  initialState,
  postMetadataForm,
  setMetadata,
} from './metadata';

const createMockStore = configureMockStore([thunk]);

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
      metadata: { lorem: 'ipsum' },
    });
  });

  it('should handle "postMetadataForm" action', async () => {
    nock(BASE_URL)
      .put('/experiments/1')
      .reply(200, { status: 'ok' });
    await store.dispatch(postMetadataForm('1', {}));
    const dispatchedActions = store.getActions();
    mockState = reducer(undefined, dispatchedActions[0]);
    expect(mockState).toMatchSnapshot();
  });
});
