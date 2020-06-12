/* @flow */

import * as React from 'react';
import { Container } from 'reactstrap';

import withAuth, {
  withAuthPropTypes,
} from 'makeandship-js-common/src/hoc/withAuth';

import {
  DecoratedForm,
  FormFooter,
} from 'makeandship-js-common/src/components/ui/form';
import { SubmitButton } from 'makeandship-js-common/src/components/ui/buttons';
import LinkButton from 'makeandship-js-common/src/components/ui/buttons/LinkButton';

import { loginSchema } from '../../schemas/auth';
import HeaderContainer from '../ui/header/HeaderContainer';
import styles from './Common.module.scss';

const uiSchema = {
  username: {
    'ui:placeholder': 'sam.smith@example.com',
    'ui:autofocus': true,
  },
  password: {
    'ui:widget': 'password',
  },
};

class Login extends React.Component<*> {
  render() {
    const { isFetching, login, error } = this.props;
    return (
      <div className={styles.container}>
        <HeaderContainer title={'Account'} />
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
                <SubmitButton
                  busy={isFetching}
                  data-tid="button-submit"
                  marginRight
                >
                  Log in
                </SubmitButton>
                <LinkButton to="/auth/register" marginRight>
                  Register
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
  ...withAuthPropTypes,
};

export default withAuth(Login);
