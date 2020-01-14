/* @flow */

import { put, all, fork, takeLatest } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { createSelector } from 'reselect';
import produce from 'immer';

import { createEntityModule } from 'makeandship-js-common/src/modules/generic';
import { callSwaggerApi } from 'makeandship-js-common/src/modules/api/swaggerApi';
import { isString } from 'makeandship-js-common/src/util/is';

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

export const organisationUserStatus = (organisation: any, user: any) => {
  let userStatus;
  if (organisationUserIsOwner(organisation, user)) {
    userStatus = 'owner';
  } else if (organisationUserIsMember(organisation, user)) {
    userStatus = 'member';
  } else if (organisationUserIsUnapprovedMember(organisation, user)) {
    userStatus = 'unapproved';
  } else if (organisationUserIsRejectedMember(organisation, user)) {
    userStatus = 'rejected';
  }
  return userStatus;
};

export const organisationUserMemberId = (organisation: any, user: any) => {
  if (!organisation || !user) {
    return;
  }
  const owner = organisation.owners.find(element => element.userId === user.id);
  if (owner) {
    return owner.id;
  }
  const member = organisation.members.find(
    element => element.userId === user.id
  );
  if (member) {
    return member.id;
  }
  const unapprovedMember = organisation.unapprovedMembers.find(
    element => element.userId === user.id
  );
  if (unapprovedMember) {
    return unapprovedMember.id;
  }
  const rejectedMember = organisation.rejectedMembers.find(
    element => element.userId === user.id
  );
  if (rejectedMember) {
    return rejectedMember.id;
  }
};

export const organisationMembers = (organisation: any): Array<*> => {
  if (!organisation) {
    return [];
  }
  const members = [
    ...organisation.owners,
    ...organisation.members,
    ...organisation.unapprovedMembers,
    ...organisation.rejectedMembers,
  ];
  return produce(members, draft => {
    draft.forEach(member => {
      // create user with id of userId, since id in this context is the actual memberId
      const memberAsUser = {
        id: member.userId,
      };
      member.organisationUserStatus = organisationUserStatus(
        organisation,
        memberAsUser
      );
    });
  });
};

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

export const getOrganisationCurrentUserStatus = createSelector(
  getOrganisation,
  getCurrentUser,
  (organisation, currentUser) =>
    organisationUserStatus(organisation, currentUser)
);

export const getOrganisationCurrentUserMemberId = createSelector(
  getOrganisation,
  getCurrentUser,
  (organisation, currentUser) =>
    organisationUserMemberId(organisation, currentUser)
);

export const getOrganisationMembers = createSelector(
  getOrganisation,
  organisation => organisationMembers(organisation)
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

export function* joinOrganisationSuccessWatcher(): Saga {
  yield takeLatest(JOIN_SUCCESS, function*() {
    yield put(showNotification('Request sent, waiting for approval.'));
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

// refresh membership status

export function* refreshOrganisationWatcher(): Saga {
  yield takeLatest(
    [
      JOIN_SUCCESS,
      APPROVE_JOIN_SUCCESS,
      REJECT_JOIN_SUCCESS,
      REMOVE_MEMBER_SUCCESS,
      PROMOTE_MEMBER_SUCCESS,
      DEMOTE_MEMBER_SUCCESS,
    ],
    function*(action) {
      const entity = action.payload;
      const { id } = entity;
      // FIXME: remove once working as expected
      if (!isString(id)) {
        console.warn(
          'Not refreshing organisation - object returned from API has no id'
        );
      } else {
        yield put(requestOrganisation(id));
      }
    }
  );
}

const sagas = [
  organisationModuleSaga,
  joinOrganisationWatcher,
  joinOrganisationSuccessWatcher,
  approveJoinOrganisationRequestWatcher,
  rejectJoinOrganisationRequestWatcher,
  removeOrganisationMemberWatcher,
  promoteOrganisationMemberWatcher,
  demoteOrganisationOwnerWatcher,
  refreshOrganisationWatcher,
];

export function* organisationSaga(): Saga {
  yield all(sagas.map(saga => fork(saga)));
}

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
};

export default reducer;
