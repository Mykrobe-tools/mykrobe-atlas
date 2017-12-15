/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route, Redirect, Switch } from 'react-router-dom';

import List from '../components/organisation/List';
import Add from '../components/organisation/Add';
import Edit from '../components/organisation/Edit';

class OrganisationPage extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route
          exact
          path={match.url}
          component={() => <Redirect to={`${match.url}/list`} />}
        />
        <Route path={`${match.url}/list`} component={List} />
        <Route path={`${match.url}/add`} component={Add} />
        <Route path={`${match.url}/edit/:id`} component={Edit} />
      </Switch>
    );
  }
}

OrganisationPage.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(OrganisationPage);
