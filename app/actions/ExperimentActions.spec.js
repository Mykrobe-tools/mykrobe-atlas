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
        .get('/api/experiments')
        .reply(200, data);

      const expectedActions = [
        { type: 'REQUEST_EXPERIMENTS', filters: {} },
        { type: 'RECEIVE_EXPERIMENTS', data },
      ];

      jest.useFakeTimers();
      return store.dispatch(ExperimentActions.fetchExperiments()).then(() => {
        jest.runAllTimers();
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should create an empty "RECEIVE_EXPERIMENTS" action on API error', () => {
      const store = mockStore({});
      nock(BASE_URL)
        .get('/api/experiments')
        .replyWithError({ message: 'Something went wrong' });

      const expectedAction = { type: 'RECEIVE_EXPERIMENTS', data: [] };

      return store.dispatch(ExperimentActions.fetchExperiments()).then(() => {
        expect(store.getActions()).toContainEqual(expectedAction);
      });
    });
  });
});
