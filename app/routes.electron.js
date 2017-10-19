/* @flow */

import React from 'react';
import { Route, Redirect, IndexRoute, IndexRedirect } from 'react-router';
import LibraryPage from './containers/LibraryPage';
import SamplePage from './containers/SamplePage';

import store from './store/store'; // eslint-disable-line import/default

import HomePage from './containers/HomePage';

import App from './containers/App';

import Analysis from './components/analysis/Analysis';
import Metadata from './components/metadata/Metadata';
import Resistance from './components/resistance/Resistance';
import ResistanceAll from './components/resistance/ResistanceAll';
import ResistanceDrugs from './components/resistance/ResistanceDrugs';
import ResistanceClass from './components/resistance/ResistanceClass';
import ResistanceEvidence from './components/resistance/ResistanceEvidence';
import ResistanceSpecies from './components/resistance/ResistanceSpecies';
import Summary from './components/summary/Summary';

import AuthPage from './containers/AuthPage';
import SignUp from './components/auth/SignUp';
import SignUpSuccess from './components/auth/SignUpSuccess';
import Login from './components/auth/Login';
import Forgot from './components/auth/Forgot';
import ForgotSuccess from './components/auth/ForgotSuccess';
import Profile from './components/auth/Profile';
import Reset from './components/auth/Reset';
import ResetSuccess from './components/auth/ResetSuccess';
import Verify from './components/auth/Verify';
import VerifySuccess from './components/auth/VerifySuccess';
import VerifyFailure from './components/auth/VerifyFailure';

import OrganisationPage from './containers/OrganisationPage';
import List from './components/organisation/List';
import Add from './components/organisation/Add';
import Edit from './components/organisation/Edit';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="results">
      <IndexRedirect to="resistance" />
      <Route path="resistance" component={Resistance}>
        <IndexRedirect to="all" />
        <Route path="all" component={ResistanceAll} />
        <Route path="drugs" component={ResistanceDrugs} />
        <Route path="class" component={ResistanceClass} />
        <Route path="evidence" component={ResistanceEvidence} />
        <Route path="species" component={ResistanceSpecies} />
      </Route>
      <Route path="analysis" component={Analysis} />
      <Route path="summary" component={Summary} />
    </Route>
  </Route>
);
