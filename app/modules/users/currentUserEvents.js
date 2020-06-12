/* @flow */

import { channel } from 'redux-saga';
import {
  all,
  fork,
  takeEvery,
  takeLatest,
  select,
  put,
  take,
} from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { EventSourcePolyfill } from 'event-source-polyfill';

import {
  getAccessToken,
  getIsAuthenticated,
} from 'makeandship-js-common/src/modules/auth';
import { waitForChange } from 'makeandship-js-common/src/modules/util';

export const typePrefix = 'users/currentUserEvents/';

export const EVENT = `${typePrefix}EVENT`;
export const ERROR = `${typePrefix}ERROR`;
export const START = `${typePrefix}START`;
export const STOP = `${typePrefix}STOP`;
export const STARTED = `${typePrefix}STARTED`;
export const STOPPED = `${typePrefix}STOPPED`;

export const UPLOAD_PROGRESS = `${typePrefix}UPLOAD_PROGRESS`;
export const UPLOAD_COMPLETE = `${typePrefix}UPLOAD_COMPLETE`;
export const UPLOAD_THIRD_PARTY_PROGRESS = `${typePrefix}UPLOAD_THIRD_PARTY_PROGRESS`;
export const UPLOAD_THIRD_PARTY_DONE = `${typePrefix}UPLOAD_THIRD_PARTY_DONE`;

export const ANALYSIS_STARTED = `${typePrefix}ANALYSIS_STARTED`;
export const ANALYSIS_COMPLETE = `${typePrefix}ANALYSIS_COMPLETE`;

export const PROTEIN_VARIANT_SEARCH_STARTED = `${typePrefix}PROTEIN_VARIANT_SEARCH_STARTED`;
export const PROTEIN_VARIANT_SEARCH_COMPLETE = `${typePrefix}PROTEIN_VARIANT_SEARCH_COMPLETE`;

export const SEQUENCE_SEARCH_STARTED = `${typePrefix}SEQUENCE_SEARCH_STARTED`;
export const SEQUENCE_SEARCH_COMPLETE = `${typePrefix}SEQUENCE_SEARCH_COMPLETE`;

const _eventSourceChannel = channel();
let _eventSource;

// Actions

export const event = (payload: any) => ({
  type: EVENT,
  payload,
});

export const error = (payload: any) => ({
  type: ERROR,
  payload,
});

export const start = () => ({
  type: START,
});

export const stop = () => ({
  type: STOP,
});

export const started = () => ({
  type: STARTED,
});

export const stopped = () => ({
  type: STOPPED,
});

// take emitted events, put actions into channel
// then send those into the main channel

export function* eventSourceChannelWatcher(): Saga {
  while (true) {
    const action = yield take(_eventSourceChannel);
    yield put(action);
  }
}

// start when authenticated; stop when not

function* startStopWatcher() {
  while (true) {
    const isAuthenticated = yield select(getIsAuthenticated);
    if (!isAuthenticated) {
      yield waitForChange(getIsAuthenticated);
    }
    yield put(start());
    yield waitForChange(getIsAuthenticated);
    yield put(stop());
  }
}

function* startWatcher() {
  yield takeLatest(START, startWorker);
}

function* startWorker() {
  // don't start multiple sources
  if (_eventSource) {
    return;
  }

  // don't start unless authenticated
  const isAuthenticated = yield select(getIsAuthenticated);
  if (!isAuthenticated) {
    return;
  }

  const options = {
    heartbeatTimeout: 2147483647, // TODO: replace with sensible value once ping implemented in API
  };

  const accessToken = yield select(getAccessToken);
  if (accessToken) {
    if (!options.headers) {
      options.headers = {};
    }
    options.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  console.log({ options });

  // TODO construct this with Swagger operation id
  try {
    _eventSource = new EventSourcePolyfill(
      `${window.env.REACT_APP_API_URL}/user/events`,
      options
    );
  } catch (error) {
    console.log(`Couldn't start event source`, error);
  }
  /* Example messages
  "{"id":"5b7eb595ed9f300010167cfa","complete":"99.03…,"file":"MDR.fastq.gz","event":"Upload progress"}"
  "{"id":"5b7eb595ed9f300010167cfa","complete":"100.0…,"file":"MDR.fastq.gz","event":"Upload complete"}"
  "{"id":"5b7eb595ed9f300010167cfa","taskId":"ab5e8f36-72be-40f2-928b-cdb93d8512a3","file":"/atlas/uploads/experiments/5b7eb595ed9f300010167cfa/file/MDR.fastq.gz","event":"Analysis started"}"
  "{"id":"5b7eb595ed9f300010167cfa","taskId":"ab5e8f3…depth","externalId":"5b7eb595ed9f300010167cfa"}]}"

  */
  if (!_eventSource) {
    return;
  }
  _eventSource.onmessage = (e) => {
    try {
      const json = JSON.parse(e.data);
      _eventSourceChannel.put(event(json));
    } catch (error) {
      console.log(`Couldn't parse event data`, e.data);
    }
  };
  _eventSource.onerror = (e) => {
    console.log('EventSource failed.', e);
    _eventSourceChannel.put(error(e));
  };
  yield put(started());
}

function* stopWatcher() {
  yield takeLatest(STOP, stopWorker);
}

function* stopWorker() {
  _eventSource && _eventSource.close();
  _eventSource = null;
  yield put(stopped());
}

function* eventWatcher() {
  yield takeEvery(EVENT, eventWorker);
}

/*
complete
:
"3.39"
event
:
"Upload via 3rd party progress"
file
:
"MDR.fastq.gz"
id
:
"5b9250558281dd0010bef39c"
provider
:
"dropbox"
size
:
7388483
totalSize
:
217685411
*/
function* eventWorker(action: any) {
  const {
    payload,
    payload: { event },
  } = action;
  if (event === 'Upload progress') {
    yield put({
      type: UPLOAD_PROGRESS,
      payload,
    });
  } else if (event === 'Upload via 3rd party progress') {
    yield put({
      type: UPLOAD_THIRD_PARTY_PROGRESS,
      payload,
    });
  } else if (event === 'Upload complete') {
    yield put({
      type: UPLOAD_COMPLETE,
      payload,
    });
  } else if (event === 'Upload via 3rd party complete') {
    yield put({
      type: UPLOAD_THIRD_PARTY_DONE,
      payload,
    });
  } else if (event === 'Analysis started') {
    yield put({
      type: ANALYSIS_STARTED,
      payload,
    });
  } else if (event === 'Analysis complete') {
    yield put({
      type: ANALYSIS_COMPLETE,
      payload,
    });
  } else if (event === 'Protein variant search started') {
    yield put({
      type: PROTEIN_VARIANT_SEARCH_STARTED,
      payload,
    });
  } else if (event === 'Protein variant search complete') {
    yield put({
      type: PROTEIN_VARIANT_SEARCH_COMPLETE,
      payload,
    });
  } else if (event === 'Sequence search started') {
    yield put({
      type: SEQUENCE_SEARCH_STARTED,
      payload,
    });
  } else if (event === 'Sequence search complete') {
    yield put({
      type: SEQUENCE_SEARCH_COMPLETE,
      payload,
    });
  } else {
    console.warn('Unhandled event payload:', payload);
  }
}

export function* currentUserEventsSaga(): Saga {
  yield all([
    fork(eventSourceChannelWatcher),
    fork(startStopWatcher),
    fork(startWatcher),
    fork(stopWatcher),
    fork(eventWatcher),
  ]);
}
