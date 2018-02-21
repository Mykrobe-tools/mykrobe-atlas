/* @flow */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import { fetchJsonMiddleware } from '../api';
import { BASE_URL } from '../../constants/APIConstants.js';

import reducer, {
  initialState,
  fetchFilterValues,
  getFilterValues,
} from './filters';

const createMockStore = configureMockStore([thunk, fetchJsonMiddleware]);
const data = require('../../../test/__fixtures__/api/filters.json');

describe('filters module', () => {
  const store = createMockStore(initialState);
  let mockState;

  beforeEach(() => {
    store.clearActions();
    nock.cleanAll();
  });

  it('should handle "fetchFilterValues" action', async () => {
    nock(BASE_URL)
      .get('/experiments/metadata/whoOutcomeCategory/values')
      .reply(200, data);
    const payload = await store.dispatch(
      fetchFilterValues('whoOutcomeCategory')
    );
    const dispatchedActions = store.getActions();
    dispatchedActions.forEach(dispatchedAction => {
      mockState = reducer(mockState, dispatchedAction);
    });
    expect(dispatchedActions).toMatchSnapshot();
    expect(mockState).toMatchSnapshot();
    expect(payload).toEqual(data.data);
    expect(
      getFilterValues({ experiments: { filters: mockState } })
    ).toMatchSnapshot();
  });
});
