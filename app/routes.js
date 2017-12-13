/* @flow */

import * as React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import LibraryPage from './containers/LibraryPage';
import SamplePage from './containers/SamplePage';

import store from './store/store'; // eslint-disable-line import/default

import HomePage from './containers/HomePage';

import App from './containers/App';

import AuthPage from './containers/AuthPage';

import OrganisationPage from './containers/OrganisationPage';
import List from './components/organisation/List';
import Add from './components/organisation/Add';
import Edit from './components/organisation/Edit';

const requireAuth = (nextState, replace) => {
  const state = store.getState();
  const { auth } = state;
  const { isLoading, isAuthenticated } = auth;
  if (!isLoading && !isAuthenticated) {
    console.log('Authentication required, redirecting');
    return replace('/auth/login');
  }
};

// export default (
//   <Route path="/" component={App}>
//     <IndexRoute component={HomePage} />
//     <Route path="library" onEnter={requireAuth} component={LibraryPage} />
//     <Redirect from="sample" to="/" />
//     <Route path="sample/:id" onEnter={requireAuth} component={SamplePage}>
//       <IndexRedirect to="metadata" />
//       <Route path="metadata" component={Metadata} />
//       <Route path="resistance" component={Resistance}>
//         <IndexRedirect to="all" />
//         <Route path="all" component={ResistanceAllContainer} />
//         <Route path="drugs" component={ResistanceDrugsContainer} />
//         <Route path="class" component={ResistanceClassContainer} />
//         <Route path="evidence" component={ResistanceEvidenceContainer} />
//         <Route path="species" component={ResistanceSpeciesContainer} />
//       </Route>
//       <Route path="analysis" component={Analysis} />
//       <Route path="summary" component={SummaryContainer} />
//     </Route>
//     <Route path="auth" component={AuthPage}>
//       <IndexRedirect to="login" />
//       <Route path="login" component={Login} />
//       <Route path="signup" component={SignUp} />
//       <Route path="success" component={SignUpSuccess} />
//       <Route path="forgot" component={Forgot} />
//       <Route path="forgotsuccess" component={ForgotSuccess} />
//       <Route path="profile" onEnter={requireAuth} component={Profile} />
//       <Route path="reset/:resetPasswordToken" component={Reset} />
//       <Route path="resetsuccess" component={ResetSuccess} />
//       <Route path="verify/:verificationToken" component={Verify} />
//       <Route path="verifysuccess" component={VerifySuccess} />
//       <Route path="verifyfailure" component={VerifyFailure} />
//     </Route>
//     <Route
//       path="organisation"
//       onEnter={requireAuth}
//       component={OrganisationPage}
//     >
//       <IndexRedirect to="list" />
//       <Route path="list" component={List} />
//       <Route path="add" component={Add} />
//       <Route path="edit/:id" component={Edit} />
//     </Route>
//   </Route>
// );

export default (
  <App>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/library" onEnter={requireAuth} component={LibraryPage} />
      <Route path="/sample/:id" onEnter={requireAuth} component={SamplePage} />
      <Route path="/auth" component={AuthPage} />
      <Route
        path="/organisation"
        onEnter={requireAuth}
        component={OrganisationPage}
      >
        <Switch>
          <Route exact path="/" component={() => <Redirect to="list" />} />
          <Route path="list" component={List} />
          <Route path="add" component={Add} />
          <Route path="edit/:id" component={Edit} />
        </Switch>
      </Route>
    </Switch>
  </App>
);
