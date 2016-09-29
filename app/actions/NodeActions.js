import * as ActionTypes from 'constants/ActionTypes';

export function setNodeHighlighted(node, highlighted) {
  return {
    type: ActionTypes.SET_NODE_HIGHLIGHTED,
    node,
    highlighted
  };
}

export function unsetNodeHighlightedAll() {
  return {
    type: ActionTypes.UNSET_NODE_HIGHLIGHTED_ALL
  };
}
