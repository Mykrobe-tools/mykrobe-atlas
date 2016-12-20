import reducer from './notifications';
import * as ActionTypes from '../constants/ActionTypes';

describe('notifications reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, [])).toEqual([]);
  });

  it('should handle "SHOW_NOTIFICATION" action', () => {
    expect(
      reducer(undefined, {
        type: ActionTypes.SHOW_NOTIFICATION,
        id: 0,
        category: 'Lorem',
        content: 'Ipsum',
        autoHide: true
      })
    ).toEqual(
      [{
        id: 0,
        category: 'Lorem',
        content: 'Ipsum',
        autoHide: true
      }]
    );
  });

  it('should handle "HIDE_NOTIFICATION" action', () => {
    const initialState = [
      {
        id: 0,
        category: 'lorem',
        content: 'Lorem',
        autoHide: true
      },
      {
        id: 1,
        category: 'ipsum',
        content: 'Ipsum',
        autoHide: true
      },
      {
        id: 2,
        category: 'dolor',
        content: 'Dolor Sit Amet',
        autoHide: false
      }
    ];
    const expectedState = [
      {
        id: 0,
        category: 'lorem',
        content: 'Lorem',
        autoHide: true
      },
      {
        id: 2,
        category: 'dolor',
        content: 'Dolor Sit Amet',
        autoHide: false
      }
    ];
    expect(
      reducer(initialState, {
        type: ActionTypes.HIDE_NOTIFICATION,
        id: 1
      })
    ).toEqual(
      expectedState
    );
  });

  it('should handle "HIDE_ALL_NOTIFICATIONS" action', () => {
    const initialState = [
      {
        id: 0,
        category: 'lorem',
        content: 'Lorem',
        autoHide: true
      },
      {
        id: 1,
        category: 'ipsum',
        content: 'Ipsum',
        autoHide: true
      },
      {
        id: 2,
        category: 'dolor',
        content: 'Dolor Sit Amet',
        autoHide: false
      }
    ];
    expect(
      reducer(initialState, {
        type: ActionTypes.HIDE_ALL_NOTIFICATIONS
      })
    ).toEqual(
      []
    );
  });
});
