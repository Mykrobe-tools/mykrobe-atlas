/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import HeaderContainer from '../ui/header/HeaderContainer';
import TabNavigation, {
  TabNavigationLink,
} from '../ui/navigation/TabNavigation';
import styles from './ExperimentNavigation.module.scss';

class ExperimentNavigation extends React.Component<*> {
  render() {
    const { match, experimentIsolateId } = this.props;
    return (
      <div className={styles.container}>
        <HeaderContainer title={experimentIsolateId} />
        <TabNavigation>
          <TabNavigationLink to={`${match.url}/metadata`}>
            Metadata
          </TabNavigationLink>
          <TabNavigationLink to={`${match.url}/resistance`}>
            Resistance
          </TabNavigationLink>
          <TabNavigationLink to={`${match.url}/analysis`}>
            Analysis
          </TabNavigationLink>
          <TabNavigationLink to={`${match.url}/summary`}>
            Summary
          </TabNavigationLink>
        </TabNavigation>
      </div>
    );
  }
}

ExperimentNavigation.propTypes = {
  match: PropTypes.object,
  experiment: PropTypes.object,
};

export default ExperimentNavigation;
