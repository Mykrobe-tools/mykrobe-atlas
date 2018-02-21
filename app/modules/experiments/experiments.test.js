/* @flow */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import { fetchJsonMiddleware } from '../api';
import { BASE_URL } from '../../constants/APIConstants.js';

import reducer, { initialState, fetchExperiments } from './experiments';

const createMockStore = configureMockStore([thunk, fetchJsonMiddleware]);
const data = require('../../../test/__fixtures__/api/experiments.json');

describe('experiments module', () => {
  const store = createMockStore(initialState);
  let mockState;

  beforeEach(() => {
    store.clearActions();
    nock.cleanAll();
  });

  it('should handle "fetchExperiments" action', async () => {
    nock(BASE_URL)
      .get('/experiments/search')
      .query(true)
      .reply(200, data);
    const payload = await store.dispatch(fetchExperiments());
    const dispatchedActions = store.getActions();
    for (let dispatchedAction in dispatchedActions) {
      mockState = reducer(mockState, dispatchedAction);
    }
    expect(dispatchedActions).toMatchSnapshot();
    expect(mockState).toMatchSnapshot();
    expect(payload).toEqual(data.data);
  });
});
