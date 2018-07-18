/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './Upload.scss';
import AnimatedBackground from '../animatedbackground/AnimatedBackground';
import Logo from '../logo/Logo';
import Header from '../header/Header';

import UploadButton from './UploadButton';

import { getIsAuthenticated } from 'makeandship-js-common/src/modules/auth';

class Upload extends React.Component<*> {
  render() {
    const { isAuthenticated } = this.props;
    return (
      <div className={styles.container} data-tid="component-upload">
        <AnimatedBackground />
        <div className={styles.contentContainer}>
          <div className={styles.content}>
            <div className={styles.logoWrap}>
              <Logo width={192} />
            </div>
            <div className={styles.title}>
              <div>Outbreak and resistance</div>
              <div>analysis in minutes</div>
            </div>
            {isAuthenticated && (
              <div className={styles.buttonContainer}>
                <UploadButton size="lg" />
              </div>
            )}
          </div>
        </div>
        <Header />
      </div>
    );
  }
}

Upload.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

const withRedux = connect(state => ({
  isAuthenticated: getIsAuthenticated(state),
}));

export default withRedux(Upload);
