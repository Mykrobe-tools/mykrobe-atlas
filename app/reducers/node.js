import * as ActionTypes from 'constants/ActionTypes';

const initialState = {
  highlighted: []
};

export default function analyser(state = initialState, action = {}) {
  switch (action.type) {
    case ActionTypes.SET_NODE_HIGHLIGHTED:
      // clone the current array
      let highlighted = state.highlighted.slice();
      const index = highlighted.indexOf(action.node);
      if ( action.highlighted ) {
        if ( -1 === index ) {
          highlighted = highlighted.concat(action.node);
        }
      }
      else {
        if ( -1 !== index ) {
          highlighted.splice(index,1);
        }
        if ( 0 !== highlighted.length ) {
          debugger
        }
      }
      return {
        ...state,
        highlighted
      };
    case ActionTypes.UNSET_NODE_HIGHLIGHTED_ALL:
      return initialState;
    default:
      return state;
  }
}
