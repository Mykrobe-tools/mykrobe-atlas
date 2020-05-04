/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Route, Redirect, Switch } from 'react-router-dom';
import urljoin from 'url-join';

import ResistanceAllContainer from '../all/ResistanceAllContainer';
import ResistanceDrugsContainer from '../drugs/ResistanceDrugsContainer';
import ResistanceClassContainer from '../class/ResistanceClassContainer';
import ResistanceEvidenceContainer from '../evidence/ResistanceEvidenceContainer';
import ResistanceSpeciesContainer from '../species/ResistanceSpeciesContainer';

import Uploading from '../../../ui/Uploading';
import TabNavigation, {
  TabNavigationLink,
} from '../../../ui/navigation/TabNavigation';

import withFileUpload from '../../../../hoc/withFileUpload';

import styles from './Resistance.module.scss';

class Resistance extends React.Component<*> {
  render() {
    const { isBusyWithCurrentRoute, match } = this.props;
    let content;

    if (isBusyWithCurrentRoute) {
      content = <Uploading sectionName="Resistance" />;
    } else {
      content = (
        <div className={styles.content}>
          <TabNavigation>
            <TabNavigationLink to={`${match.url}/all`}>All</TabNavigationLink>
            <TabNavigationLink to={`${match.url}/drugs`}>
              Drugs
            </TabNavigationLink>
            <TabNavigationLink to={`${match.url}/evidence`}>
              Evidence
            </TabNavigationLink>
            <TabNavigationLink to={`${match.url}/species`}>
              Species
            </TabNavigationLink>
          </TabNavigation>
          <Switch>
            <Route
              exact
              path={match.url}
              component={() => <Redirect to={urljoin(match.url, 'all')} />}
            />
            <Route
              path={`${match.url}/all`}
              component={ResistanceAllContainer}
            />
            <Route
              path={`${match.url}/drugs`}
              component={ResistanceDrugsContainer}
            />
            <Route
              path={`${match.url}/class`}
              component={ResistanceClassContainer}
            />
            <Route
              path={`${match.url}/evidence`}
              component={ResistanceEvidenceContainer}
            />
            <Route
              path={`${match.url}/species`}
              component={ResistanceSpeciesContainer}
            />
          </Switch>
        </div>
      );
    }

    return <div className={styles.container}>{content}</div>;
  }
}

function mapStateToProps() {
  return {};
}

Resistance.propTypes = {
  isBusyWithCurrentRoute: PropTypes.bool,
  match: PropTypes.object,
};

export default withRouter(connect(mapStateToProps)(withFileUpload(Resistance)));
