/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import styles from './Upload.scss';
import AnimatedBackgroundCanvas from '../background/AnimatedBackgroundCanvas';
import Logo from '../logo/Logo';
import Header from '../header/Header';

import UploadButton from './button/UploadButton';

import { getIsAuthenticated } from 'makeandship-js-common/src/modules/auth';

class Upload extends React.Component<*> {
  render() {
    const { isAuthenticated } = this.props;
    return (
      <div className={styles.container} data-tid="component-upload">
        <AnimatedBackgroundCanvas />
        <div className={styles.contentContainer}>
          <div className={styles.content}>
            <div className={styles.logoWrap}>
              <Logo width={192} />
            </div>
            <div className={styles.title}>
              <div>Antimicrobial resistance and outbreak</div>
              <div>information within minutes</div>
            </div>
            {isAuthenticated && (
              <div className={styles.buttonContainer}>
                <UploadButton size="lg" />
              </div>
            )}
            {isAuthenticated && (
              <Link className={styles.libraryLink} to="/experiments">
                <i className="fa fa-chevron-circle-right" /> Sample Library
              </Link>
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
