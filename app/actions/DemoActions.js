/* @flow */

import * as ActionTypes from '../constants/ActionTypes'
import fetch from 'isomorphic-fetch'
import { BASE_URL } from '../constants/APIConstants'

export function loadTreeWithPath (filePath: string) {
  return (dispatch: Function, getState: Function) => {
    dispatch(loadTree(filePath))
    return fetch(`${BASE_URL}/demo/${filePath}`)
    .then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch(loadTreeSuccess(json))
        })
      } else {
        return Promise.reject(response.statusText)
      }
    })
  }
}

function loadTree (filePath) {
  return {
    type: ActionTypes.LOAD_TREE,
    filePath
  }
}

function loadTreeSuccess (json) {
  return {
    type: ActionTypes.LOAD_TREE_SUCCESS,
    json
  }
}

export function loadSamplesWithPath (filePath: string) {
  return (dispatch: Function, getState: Function) => {
    dispatch(loadSamples(filePath))
    return fetch(`${BASE_URL}/demo/${filePath}`)
    .then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch(loadSamplesSuccess(json))
        })
      } else {
        return Promise.reject(response.statusText)
      }
    })
  }
}

function loadSamples (filePath) {
  return {
    type: ActionTypes.LOAD_SAMPLES,
    filePath
  }
}

function loadSamplesSuccess (json) {
  return {
    type: ActionTypes.LOAD_SAMPLES_SUCCESS,
    json
  }
}
