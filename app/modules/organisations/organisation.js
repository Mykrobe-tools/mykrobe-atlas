/* @flow */

import { put, all, fork, takeLatest } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { createSelector } from 'reselect';
import { push } from 'connected-react-router';
import _find from 'lodash.find';

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
  selectors: {
    getEntity: getOrganisation,
    getError: getOrganisationError,
    getIsFetching: getOrganisationIsFetching,
  },
  sagas: { entitySaga: organisationModuleSaga },
} = module;

// Membership

// selectors

export const organisationUserIsOwner = (organisation: any, user: any) =>
  organisation &&
  user &&
  !!organisation.owners.find(element => element.userId === user.id);

export const organisationUserIsMember = (organisation: any, user: any) =>
  organisation &&
  user &&
  !!organisation.members.find(element => element.userId === user.id);

export const organisationUserIsUnapprovedMember = (
  organisation: any,
  user: any
) =>
  organisation &&
  user &&
  !!organisation.unapprovedMembers.find(element => element.userId === user.id);

export const organisationUserIsRejectedMember = (
  organisation: any,
  user: any
) =>
  organisation &&
  user &&
  !!organisation.rejectedMembers.find(element => element.userId === user.id);

export const getOrganisationCurrentUserIsOwner = createSelector(
  getOrganisation,
  getCurrentUser,
  (organisation, currentUser) =>
    organisationUserIsOwner(organisation, currentUser)
);

export const getOrganisationCurrentUserIsMember = createSelector(
  getOrganisation,
  getCurrentUser,
  (organisation, currentUser) =>
    organisationUserIsMember(organisation, currentUser)
);

export const getOrganisationCurrentUserIsUnapprovedMember = createSelector(
  getOrganisation,
  getCurrentUser,
  (organisation, currentUser) =>
    organisationUserIsUnapprovedMember(organisation, currentUser)
);

export const getOrganisationCurrentUserIsRejectedMember = createSelector(
  getOrganisation,
  getCurrentUser,
  (organisation, currentUser) =>
    organisationUserIsRejectedMember(organisation, currentUser)
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
  getOrganisationError,
  getOrganisationIsFetching,
};

export default reducer;
