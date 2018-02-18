/* @flow */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import { BASE_URL } from '../../constants/APIConstants.js';

import reducer, {
  initialState,
  requestExperiments,
  receiveExperiments,
  fetchExperiments,
} from './experiments';

const createMockStore = configureMockStore([thunk]);
const data = require('../../../test/__fixtures__/api/experiments.json');

describe('experiments module', () => {
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

  it('should handle "requestExperiments" action', async () => {
    await store.dispatch(requestExperiments());
    const dispatchedActions = store.getActions();
    mockState = reducer(mockState, dispatchedActions[0]);
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
    mockState = reducer(mockState, dispatchedActions[0]);
    expect(mockState).toEqual({
      isFetching: false,
      samples: [{ lorem: 'ipsum' }],
      total: 1,
    });
  });

  it('should handle "fetchExperiments" action', async () => {
    nock(BASE_URL)
      .get('/experiments/search')
      .query(true)
      .reply(200, data);
    await store.dispatch(fetchExperiments());
    const dispatchedActions = store.getActions();
    for (let dispatchedAction in dispatchedActions) {
      mockState = reducer(mockState, dispatchedAction);
    }
    expect(dispatchedActions).toMatchSnapshot();
    expect(mockState).toMatchSnapshot();
  });
});
