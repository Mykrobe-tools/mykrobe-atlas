/* @flow */

import * as ActionTypes from '../constants/ActionTypes';
// import * as NotificationCategories from '../constants/NotificationCategories';

const initialState = [];

// const initialState = [
//   {
//     id: 0,
//     category: NotificationCategories.SUCCESS,
//     content: 'Lorem',
//     autoHide: true,
//   },
//   {
//     id: 1,
//     category: NotificationCategories.MESSAGE,
//     content: 'Ipsum',
//     autoHide: true,
//   },
//   {
//     id: 2,
//     category: NotificationCategories.ERROR,
//     content:
//       'This sample does not appear to contain any Mycobacterial data (or it is amplicon data, which is not supported), and therefore the predictor does not give susceptibility predictions',
//     autoHide: false,
//   },
// ];

export default function notifications(
  state: Array<any> = initialState,
  action: Object = {}
) {
  switch (action.type) {
    case ActionTypes.SHOW_NOTIFICATION: {
      const { id, category, content, autoHide } = action;
      let notification = {
        id,
        category,
        content,
        autoHide,
      };
      return [...state, notification];
    }

    case ActionTypes.HIDE_NOTIFICATION:
      return state.filter(notification => {
        return notification.id !== action.id;
      });
    case ActionTypes.HIDE_ALL_NOTIFICATIONS:
      return initialState;
    default:
      return state;
  }
}
