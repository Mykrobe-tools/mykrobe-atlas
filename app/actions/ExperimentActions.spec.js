import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { BASE_URL } from '../constants/APIConstants';
import * as ExperimentActions from './ExperimentActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const data = require('../../test/_fixtures/api/experiments.json');

describe('ExperimentActions', () => {
  afterEach(() => {
    nock.cleanAll();
  });
  describe('fetchExperiments', () => {
    it('should create a "RECEIVE_EXPERIMENTS" action', () => {
      const store = mockStore({});
      nock(BASE_URL)
        .get('/experiments/search')
        .query(true)
        .reply(200, data);

      const expectedActions = [
        { type: 'REQUEST_EXPERIMENTS' },
        { type: 'RECEIVE_EXPERIMENTS', data: data.data },
      ];

      jest.useFakeTimers();
      return store
        .dispatch(ExperimentActions.fetchExperiments())
        .then(() => {
          jest.runAllTimers();
          expect(store.getActions()).toEqual(expectedActions);
        })
        .catch(error => {
          console.error(error);
        });
    });

    it('should create an empty "RECEIVE_EXPERIMENTS" action on API error', () => {
      const store = mockStore({});
      const replyError = { message: 'Something went wrong' };
      nock(BASE_URL)
        .get('/experiments/search')
        .query(true)
        .replyWithError(replyError);

      const expectedAction = {
        type: 'RECEIVE_EXPERIMENTS',
        data: {
          results: [],
          summary: { hits: 0 },
        },
      };

      return store.dispatch(ExperimentActions.fetchExperiments()).catch(() => {
        expect(store.getActions()).toContainEqual(expectedAction);
      });
    });
  });
});
