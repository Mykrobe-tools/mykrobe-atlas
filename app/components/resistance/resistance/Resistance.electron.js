/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { withRouter, Route, Redirect, Switch, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './Resistance.css';
import MykrobeConfig from '../../../services/MykrobeConfig';
import * as TargetConstants from '../../../constants/TargetConstants';
import Logo from '../../logo/Logo';
import * as AnalyserActions from '../../../actions/AnalyserActions';

import ResistanceAllContainer from '../all/ResistanceAllContainer';
import ResistanceDrugsContainer from '../drugs/ResistanceDrugsContainer';
import ResistanceClassContainer from '../class/ResistanceClassContainer';
import ResistanceEvidenceContainer from '../evidence/ResistanceEvidenceContainer';
import ResistanceSpeciesContainer from '../species/ResistanceSpeciesContainer';

class Resistance extends React.Component {
  render() {
    const { match, analyseFileNew, analyseFileSave } = this.props;
    const path = '/results/resistance';
    const config = new MykrobeConfig();

    return (
      <div className={styles.container} data-tid="component-resistance">
        <div className={styles.header}>
          <div className={styles.logo}>
            <Logo />
          </div>
          <div className={styles.navigation}>
            <NavLink
              to={`${path}/all`}
              className={styles.navigationItem}
              activeClassName={styles.navigationItemActive}
              data-tid="button-resistance-all"
            >
              All
            </NavLink>
            {TargetConstants.SPECIES_TB === config.species ? (
              <NavLink
                to={`${path}/drugs`}
                className={styles.navigationItem}
                activeClassName={styles.navigationItemActive}
                data-tid="button-resistance-drugs"
              >
                Drugs
              </NavLink>
            ) : (
              <NavLink
                to={`${path}/class`}
                className={styles.navigationItem}
                activeClassName={styles.navigationItemActive}
                data-tid="button-resistance-class"
              >
                Class
              </NavLink>
            )}
            <NavLink
              to={`${path}/evidence`}
              className={styles.navigationItem}
              activeClassName={styles.navigationItemActive}
              data-tid="button-resistance-evidence"
            >
              Evidence
            </NavLink>
            <NavLink
              to={`${path}/species`}
              className={styles.navigationItem}
              activeClassName={styles.navigationItemActive}
              data-tid="button-resistance-species"
            >
              Species
            </NavLink>
          </div>
          <div className={styles.actions}>
            <a
              onClick={() => {
                analyseFileSave();
              }}
              className={styles.navigationItem}
              data-tid="button-file-save"
            >
              Save
            </a>
            <a
              onClick={() => {
                analyseFileNew();
              }}
              className={styles.navigationItem}
              data-tid="button-file-new"
            >
              New
            </a>
          </div>
        </div>
        <Switch>
          <Route
            exact
            path={match.url}
            component={() => <Redirect to={`${match.url}/all`} />}
          />
          <Route path={`${match.url}/all`} component={ResistanceAllContainer} />
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
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      analyseFileSave: AnalyserActions.analyseFileSave,
      analyseFileNew: AnalyserActions.analyseFileNew,
    },
    dispatch
  );
}

Resistance.propTypes = {
  analyseFileSave: PropTypes.func.isRequired,
  analyseFileNew: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Resistance)
);
