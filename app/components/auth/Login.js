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

const USE_KEYCLOAK = !!process.env.AUTH_KEYCLOAK_URL;

class Login extends React.Component<*> {
  componentDidMount = () => {
    if (USE_KEYCLOAK) {
      const { signIn } = this.props;
      signIn();
    }
  };
  render() {
    if (USE_KEYCLOAK) {
      return null;
    }
    const { isFetching, signIn, error } = this.props;
    return (
      <div className={styles.container}>
        <Header title={'Account'} />
        <Container fluid>
          <DecoratedForm
            formKey="auth/login"
            schema={loginSchema}
            uiSchema={uiSchema}
            onSubmit={signIn}
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
  signIn: PropTypes.func.isRequired,
  error: PropTypes.any,
};

const withRedux = connect(
  state => ({
    isFetching: getIsFetching(state),
    error: getError(state),
  }),
  { signIn }
);

export default withRedux(Login);
