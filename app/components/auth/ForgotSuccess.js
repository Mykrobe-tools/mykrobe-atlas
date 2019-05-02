/* @flow */

import * as React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  FormHeader,
  FormFooter,
} from 'makeandship-js-common/src/components/ui/form';
import { PrimaryButton } from 'makeandship-js-common/src/components/ui/Buttons';

import HeaderContainer from '../header/HeaderContainer';
import styles from './Common.scss';

const ForgotSuccess = () => (
  <div className={styles.container}>
    <HeaderContainer title={'Account'} />
    <Container fluid>
      <FormHeader title="Forgot password" />
      <p className="pt-3">Password reset instructions have been sent</p>
      <FormFooter>
        <PrimaryButton tag={Link} to="/">
          Home
        </PrimaryButton>
      </FormFooter>
    </Container>
  </div>
);

export default ForgotSuccess;
