import * as ActionTypes from 'constants/ActionTypes';

const initialState = {
  tree: []
};

export default function analyser(state = initialState, action = {}) {
  switch (action.type) {
    case ActionTypes.LOAD_TREE_SUCCESS:
      return {
        ...state,
        tree: action.json
      };
    default:
      return state;
  }
}
