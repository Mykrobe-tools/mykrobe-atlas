/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

import {
  login,
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
  username: {
    'ui:placeholder': 'sam.smith@example.com',
    'ui:autofocus': true,
  },
  password: {
    'ui:widget': 'password',
  },
};

const USE_KEYCLOAK = !!process.env.AUTH_KEYCLOAK_URL;

class Login extends React.Component<*> {
  componentDidMount = () => {
    if (USE_KEYCLOAK) {
      const { login } = this.props;
      login();
    }
  };
  render() {
    if (USE_KEYCLOAK) {
      return null;
    }
    const { isFetching, login, error } = this.props;
    return (
      <div className={styles.container}>
        <Header title={'Account'} />
        <Container fluid>
          <DecoratedForm
            formKey="auth/login"
            promptUnsavedChanges={false}
            schema={loginSchema}
            uiSchema={uiSchema}
            onSubmit={login}
            isFetching={isFetching}
            error={error}
          >
            <FormFooter>
              <div>
                <SubmitButton data-tid="button-submit" marginRight>
                  Log in
                </SubmitButton>
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
  login: PropTypes.func.isRequired,
  error: PropTypes.any,
};

const withRedux = connect(
  state => ({
    isFetching: getIsFetching(state),
    error: getError(state),
  }),
  { login }
);

export default withRedux(Login);
