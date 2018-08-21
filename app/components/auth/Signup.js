/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

import {
  PasswordInput,
  DecoratedForm,
  FormFooter,
} from 'makeandship-js-common/src/components/ui/form';
import {
  SubmitButton,
  LinkButton,
} from 'makeandship-js-common/src/components/ui/Buttons';

import {
  createCurrentUser,
  getCurrentUserIsFetching,
  getCurrentUserError,
} from '../../modules/users';

import { signupSchema } from '../../schemas/auth';
import Header from '../header/Header';
import styles from './Common.scss';

const uiSchema = {
  email: {
    'ui:placeholder': 'sam.smith@example.com',
    'ui:autofocus': true,
  },
  firstname: {
    'ui:placeholder': 'Sam',
  },
  lastname: {
    'ui:placeholder': 'Smith',
  },
  password: {
    'ui:widget': PasswordInput,
  },
  confirmPassword: {
    'ui:widget': PasswordInput,
  },
};

export const validatePasswordMatch = (formData: any, errors: any) => {
  if (
    formData.confirmPassword &&
    formData.password !== formData.confirmPassword
  ) {
    errors.confirmPassword.addError("Passwords don't match");
  }
  return errors;
};

class Signup extends React.Component<*> {
  render() {
    const { isFetching, onSubmit, error } = this.props;
    return (
      <div className={styles.container}>
        <Header title={'Account'} />
        <Container fluid>
          <DecoratedForm
            formKey="auth/signup"
            schema={signupSchema}
            uiSchema={uiSchema}
            onSubmit={onSubmit}
            isFetching={isFetching}
            validate={validatePasswordMatch}
            error={error}
          >
            <FormFooter>
              <div>
                <SubmitButton data-tid="button-submit" marginRight>
                  Sign up
                </SubmitButton>
                <LinkButton to="/auth/login">Log in</LinkButton>
              </div>
            </FormFooter>
          </DecoratedForm>
        </Container>
      </div>
    );
  }
}

Signup.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.any,
};

const withRedux = connect(
  state => ({
    isFetching: getCurrentUserIsFetching(state),
    error: getCurrentUserError(state),
  }),
  dispatch => ({
    onSubmit(formData) {
      dispatch(createCurrentUser(formData));
    },
  })
);

export default withRedux(Signup);
