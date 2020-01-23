/* @flow */

import * as React from 'react';
import { Container } from 'reactstrap';

import {
  DecoratedForm,
  FormFooter,
} from 'makeandship-js-common/src/components/ui/form';
import {
  SubmitButton,
  LinkButton,
} from 'makeandship-js-common/src/components/ui/Buttons';

import withAuth, {
  withAuthPropTypes,
} from 'makeandship-js-common/src/hoc/withAuth';

import { signupSchema } from '../../schemas/auth';
import HeaderContainer from '../ui/header/HeaderContainer';
import styles from './Common.scss';

const uiSchema = {
  username: {
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
    'ui:widget': 'password',
  },
  confirmPassword: {
    'ui:widget': 'password',
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
    const { isFetching, register, error } = this.props;
    return (
      <div className={styles.container}>
        <HeaderContainer title={'Account'} />
        <Container fluid>
          <DecoratedForm
            formKey="auth/register"
            schema={signupSchema}
            uiSchema={uiSchema}
            onSubmit={register}
            isFetching={isFetching}
            validate={validatePasswordMatch}
            error={error}
          >
            <FormFooter>
              <div>
                <SubmitButton
                  busy={isFetching}
                  data-tid="button-submit"
                  marginRight
                >
                  Register
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
  ...withAuthPropTypes,
};

export default withAuth(Signup);
