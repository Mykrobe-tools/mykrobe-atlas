/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  forgotPassword,
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

import { forgotPasswordSchema } from '../../schemas/auth';
import Header from '../header/Header';

const uiSchema = {
  email: {
    'ui:placeholder': 'sam.smith@example.com',
    'ui:autofocus': true,
  },
};

class Forgot extends React.Component<*> {
  render() {
    const { isFetching, onSubmit, error } = this.props;
    return (
      <div>
        <Header title={'Account'} />
        <DecoratedForm
          formKey="auth/forgot"
          schema={forgotPasswordSchema}
          uiSchema={uiSchema}
          onSubmit={onSubmit}
          isFetching={isFetching}
          error={error}
        >
          <FormFooter>
            <div>
              <SubmitButton marginRight>Get new password</SubmitButton>
              <LinkButton to="/auth/login" marginRight>
                Log in
              </LinkButton>
              <LinkButton to="/auth/signup">Sign up</LinkButton>
            </div>
          </FormFooter>
        </DecoratedForm>
      </div>
    );
  }
}

Forgot.propTypes = {
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
      dispatch(forgotPassword(formData));
    },
  })
);

export default withRedux(Forgot);
