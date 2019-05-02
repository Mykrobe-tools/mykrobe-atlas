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
  state => ({
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
  currentUserIsFetching: PropTypes.bool.isRequired,
  currentUserError: PropTypes.any,
  createCurrentUserAvatar: PropTypes.func.isRequired,
  deleteCurrentUser: PropTypes.func.isRequired,
  deleteCurrentUserAvatar: PropTypes.func.isRequired,
  requestCurrentUser: PropTypes.func.isRequired,
  updateCurrentUser: PropTypes.func.isRequired,
  updateCurrentUserAvatar: PropTypes.func.isRequired,
};

export default withCurrentUser;
