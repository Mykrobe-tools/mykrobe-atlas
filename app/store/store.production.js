/* @flow */

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { browserHistory, hashHistory } from 'react-router-dom';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';

const router = routerMiddleware(IS_ELECTRON ? hashHistory : browserHistory);

const enhancer = applyMiddleware(thunk, router);

const store = createStore(rootReducer, enhancer);
export default store;
