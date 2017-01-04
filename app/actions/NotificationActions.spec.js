import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as NotificationActions from './NotificationActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('NotificationActions', () => {
  describe('showNotification', () => {
    const store = mockStore({});
    it('should create a "SHOW_NOTIFICATION"', () => {
      const values = {
        category: 'category',
        content: 'lorem ipsum',
        autoHide: false
      };
      const expectedActions = [{
        type: 'SHOW_NOTIFICATION',
        id: 0,
        category: 'category',
        content: 'lorem ipsum',
        autoHide: false
      }];
      store.dispatch(NotificationActions.showNotification(values));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create a "SHOW_NOTIFICATION" with autoHide', () => {
      const values = {
        category: 'category',
        content: 'lorem ipsum',
        autoHide: true
      };
      const expectedActions = [{
        type: 'SHOW_NOTIFICATION',
        id: 1,
        category: 'category',
        content: 'lorem ipsum',
        autoHide: true
      }, {
        type: 'HIDE_NOTIFICATION',
        id: 1
      }];

      jest.useFakeTimers();

      const store = mockStore({});
      store.dispatch(NotificationActions.showNotification(values));

      jest.runAllTimers();

      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('hideNotification', () => {
    const store = mockStore({});
    it('should create a "HIDE_NOTIFICATION" action', () => {
      const id = 0;
      const expectedActions = [{
        type: 'HIDE_NOTIFICATION',
        id: 0
      }];
      store.dispatch(NotificationActions.hideNotification(id));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('hideAllNotifications', () => {
    const store = mockStore({});
    it('should create a "HIDE_ALL_NOTIFICATIONS" action', () => {
      const expectedActions = [{
        type: 'HIDE_ALL_NOTIFICATIONS'
      }];
      store.dispatch(NotificationActions.hideAllNotifications());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
