/* @flow */

import * as React from 'react';
import { Link } from 'react-router-dom';

import styles from './Upload.scss';
import AnimatedBackgroundCanvas from '../ui/background/AnimatedBackgroundCanvas';
import Logo from '../ui/logo/Logo';
import HeaderContainer from '../ui/header/HeaderContainer';

import UploadButton from './button/UploadButton';

import { withAuthPropTypes } from 'makeandship-js-common/src/hoc/withAuth';

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
        <HeaderContainer />
      </div>
    );
  }
}

Upload.propTypes = {
  ...withAuthPropTypes,
};

export default Upload;
