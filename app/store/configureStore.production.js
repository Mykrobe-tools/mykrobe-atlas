/* @flow */

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { browserHistory, hashHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import rootReducer from '../reducers'

const router = routerMiddleware(IS_ELECTRON ? hashHistory : browserHistory)

const enhancer = applyMiddleware(thunk, router)

export default function configureStore (initialState: Object) {
  return createStore(rootReducer, initialState, enhancer)
}
