import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { BASE_URL } from '../constants/APIConstants';
import * as MetadataActions from './MetadataActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('MetadataActions', () => {
  afterEach(() => {
    nock.cleanAll();
  });
  describe('postMetadataForm', () => {
    it('should create a "POST_METADATA_FORM" action', () => {
      const store = mockStore({});
      nock(BASE_URL)
        .put('/api/experiments/1')
        .reply(200, {status: 'ok'});
      const expectedActions = [
        {
          type: 'POST_METADATA_FORM'
        },
        {
          'autoHide': true,
          'category': 'SUCCESS',
          'content': 'Metadata saved',
          'id': 0,
          'type': 'SHOW_NOTIFICATION'
        },
        {
          'id': 0,
          'type': 'HIDE_NOTIFICATION'
        }
      ];
      jest.useFakeTimers();
      return store.dispatch(MetadataActions.postMetadataForm({}))
        .then(() => {
          jest.runAllTimers();
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });

  describe('setMetadata', () => {
    it('should create a "SET_METADATA" action', () => {
      const metadata = {
        lorem: 'ipsum'
      };
      const expectedAction = {
        type: 'SET_METADATA',
        metadata
      };
      expect(MetadataActions.setMetadata(metadata)).toEqual(expectedAction);
    });
  });
});
