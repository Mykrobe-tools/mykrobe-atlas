/* @flow */

import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  highlighted: [],
};

export default function analyser(
  state: Object = initialState,
  action: Object = {}
) {
  switch (action.type) {
    case ActionTypes.SET_NODE_HIGHLIGHTED:
      // clone the current array
      let highlighted = state.highlighted.slice();
      const index = highlighted.indexOf(action.node);
      if (action.highlighted) {
        if (index === -1) {
          highlighted = highlighted.concat(action.node);
        }
      } else {
        if (index !== -1) {
          highlighted.splice(index, 1);
        }
        if (highlighted.length !== 0) {
          console.log(highlighted);
        }
      }
      return {
        ...state,
        highlighted,
      };
    case ActionTypes.UNSET_NODE_HIGHLIGHTED_ALL:
      return initialState;
    default:
      return state;
  }
}
