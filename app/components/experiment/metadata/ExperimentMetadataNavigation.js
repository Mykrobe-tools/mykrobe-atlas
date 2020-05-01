/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';

import CircularProgress from '../../ui/CircularProgress';
import TabNavigation, {
  TabNavigationLink,
} from '../../ui/navigation/TabNavigation';

import { withFileUploadPropTypes } from '../../../hoc/withFileUpload';
import { withExperimentPropTypes } from '../../../hoc/withExperiment';

import styles from './ExperimentMetadataNavigation.module.scss';

class ExperimentMetadataNavigation extends React.Component<*> {
  render() {
    const {
      match,
      isBusyWithCurrentRoute,
      experimentOwnerIsCurrentUser,
      completion,
    } = this.props;
    const { complete, total } = completion;
    const percent = Math.round((100 * complete) / total);
    return (
      <div className={styles.container}>
        <Container fluid>
          {isBusyWithCurrentRoute && (
            <div className={styles.uploadingMessage}>
              <div className={styles.uploadingMessageTitle}>
                Your sample is uploading
              </div>
            </div>
          )}
          {experimentOwnerIsCurrentUser && (
            <div className={styles.progress}>
              <div className={styles.percent}>
                <div className={styles.circularProgressContainer}>
                  <CircularProgress percentage={percent} />
                </div>
                <div className={styles.percentContent}>
                  <span>
                    <span className={styles.percentValue}>{percent}</span>
                    <span className={styles.percentSign}>%</span>
                  </span>
                </div>
              </div>
              <div className={styles.title}>
                <div className={styles.titleHead}>
                  Complete metadata benefits everyone
                </div>
                <div className={styles.titleSubhead}>
                  Help Atlas provide more accurate results
                </div>
              </div>
            </div>
          )}
        </Container>
        <TabNavigation>
          <TabNavigationLink to={`${match.url}/patient`}>
            Patient
          </TabNavigationLink>
          <TabNavigationLink to={`${match.url}/sample`}>
            Sample
          </TabNavigationLink>
          <TabNavigationLink to={`${match.url}/genotyping`}>
            Genotyping
          </TabNavigationLink>
          <TabNavigationLink to={`${match.url}/phenotyping`}>
            Phenotyping
          </TabNavigationLink>
          <TabNavigationLink to={`${match.url}/treatment`}>
            Treatment
          </TabNavigationLink>
          <TabNavigationLink to={`${match.url}/outcome`}>
            Outcome
          </TabNavigationLink>
        </TabNavigation>
      </div>
    );
  }
}

ExperimentMetadataNavigation.propTypes = {
  ...withFileUploadPropTypes,
  ...withExperimentPropTypes,
  match: PropTypes.object,
};

export default ExperimentMetadataNavigation;
