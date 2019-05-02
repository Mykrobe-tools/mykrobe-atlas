/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

import {
  DecoratedForm,
  FormFooter,
} from 'makeandship-js-common/src/components/ui/form';
import {
  SubmitButton,
  LinkButton,
} from 'makeandship-js-common/src/components/ui/Buttons';

import {
  register,
  getIsFetching,
  getError,
} from 'makeandship-js-common/src/modules/auth';

import { signupSchema } from '../../schemas/auth';
import HeaderContainer from '../header/HeaderContainer';
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
  register: PropTypes.func,
  error: PropTypes.any,
};

const withRedux = connect(
  state => ({
    isFetching: getIsFetching(state),
    error: getError(state),
  }),
  { register }
);

export default withRedux(Signup);
