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
import {
  SubmitButton,
  LinkButton,
} from 'makeandship-js-common/src/components/ui/Buttons';

import { forgotPasswordSchema } from '../../schemas/auth';
import HeaderContainer from '../ui/header/HeaderContainer';
import styles from './Common.scss';

const uiSchema = {
  username: {
    'ui:placeholder': 'sam.smith@example.com',
    'ui:autofocus': true,
  },
};

class Forgot extends React.Component<*> {
  render() {
    const { isFetching, forgotPassword, error } = this.props;
    return (
      <div className={styles.container}>
        <HeaderContainer title={'Account'} />
        <Container fluid>
          <DecoratedForm
            formKey="auth/forgot"
            promptUnsavedChanges={false}
            schema={forgotPasswordSchema}
            uiSchema={uiSchema}
            onSubmit={forgotPassword}
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
                  Get new password
                </SubmitButton>
                <LinkButton to="/auth/login" marginRight>
                  Log in
                </LinkButton>
                <LinkButton to="/auth/register">Register</LinkButton>
              </div>
            </FormFooter>
          </DecoratedForm>
        </Container>
      </div>
    );
  }
}

Forgot.propTypes = {
  ...withAuthPropTypes,
};

export default withAuth(Forgot);
