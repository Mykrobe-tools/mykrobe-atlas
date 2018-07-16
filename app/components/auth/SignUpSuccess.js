/* @flow */

import * as React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  FormHeader,
  FormFooter,
} from 'makeandship-js-common/src/components/ui/form';
import { PrimaryButton } from 'makeandship-js-common/src/components/ui/Buttons';

import Header from '../header/Header';
import styles from './Common.scss';

const SignupSuccess = () => (
  <div className={styles.container}>
    <Header title={'Account'} />
    <Container fluid>
      <FormHeader title="Signup successful" />
      <p className="pt-3">
        Your account has been created, please check your emails for an account
        verification link
      </p>
      <FormFooter>
        <PrimaryButton tag={Link} to="/">
          Home
        </PrimaryButton>
      </FormFooter>
    </Container>
  </div>
);

export default SignupSuccess;
