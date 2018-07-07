/* @flow */

// provide fetch() method while running jest in Node
import 'isomorphic-fetch';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import { FETCH_JSON, fetchJsonMiddleware } from './fetchJsonMiddleware';
import { API_URL } from '../../constants/APIConstants.js';
import { SIGNOUT } from 'makeandship-js-common/src/modules/auth/auth';

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

const createMockStore = configureMockStore([thunk, fetchJsonMiddleware]);

const initialState = {
  auth: {
    auth: {
      token: {
        accessToken: 'MOCK_AUTH_TOKEN_FOR_TESTING',
      },
    },
  },
};

const debug = true;

describe('fetchJsonMiddleware', () => {
  const store = createMockStore(initialState);

  beforeEach(() => {
    store.clearActions();
    nock.cleanAll();
  });

  it('should handle basic GET request and resolve as promise', async () => {
    const meta = { test: true };
    const payload = { test: true };
    nock(API_URL)
      .get('/test/fetchJsonMiddleware')
      .reply(200, { status: 'success', data: payload });
    const result = await store.dispatch({
      [FETCH_JSON]: {
        url: `${API_URL}/test/fetchJsonMiddleware`,
        types: [{ type: REQUEST, meta }, SUCCESS, FAILURE],
        debug,
      },
    });
    const dispatchedActions = store.getActions();
    console.log(
      'dispatchedActions',
      JSON.stringify(dispatchedActions, null, 2)
    );
    expect(dispatchedActions[0].type).toEqual(REQUEST);
    expect(dispatchedActions[0].meta).toEqual(meta);
    expect(dispatchedActions[1].type).toEqual(SUCCESS);
    expect(dispatchedActions[1].payload).toEqual(payload);
    expect(result).toEqual(payload);
  });

  it('should reject empty response', async () => {
    nock(API_URL)
      .get('/test/fetchJsonMiddleware')
      .reply(200);
    try {
      await store.dispatch({
        [FETCH_JSON]: {
          url: `${API_URL}/test/fetchJsonMiddleware`,
          types: [REQUEST, SUCCESS, FAILURE],
          debug,
        },
      });
    } catch (error) {
      expect(error.name).toEqual('FetchJsonError');
      const dispatchedActions = store.getActions();
      console.log(
        'dispatchedActions',
        JSON.stringify(dispatchedActions, null, 2)
      );
      expect(dispatchedActions[0].type).toEqual(REQUEST);
      expect(dispatchedActions[1].type).toEqual(FAILURE);
    }
  });

  it('should reject non-jsend response', async () => {
    nock(API_URL)
      .get('/test/fetchJsonMiddleware')
      .reply(200, { data: { test: true } });
    try {
      await store.dispatch({
        [FETCH_JSON]: {
          url: `${API_URL}/test/fetchJsonMiddleware`,
          types: [REQUEST, SUCCESS, FAILURE],
          debug,
        },
      });
    } catch (error) {
      expect(error.name).toEqual('FetchJsonError');
      const dispatchedActions = store.getActions();
      console.log(
        'dispatchedActions',
        JSON.stringify(dispatchedActions, null, 2)
      );
      expect(dispatchedActions[0].type).toEqual(REQUEST);
      expect(dispatchedActions[1].type).toEqual(FAILURE);
    }
  });

  it('should sign out if unauthorized', async () => {
    nock(API_URL)
      .get('/test/fetchJsonMiddleware')
      .reply(401);
    try {
      await store.dispatch({
        [FETCH_JSON]: {
          url: `${API_URL}/test/fetchJsonMiddleware`,
          types: [REQUEST, SUCCESS, FAILURE],
          debug,
        },
      });
    } catch (error) {
      expect(error.name).toEqual('FetchJsonError');
      const dispatchedActions = store.getActions();
      console.log(
        'dispatchedActions',
        JSON.stringify(dispatchedActions, null, 2)
      );
      expect(dispatchedActions[0].type).toEqual(REQUEST);
      expect(dispatchedActions[1].type).toEqual(SIGNOUT);
      expect(dispatchedActions[2].type).toEqual(FAILURE);
    }
  });
});
