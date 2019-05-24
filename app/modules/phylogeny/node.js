/* @flow */

import { createSelector } from 'reselect';
import produce from 'immer';

export const typePrefix = 'phylogeny/node/';
export const SET_NODE_HIGHLIGHTED = `${typePrefix}SET_NODE_HIGHLIGHTED`;
export const UNSET_NODE_HIGHLIGHTED_ALL = `${typePrefix}UNSET_NODE_HIGHLIGHTED_ALL`;

// Selectors

export const getState = (state: any) => state.phylogeny.node;

export const getHighlighted = createSelector(
  getState,
  node => node.highlighted
);

// Action creators

export function setNodeHighlighted(node: string, highlighted: boolean) {
  return {
    type: SET_NODE_HIGHLIGHTED,
    payload: {
      node,
      highlighted,
    },
  };
}

export function unsetNodeHighlightedAll() {
  return {
    type: UNSET_NODE_HIGHLIGHTED_ALL,
  };
}

// Reducer

const initialState = {
  highlighted: [],
};

const reducer = (state?: State = initialState, action?: Object = {}): State =>
  produce(state, draft => {
    switch (action.type) {
      case SET_NODE_HIGHLIGHTED: {
        const { node, highlighted } = action.payload;
        if (highlighted) {
          if (!draft.highlighted.includes(node)) {
            draft.highlighted.push(node);
          }
        } else {
          if (draft.highlighted.includes(node)) {
            draft.highlighted.splice(
              draft.highlighted.findIndex(id => id === node),
              1
            );
          }
        }
        return;
      }
      case UNSET_NODE_HIGHLIGHTED_ALL:
        return initialState;
      default:
        return;
    }
  });

export default reducer;

// Side effects
