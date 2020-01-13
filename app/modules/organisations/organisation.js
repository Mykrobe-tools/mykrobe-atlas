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

export const APPROVE_JOIN = `${typePrefix}APPROVE_JOIN`;
export const APPROVE_JOIN_REQUEST = `${typePrefix}APPROVE_JOIN_REQUEST`;
export const APPROVE_JOIN_SUCCESS = `${typePrefix}APPROVE_JOIN_SUCCESS`;
export const APPROVE_JOIN_FAILURE = `${typePrefix}APPROVE_JOIN_FAILURE`;

export const REJECT_JOIN = `${typePrefix}REJECT_JOIN`;
export const REJECT_JOIN_REQUEST = `${typePrefix}REJECT_JOIN_REQUEST`;
export const REJECT_JOIN_SUCCESS = `${typePrefix}REJECT_JOIN_SUCCESS`;
export const REJECT_JOIN_FAILURE = `${typePrefix}REJECT_JOIN_FAILURE`;

export const REMOVE_MEMBER = `${typePrefix}REMOVE_MEMBER`;
export const REMOVE_MEMBER_REQUEST = `${typePrefix}REMOVE_MEMBER_REQUEST`;
export const REMOVE_MEMBER_SUCCESS = `${typePrefix}REMOVE_MEMBER_SUCCESS`;
export const REMOVE_MEMBER_FAILURE = `${typePrefix}REMOVE_MEMBER_FAILURE`;

export const PROMOTE_MEMBER = `${typePrefix}PROMOTE_MEMBER`;
export const PROMOTE_MEMBER_REQUEST = `${typePrefix}PROMOTE_MEMBER_REQUEST`;
export const PROMOTE_MEMBER_SUCCESS = `${typePrefix}PROMOTE_MEMBER_SUCCESS`;
export const PROMOTE_MEMBER_FAILURE = `${typePrefix}PROMOTE_MEMBER_FAILURE`;

export const DEMOTE_MEMBER = `${typePrefix}DEMOTE_MEMBER`;
export const DEMOTE_MEMBER_REQUEST = `${typePrefix}DEMOTE_MEMBER_REQUEST`;
export const DEMOTE_MEMBER_SUCCESS = `${typePrefix}DEMOTE_MEMBER_SUCCESS`;
export const DEMOTE_MEMBER_FAILURE = `${typePrefix}DEMOTE_MEMBER_FAILURE`;

// joinOrganisation

export const joinOrganisation = (payload?: any) => ({
  type: JOIN,
  payload,
});

export const approveJoinOrganisationRequest = (payload?: any) => ({
  type: APPROVE_JOIN,
  payload,
});

export const rejectJoinOrganisationRequest = (payload?: any) => ({
  type: REJECT_JOIN,
  payload,
});

export const removeOrganisationMember = (payload?: any) => ({
  type: REMOVE_MEMBER,
  payload,
});

export const promoteOrganisationMember = (payload?: any) => ({
  type: PROMOTE_MEMBER,
  payload,
});

export const demoteOrganisationOwner = (payload?: any) => ({
  type: DEMOTE_MEMBER,
  payload,
});

export function* joinOrganisationWatcher(): Saga {
  yield takeLatest(JOIN, function*(action) {
    yield put(
      callSwaggerApi({
        operationId: 'joinOrganisation',
        parameters: action.payload,
        types: [JOIN_REQUEST, JOIN_SUCCESS, JOIN_FAILURE],
      })
    );
  });
}

export function* approveJoinOrganisationRequestWatcher(): Saga {
  yield takeLatest(APPROVE_JOIN, function*(action) {
    yield put(
      callSwaggerApi({
        operationId: 'approveJoinOrganisationRequest',
        parameters: action.payload,
        types: [
          APPROVE_JOIN_REQUEST,
          APPROVE_JOIN_SUCCESS,
          APPROVE_JOIN_FAILURE,
        ],
      })
    );
  });
}

export function* rejectJoinOrganisationRequestWatcher(): Saga {
  yield takeLatest(REJECT_JOIN, function*(action) {
    yield put(
      callSwaggerApi({
        operationId: 'rejectJoinOrganisationRequest',
        parameters: action.payload,
        types: [REJECT_JOIN_REQUEST, REJECT_JOIN_SUCCESS, REJECT_JOIN_FAILURE],
      })
    );
  });
}

export function* removeOrganisationMemberWatcher(): Saga {
  yield takeLatest(REMOVE_MEMBER, function*(action) {
    yield put(
      callSwaggerApi({
        operationId: 'removeOrganisationMember',
        parameters: action.payload,
        types: [
          REMOVE_MEMBER_REQUEST,
          REMOVE_MEMBER_SUCCESS,
          REMOVE_MEMBER_FAILURE,
        ],
      })
    );
  });
}

export function* promoteOrganisationMemberWatcher(): Saga {
  yield takeLatest(PROMOTE_MEMBER, function*(action) {
    yield put(
      callSwaggerApi({
        operationId: 'promoteOrganisationMember',
        parameters: action.payload,
        types: [
          PROMOTE_MEMBER_REQUEST,
          PROMOTE_MEMBER_SUCCESS,
          PROMOTE_MEMBER_FAILURE,
        ],
      })
    );
  });
}

export function* demoteOrganisationOwnerWatcher(): Saga {
  yield takeLatest(DEMOTE_MEMBER, function*(action) {
    yield put(
      callSwaggerApi({
        operationId: 'demoteOrganisationOwner',
        parameters: action.payload,
        types: [
          DEMOTE_MEMBER_REQUEST,
          DEMOTE_MEMBER_SUCCESS,
          DEMOTE_MEMBER_FAILURE,
        ],
      })
    );
  });
}

const sagas = [
  organisationModuleSaga,
  joinOrganisationWatcher,
  approveJoinOrganisationRequestWatcher,
  rejectJoinOrganisationRequestWatcher,
  removeOrganisationMemberWatcher,
  promoteOrganisationMemberWatcher,
  demoteOrganisationOwnerWatcher,
];

export function* organisationSaga(): Saga {
  yield all(sagas.map(saga => fork(saga)));
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
