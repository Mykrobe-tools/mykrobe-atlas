/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

import {
  requestCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  getCurrentUser,
  getCurrentUserIsFetching,
  getCurrentUserError,
} from '../../../modules/users';

import {
  DecoratedForm,
  FormFooter,
} from 'makeandship-js-common/src/components/ui/form';
import {
  SubmitButton,
  CancelButton,
  DestructiveButton,
} from 'makeandship-js-common/src/components/ui/Buttons';

import Header from '../../header/Header';

// TODO: this is effectively a variation of EditUser - consolidate

import { profileSchema } from '../../../schemas/users';

const uiSchema = {
  email: {
    'ui:readonly': true,
  },
  firstname: {
    'ui:placeholder': 'Sam',
  },
  lastname: {
    'ui:placeholder': 'Smith',
  },
};

class Profile extends React.Component<*> {
  componentDidMount() {
    const { requestCurrentUser } = this.props;
    requestCurrentUser();
  }

  onDelete = e => {
    const { deleteCurrentUser } = this.props;
    e && e.preventDefault();
    if (!confirm(`Delete account? This cannot be undone.`)) {
      return;
    }
    deleteCurrentUser();
  };

  onSubmit = formData => {
    const { updateCurrentUser } = this.props;
    updateCurrentUser(formData);
  };

  render() {
    const { isFetching, error, currentUser } = this.props;
    return (
      <DocumentTitle title="Profile">
        <div>
          <Header title={'Profile'} />
          <DecoratedForm
            formKey="users/profile"
            schema={profileSchema}
            uiSchema={uiSchema}
            onSubmit={this.onSubmit}
            isFetching={isFetching}
            error={error}
            formData={currentUser}
          >
            <FormFooter>
              <div>
                <SubmitButton marginRight>Save profile</SubmitButton>
                <CancelButton />
              </div>
              <DestructiveButton onClick={this.onDelete}>
                Delete account
              </DestructiveButton>
            </FormFooter>
          </DecoratedForm>
        </div>
      </DocumentTitle>
    );
  }
}

Profile.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  requestCurrentUser: PropTypes.func.isRequired,
  updateCurrentUser: PropTypes.func.isRequired,
  deleteCurrentUser: PropTypes.func.isRequired,
  error: PropTypes.any,
  currentUser: PropTypes.any,
};

const withRedux = connect(
  state => ({
    isFetching: getCurrentUserIsFetching(state),
    error: getCurrentUserError(state),
    currentUser: getCurrentUser(state),
  }),
  dispatch => ({
    updateCurrentUser(user) {
      dispatch(updateCurrentUser(user));
    },
    requestCurrentUser() {
      dispatch(requestCurrentUser());
    },
    deleteCurrentUser() {
      dispatch(deleteCurrentUser());
    },
  })
);

export default withRedux(Profile);
