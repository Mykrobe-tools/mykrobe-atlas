/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

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
import HeaderContainer from '../header/HeaderContainer';
import styles from './Common.scss';

const uiSchema = {
  username: {
    'ui:placeholder': 'sam.smith@example.com',
    'ui:autofocus': true,
  },
};

class Forgot extends React.Component<*> {
  render() {
    const { isFetching, onSubmit, error } = this.props;
    return (
      <div className={styles.container}>
        <HeaderContainer title={'Account'} />
        <Container fluid>
          <DecoratedForm
            formKey="auth/forgot"
            promptUnsavedChanges={false}
            schema={forgotPasswordSchema}
            uiSchema={uiSchema}
            onSubmit={onSubmit}
            isFetching={isFetching}
            error={error}
          >
            <FormFooter>
              <div>
                <SubmitButton data-tid="button-submit" marginRight>
                  Get new password
                </SubmitButton>
                <LinkButton to="/auth/login" marginRight>
                  Log in
                </LinkButton>
                <LinkButton to="/auth/register">Sign up</LinkButton>
              </div>
            </FormFooter>
          </DecoratedForm>
        </Container>
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
