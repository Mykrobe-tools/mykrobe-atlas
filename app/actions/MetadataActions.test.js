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
        .put('/experiments/1')
        .reply(200, { status: 'ok' });
      jest.useFakeTimers();
      return store
        .dispatch(MetadataActions.postMetadataForm(1, {}))
        .then(() => {
          jest.runAllTimers();
          expect(store.getActions()).toMatchSnapshot();
        });
    });
  });

  describe('setMetadata', () => {
    it('should create a "SET_METADATA" action', () => {
      const metadata = {
        lorem: 'ipsum',
      };
      const expectedAction = {
        type: 'SET_METADATA',
        metadata,
      };
      expect(MetadataActions.setMetadata(metadata)).toEqual(expectedAction);
    });
  });
});
