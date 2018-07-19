/* @flow */

import { put } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { createEntityModule } from 'makeandship-js-common/src/modules/generic';

import { showNotification } from '../notifications';

const module = createEntityModule('organisation', {
  typePrefix: 'organisations/organisation/',
  getState: state => state.organisations.organisation,
  create: {
    operationId: 'organisationsCreate',
    onSuccess: function*() {
      yield put(showNotification('Organisation created'));
      yield put(push(`/organisations`));
    },
  },
  request: {
    operationId: 'organisationsGetById',
  },
  update: {
    operationId: 'organisationsUpdateById',
    onSuccess: function*() {
      yield put(showNotification('Organisation saved'));
      yield put(push(`/organisations`));
    },
  },
  delete: {
    operationId: 'organisationsDeleteById',
    onSuccess: function*() {
      yield put(showNotification('Organisation deleted'));
      yield put(push('/organisations'));
    },
  },
});

const {
  reducer,
  actionType,
  actions: {
    newEntity,
    createEntity,
    requestEntity,
    updateEntity,
    deleteEntity,
  },
  selectors: { getEntity, getError, getIsFetching },
  sagas: { entitySaga },
} = module;

export {
  actionType as organisationActionType,
  newEntity as newOrganisation,
  createEntity as createOrganisation,
  requestEntity as requestOrganisation,
  updateEntity as updateOrganisation,
  deleteEntity as deleteOrganisation,
  getEntity as getOrganisation,
  getError,
  getIsFetching,
  entitySaga as organisationSaga,
};

export default reducer;
