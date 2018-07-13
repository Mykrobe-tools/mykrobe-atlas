/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  resetPassword,
  getIsFetching,
  getError,
} from 'makeandship-js-common/src/modules/auth';

import {
  DecoratedForm,
  FormFooter,
  PasswordInput,
} from 'makeandship-js-common/src/components/ui/form';
import { SubmitButton } from 'makeandship-js-common/src/components/ui/Buttons';

import { resetPasswordSchema } from '../../schemas/auth';
import { validatePasswordMatch } from './Signup';
import Header from '../header/Header';
import styles from './Common.scss';

const uiSchema = {
  password: {
    'ui:widget': PasswordInput,
  },
  confirmPassword: {
    'ui:widget': PasswordInput,
  },
};

class Signup extends React.Component<*> {
  onSubmit = formData => {
    const { resetPassword, match } = this.props;
    const { resetPasswordToken } = match.params;
    resetPassword({
      resetPasswordToken,
      ...formData,
    });
  };

  render() {
    const { isFetching, error } = this.props;
    return (
      <div className={styles.container}>
        <Header title={'Account'} />
        <DecoratedForm
          formKey="auth/reset"
          schema={resetPasswordSchema}
          uiSchema={uiSchema}
          onSubmit={this.onSubmit}
          isFetching={isFetching}
          error={error}
          validate={validatePasswordMatch}
        >
          <FormFooter>
            <SubmitButton>Reset password</SubmitButton>
          </FormFooter>
        </DecoratedForm>
      </div>
    );
  }
}

Signup.propTypes = {
  match: PropTypes.any,
  isFetching: PropTypes.bool.isRequired,
  resetPassword: PropTypes.func.isRequired,
  error: PropTypes.any,
};

const withRedux = connect(
  state => ({
    isFetching: getIsFetching(state),
    error: getError(state),
  }),
  dispatch => ({
    resetPassword(formData) {
      dispatch(resetPassword(formData));
    },
  })
);

export default withRedux(Signup);
