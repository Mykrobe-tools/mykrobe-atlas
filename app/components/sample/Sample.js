/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './Sample.css';
import { Route, Redirect, Switch, NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import AnalysisContainer from '../analysis/AnalysisContainer';
import MetadataContainer from '../metadata/MetadataContainer';
import Resistance from '../resistance/resistance/Resistance';
import SummaryContainer from '../summary/SummaryContainer';

class Sample extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>(Name of sample)</div>
        </div>
        <div className={styles.navigation}>
          <NavLink
            to={`${match.url}/metadata`}
            className={styles.navigationItem}
            activeClassName={styles.navigationItemActive}
          >
            Metadata
          </NavLink>
          <NavLink
            to={`${match.url}/resistance`}
            className={styles.navigationItem}
            activeClassName={styles.navigationItemActive}
          >
            Resistance
          </NavLink>
          <NavLink
            to={`${match.url}/analysis`}
            className={styles.navigationItem}
            activeClassName={styles.navigationItemActive}
          >
            Analysis
          </NavLink>
          <NavLink
            to={`${match.url}/summary`}
            className={styles.navigationItem}
            activeClassName={styles.navigationItemActive}
          >
            Summary
          </NavLink>
        </div>
        <Switch>
          <Route
            exact
            path={match.url}
            component={() => <Redirect to={`${match.url}/metadata`} />}
          />
          <Route path={`${match.url}/metadata`} component={MetadataContainer} />
          <Route path={`${match.url}/resistance`} component={Resistance} />
          <Route path={`${match.url}/analysis`} component={AnalysisContainer} />
          <Route path={`${match.url}/summary`} component={SummaryContainer} />
        </Switch>
      </div>
    );
  }
}

Sample.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(Sample);
