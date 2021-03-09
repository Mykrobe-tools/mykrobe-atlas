/* @flow */

import * as React from 'react';
import { Container } from 'reactstrap';

import { withCurrentUserPropTypes } from '../../../hoc/withCurrentUser';

import {
  DecoratedForm,
  FormFooter,
} from 'makeandship-js-common/src/components/ui/form';
import {
  SubmitButton,
  DestructiveButton,
} from 'makeandship-js-common/src/components/ui/buttons';

import HeaderContainer from '../../ui/header/HeaderContainer';

import { profileSchema } from '../../../schemas/users';
import styles from './Profile.module.scss';

const uiSchema = {
  username: {
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

  onDeleteClick = (e) => {
    const { deleteCurrentUser } = this.props;
    e && e.preventDefault();
    if (!confirm(`Delete account? This cannot be undone.`)) {
      return;
    }
    deleteCurrentUser();
  };

  onCancelClick = (e) => {
    e && e.preventDefault();
    const { goBack } = this.props;
    goBack();
  };

  onSubmit = (formData) => {
    const { updateCurrentUser } = this.props;
    updateCurrentUser(formData);
  };

  render() {
    const { isFetching, error, currentUser } = this.props;
    return (
      <div className={styles.container}>
        <HeaderContainer title={'Profile'} />
        <div className={styles.container}>
          <Container fluid>
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
                </div>
                <DestructiveButton onClick={this.onDeleteClick}>
                  Delete account
                </DestructiveButton>
              </FormFooter>
            </DecoratedForm>
          </Container>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  ...withCurrentUserPropTypes,
};

export default Profile;
