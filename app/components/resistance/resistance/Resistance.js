/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Route, Redirect, Switch, NavLink } from 'react-router-dom';

import ResistanceAllContainer from '../all/ResistanceAllContainer';
import ResistanceDrugsContainer from '../drugs/ResistanceDrugsContainer';
import ResistanceClassContainer from '../class/ResistanceClassContainer';
import ResistanceEvidenceContainer from '../evidence/ResistanceEvidenceContainer';
import ResistanceSpeciesContainer from '../species/ResistanceSpeciesContainer';

import styles from './Resistance.css';
import Uploading from '../../ui/Uploading';
import * as TargetConstants from '../../../constants/TargetConstants';

import withFileUpload from '../../../hoc/withFileUpload';

class Resistance extends React.Component<*> {
  render() {
    const { isBusy, match } = this.props;
    let content;

    if (isBusy) {
      content = <Uploading sectionName="Resistance" />;
    } else {
      content = (
        <div className={styles.content}>
          <div className={styles.header}>
            {TargetConstants.SPECIES_TB === TargetConstants.SPECIES ? (
              <div className={styles.navigation}>
                <NavLink
                  to={`${match.url}/all`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  All
                </NavLink>
                <NavLink
                  to={`${match.url}/drugs`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  Drugs
                </NavLink>
                <NavLink
                  to={`${match.url}/evidence`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  Evidence
                </NavLink>
                <NavLink
                  to={`${match.url}/species`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  Species
                </NavLink>
              </div>
            ) : (
              <div className={styles.navigation}>
                <NavLink
                  to={`${match.url}/all`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  All
                </NavLink>
                <NavLink
                  to={`${match.url}/class`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  Class
                </NavLink>
                <NavLink
                  to={`${match.url}/evidence`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  Evidence
                </NavLink>
                <NavLink
                  to={`${match.url}/species`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  Species
                </NavLink>
              </div>
            )}
          </div>
          <Switch>
            <Route
              exact
              path={match.url}
              component={() => <Redirect to={`${match.url}/all`} />}
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
  dispatch: PropTypes.func.isRequired,
  isBusy: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
};

export default withRouter(connect(mapStateToProps)(withFileUpload(Resistance)));
