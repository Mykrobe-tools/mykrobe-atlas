/* @flow */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import { fetchJsonMiddleware } from '../api';
import { BASE_URL } from '../../constants/APIConstants.js';

import reducer, { initialState, requestExperiments } from './experiments';

const createMockStore = configureMockStore([thunk, fetchJsonMiddleware]);
const data = require('../../../test/__fixtures__/api/experiments.json');

describe('experiments module', () => {
  const store = createMockStore(initialState);
  let mockState;

  beforeEach(() => {
    store.clearActions();
    nock.cleanAll();
  });

  it('should handle "requestExperiments" action', async () => {
    nock(BASE_URL)
      .get('/experiments/search')
      .query(true)
      .reply(200, data);
    const payload = await store.dispatch(requestExperiments());
    const dispatchedActions = store.getActions();
    dispatchedActions.forEach(dispatchedAction => {
      mockState = reducer(mockState, dispatchedAction);
    });
    expect(dispatchedActions).toMatchSnapshot();
    expect(mockState).toMatchSnapshot();
    expect(payload).toEqual(data.data);
  });
});
