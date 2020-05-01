/* @flow */

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  createCurrentUserAvatar,
  deleteCurrentUser,
  deleteCurrentUserAvatar,
  getCurrentUser,
  getCurrentUserAvatarIsFetching,
  getCurrentUserError,
  getCurrentUserIsFetching,
  requestCurrentUser,
  updateCurrentUser,
  updateCurrentUserAvatar,
} from '../modules/users';

const withCurrentUser = connect(
  (state) => ({
    currentUser: getCurrentUser(state),
    currentUserIsFetching:
      getCurrentUserIsFetching(state) || getCurrentUserAvatarIsFetching(state),
    currentUserError: getCurrentUserError(state),
  }),
  {
    createCurrentUserAvatar,
    deleteCurrentUser,
    deleteCurrentUserAvatar,
    requestCurrentUser,
    updateCurrentUser,
    updateCurrentUserAvatar,
  }
);

export const withCurrentUserPropTypes = {
  currentUser: PropTypes.any,
  currentUserIsFetching: PropTypes.bool,
  currentUserError: PropTypes.any,
  createCurrentUserAvatar: PropTypes.func,
  deleteCurrentUser: PropTypes.func,
  deleteCurrentUserAvatar: PropTypes.func,
  requestCurrentUser: PropTypes.func,
  updateCurrentUser: PropTypes.func,
  updateCurrentUserAvatar: PropTypes.func,
};

export default withCurrentUser;
