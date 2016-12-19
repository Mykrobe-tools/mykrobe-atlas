import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  tree: {
    newick: ''
  },
  samples: {}
};

export default function analyser(state = initialState, action = {}) {
  switch (action.type) {
    case ActionTypes.LOAD_TREE_SUCCESS:
      return {
        ...state,
        tree: action.json
      };
    case ActionTypes.LOAD_SAMPLES_SUCCESS:
      return {
        ...state,
        samples: action.json
      };
    default:
      return state;
  }
}
