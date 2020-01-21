/* @flow */

import { put } from 'redux-saga/effects';

import { createEntityModule } from 'makeandship-js-common/src/modules/generic';

import { showNotification } from '../notifications';

export const typePrefix = 'organisations/organisation/';

const module = createEntityModule('organisation', {
  typePrefix,
  getState: state => state.organisations.organisation,
  create: {
    operationId: 'organisationsCreate',
    onSuccess: function*() {
      yield put(showNotification('Organisation created'));
    },
  },
  request: {
    operationId: 'organisationsGetById',
  },
  update: {
    operationId: 'organisationsUpdateById',
    onSuccess: function*() {
      yield put(showNotification('Organisation saved'));
    },
  },
  delete: {
    operationId: 'organisationsDeleteById',
    onSuccess: function*() {
      yield put(showNotification('Organisation deleted'));
    },
  },
});

const {
  reducer,
  actionTypes: organisationActionTypes,
  actions: {
    newEntity: newOrganisation,
    createEntity: createOrganisation,
    requestEntity: requestOrganisation,
    updateEntity: updateOrganisation,
    deleteEntity: deleteOrganisation,
    setEntity: setOrganisation,
  },
  selectors: {
    getEntity: getOrganisation,
    getError: getOrganisationError,
    getIsFetching: getOrganisationIsFetching,
  },
  sagas: { entitySaga: organisationSaga },
} = module;

export {
  organisationActionTypes,
  newOrganisation,
  createOrganisation,
  requestOrganisation,
  updateOrganisation,
  deleteOrganisation,
  setOrganisation,
  getOrganisation,
  getOrganisationError,
  getOrganisationIsFetching,
  organisationSaga,
};

export default reducer;
