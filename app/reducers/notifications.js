import * as ActionTypes from 'constants/ActionTypes';

const initialState = [];

export default function notifications(state = initialState, action = {}) {
  switch (action.type) {
    case ActionTypes.SHOW_NOTIFICATION:
      const {id, category, content, autoHide} = action;
      let notification = {
        id,
        category,
        content,
        autoHide
      }
      return [...state, notification];

    case ActionTypes.HIDE_NOTIFICATION:
      return state.filter(notification => {
	      return notification.id !== action.id
      });
    case ActionTypes.HIDE_ALL_NOTIFICATIONS:
      return [];
    default:
      return state;
  }
}
