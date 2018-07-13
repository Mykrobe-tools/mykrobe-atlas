/* @flow */

import * as React from 'react';
import { Link } from 'react-router-dom';

import {
  FormHeader,
  FormFooter,
} from 'makeandship-js-common/src/components/ui/form';
import { PrimaryButton } from 'makeandship-js-common/src/components/ui/Buttons';

import Header from '../header/Header';

const ForgotSuccess = () => (
  <div>
    <Header title={'Account'} />
    <FormHeader title="Forgot password" />
    <p className="pt-3">Password reset instructions have been sent</p>
    <FormFooter>
      <PrimaryButton tag={Link} to="/">
        Home
      </PrimaryButton>
    </FormFooter>
  </div>
);

export default ForgotSuccess;
