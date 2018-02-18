/* @flow */

import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import LibraryContainer from './components/library/LibraryContainer';
import SamplePage from './containers/SamplePage';
import HomePage from './containers/HomePage';
import App from './containers/App';
import AuthPage from './containers/AuthPage';
import OrganisationPage from './containers/OrganisationPage';

import { userIsAuthenticated } from './authHelpers';

const AuthenticatedLibraryContainer = userIsAuthenticated(LibraryContainer);
const AuthenticatedSamplePage = userIsAuthenticated(SamplePage);
const AuthenticatedOrganisationPage = userIsAuthenticated(OrganisationPage);

export default (
  <App>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/library" component={AuthenticatedLibraryContainer} />
      <Route path="/sample/:id" component={AuthenticatedSamplePage} />
      <Route path="/organisation" component={AuthenticatedOrganisationPage} />
    </Switch>
  </App>
);
