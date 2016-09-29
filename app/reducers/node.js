import * as ActionTypes from 'constants/ActionTypes';

const initialState = {
  highlighted: []
};

export default function analyser(state = initialState, action = {}) {
  switch (action.type) {
    case ActionTypes.SET_NODE_HIGHLIGHTED:
      // clone the current array
      let highlighted = state.highlighted.slice();
      if ( action.highlighed ) {
        highlighted = highlighted.concat(action.node);
      }
      else {
        const index = highlighted.indexOf(action.node);
        if ( -1 !== index ) {
          highlighted.splice(index,1);
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
