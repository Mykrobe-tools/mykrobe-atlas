/* @flow */

import { put, all, fork, takeLatest } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { createSelector } from 'reselect';
import { push } from 'connected-react-router';

import { createEntityModule } from 'makeandship-js-common/src/modules/generic';
import { callSwaggerApi } from 'makeandship-js-common/src/modules/api/swaggerApi';

import { showNotification } from '../notifications';
import { getCurrentUser } from '../../modules/users/currentUser';

export const typePrefix = 'organisations/organisation/';

const module = createEntityModule('organisation', {
  typePrefix,
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
  actionTypes: organisationActionTypes,
  actions: {
    newEntity,
    createEntity,
    requestEntity,
    updateEntity,
    deleteEntity,
  },
  selectors: { getEntity: getOrganisation, getError, getIsFetching },
  sagas: { entitySaga: organisationModuleSaga },
} = module;

// Membership

// selectors

/*
data {
  "owners": [
    {
      "userId": "5e16e71654559200114c24a4",
      "firstname": "Simon",
      "lastname": "Heys",
      "email": "simon@makeandship.com",
      "username": "simon@makeandship.com",
      "id": "5e1c5a433c68a70011bdd322"
    }
  ],
  "members": [],
  "unapprovedMembers": [
    {
      "userId": "5e16e71654559200114c24a4",
      "firstname": "Simon",
      "lastname": "Heys",
      "email": "simon@makeandship.com",
      "username": "simon@makeandship.com",
      "id": "5e1c5a673c68a70011bdd324"
    }
  ],
  "rejectedMembers": [],
  "name": "Test",
  "slug": "test",
  "membersGroupId": "08ed0283-9314-432b-8193-c927f92f2975",
  "ownersGroupId": "d158fbad-0e32-4ac6-8469-b46c5ba3ecb2",
  "id": "5e1c5a433c68a70011bdd321"
}
*/

export const getCurrentUserIsOrganisationOwner = createSelector(
  getOrganisation,
  getCurrentUser,
  (organisation, currentUser) => {
    if (!organisation || !currentUser) {
      return false;
    }
    return organisation.owners.find(
      element => element.userId === currentUser.id
    );
  }
);

// actions

export const JOIN = `${typePrefix}JOIN`;
export const JOIN_REQUEST = `${typePrefix}JOIN_REQUEST`;
export const JOIN_SUCCESS = `${typePrefix}JOIN_SUCCESS`;
export const JOIN_FAILURE = `${typePrefix}JOIN_FAILURE`;

export const joinOrganisation = (payload?: any) => ({
  type: JOIN,
  payload,
});

export function* joinOrganisationWatcher(): Saga {
  const types = [JOIN_REQUEST, JOIN_SUCCESS, JOIN_FAILURE];
  yield takeLatest(JOIN, function*(action) {
    yield put(
      callSwaggerApi({
        operationId: 'joinOrganisation',
        parameters: action.payload,
        types,
      })
    );
  });
}

export function* organisationSaga(): Saga {
  yield all([fork(organisationModuleSaga), fork(joinOrganisationWatcher)]);
}

export {
  organisationActionTypes,
  newEntity as newOrganisation,
  createEntity as createOrganisation,
  requestEntity as requestOrganisation,
  updateEntity as updateOrganisation,
  deleteEntity as deleteOrganisation,
  getOrganisation,
  getError,
  getIsFetching,
};

export default reducer;
