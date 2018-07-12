/* @flow */

import { createSelector } from 'reselect';

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
    node,
    highlighted,
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

export default function reducer(
  state: Object = initialState,
  action: Object = {}
) {
  switch (action.type) {
    case SET_NODE_HIGHLIGHTED: {
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
    }
    case UNSET_NODE_HIGHLIGHTED_ALL:
      return initialState;
    default:
      return state;
  }
}

// Side effects
