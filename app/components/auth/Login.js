/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

import {
  signIn,
  getIsFetching,
  getError,
} from 'makeandship-js-common/src/modules/auth';
import {
  DecoratedForm,
  FormFooter,
} from 'makeandship-js-common/src/components/ui/form';
import {
  SubmitButton,
  LinkButton,
} from 'makeandship-js-common/src/components/ui/Buttons';

import { loginSchema } from '../../schemas/auth';
import Header from '../header/Header';
import styles from './Common.scss';

const uiSchema = {
  email: {
    'ui:placeholder': 'sam.smith@example.com',
    'ui:autofocus': true,
  },
  password: {
    'ui:widget': 'password',
  },
};

class Login extends React.Component<*> {
  render() {
    const { isFetching, onSubmit, error } = this.props;
    return (
      <div className={styles.container}>
        <Header title={'Account'} />
        <Container fluid>
          <DecoratedForm
            formKey="auth/login"
            schema={loginSchema}
            uiSchema={uiSchema}
            onSubmit={onSubmit}
            isFetching={isFetching}
            error={error}
          >
            <FormFooter>
              <div>
                <SubmitButton marginRight>Log in</SubmitButton>
                <LinkButton to="/auth/signup" marginRight>
                  Sign up
                </LinkButton>
                <LinkButton to="/auth/forgot">Forgot password</LinkButton>
              </div>
            </FormFooter>
          </DecoratedForm>
        </Container>
      </div>
    );
  }
}

Login.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.any,
};

const withRedux = connect(
  state => ({
    isFetching: getIsFetching(state),
    error: getError(state),
  }),
  dispatch => ({
    onSubmit(formData) {
      dispatch(signIn(formData));
    },
  })
);

export default withRedux(Login);
