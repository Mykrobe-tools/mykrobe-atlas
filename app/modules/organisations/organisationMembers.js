/* @flow */

import { put, all, fork, takeLatest } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { createSelector } from 'reselect';
import produce from 'immer';

import { callSwaggerApi } from 'makeandship-js-common/src/modules/api/swaggerApi';

import { showNotification } from '../notifications';
import { getCurrentUser } from '../../modules/users/currentUser';
import { getOrganisation, requestOrganisation } from './organisation';

export const typePrefix = 'organisations/organisationMembers/';

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

// Selectors

export const getState = (state: any) => state.organisations.organisationMembers;

export const getOrganisationMembersIsFetching = createSelector(
  getState,
  state => state.isFetching
);

export const getOrganisationMembersError = createSelector(
  getState,
  state => state.error
);

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

export const organisationAllMembers = (organisation: any): Array<*> => {
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

export const getOrganisationAllMembers = createSelector(
  getOrganisation,
  organisation => organisationAllMembers(organisation)
);

// Action creators

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

// Reducer

export type State = {
  isFetching: boolean,
  error: Error | null,
};

const initialState: State = {
  isFetching: false,
  error: null,
};

const reducer = (state?: State = initialState, action?: Object = {}): State =>
  produce(state, draft => {
    switch (action.type) {
      case JOIN:
      case APPROVE_JOIN:
      case REJECT_JOIN:
      case REMOVE_MEMBER:
      case PROMOTE_MEMBER:
      case DEMOTE_MEMBER:
        return {
          ...draft,
          isFetching: true,
        };
      case JOIN_SUCCESS:
      case APPROVE_JOIN_SUCCESS:
      case REJECT_JOIN_SUCCESS:
      case REMOVE_MEMBER_SUCCESS:
      case PROMOTE_MEMBER_SUCCESS:
      case DEMOTE_MEMBER_SUCCESS:
        return {
          ...draft,
          isFetching: false,
          error: undefined,
        };
      case JOIN_FAILURE:
      case APPROVE_JOIN_FAILURE:
      case REJECT_JOIN_FAILURE:
      case REMOVE_MEMBER_FAILURE:
      case PROMOTE_MEMBER_FAILURE:
      case DEMOTE_MEMBER_FAILURE:
        return {
          ...draft,
          isFetching: false,
          error: action.payload,
        };
      default:
        return;
    }
  });

export default reducer;

// Side effects

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

export function* successWatcher(): Saga {
  // refresh membership status
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
      yield put(requestOrganisation(id));
    }
  );
  // show notification
  yield takeLatest(JOIN_SUCCESS, function*() {
    yield put(showNotification('Request awaiting approval'));
  });
  yield takeLatest(APPROVE_JOIN_SUCCESS, function*() {
    yield put(showNotification('Request approved'));
  });
  yield takeLatest(REJECT_JOIN_SUCCESS, function*() {
    yield put(showNotification('Request rejected'));
  });
  yield takeLatest(REMOVE_MEMBER_SUCCESS, function*() {
    yield put(showNotification('Member removed'));
  });
  yield takeLatest(PROMOTE_MEMBER_SUCCESS, function*() {
    yield put(showNotification('Promoted to owner'));
  });
  yield takeLatest(DEMOTE_MEMBER_SUCCESS, function*() {
    yield put(showNotification('Demoted to member'));
  });
}

const sagas = [
  joinOrganisationWatcher,
  approveJoinOrganisationRequestWatcher,
  rejectJoinOrganisationRequestWatcher,
  removeOrganisationMemberWatcher,
  promoteOrganisationMemberWatcher,
  demoteOrganisationOwnerWatcher,
  successWatcher,
];

export function* organisationMembersSaga(): Saga {
  yield all(sagas.map(saga => fork(saga)));
}
