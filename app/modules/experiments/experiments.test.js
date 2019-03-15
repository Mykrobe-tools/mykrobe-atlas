/* @flow */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import { ensureEnv, env } from 'makeandship-js-common/src/util';
const API_URL = ensureEnv(env.API_URL);

import reducer, { requestExperiments } from './experiments';

const createMockStore = configureMockStore([thunk]);
const data = require('../../../test/__fixtures__/api/experiments.json');

describe('experiments module', () => {
  const store = createMockStore([]);
  let mockState;

  beforeEach(() => {
    store.clearActions();
    nock.cleanAll();
  });

  it('should handle "requestExperiments" action', async () => {
    nock(API_URL)
      .get('/experiments/search')
      .query(true)
      .reply(200, data);
    store.dispatch(requestExperiments());
    const dispatchedActions = store.getActions();
    dispatchedActions.forEach(dispatchedAction => {
      mockState = reducer(mockState, dispatchedAction);
    });
    expect(dispatchedActions).toMatchSnapshot();
    expect(mockState).toMatchSnapshot();
  });
});
