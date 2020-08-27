/* @flow */

import * as React from 'react';
import { Link } from 'react-router-dom';

import { withAuthPropTypes } from 'makeandship-js-common/src/hoc/withAuth';
import ActivityIndicator from 'makeandship-js-common/src/components/ui/loading/ActivityIndicator';

import styles from './Upload.module.scss';
import AnimatedBackgroundCanvas from '../ui/background/AnimatedBackgroundCanvas';
import Logo from '../ui/logo/Logo';
import HeaderContainer from '../ui/header/HeaderContainer';

import UploadButton from './button/UploadButton';

const Upload = ({
  isFetching,
  isAuthenticated,
}: React.ElementProps<*>): React.Element<*> => {
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
          {isAuthenticated ? (
            <React.Fragment>
              <div className={styles.buttonContainer}>
                <UploadButton size="lg" />
              </div>
              <Link
                className={styles.libraryLink}
                to="/experiments?sort=modified&order=desc"
              >
                <i className="fa fa-chevron-circle-right" /> Sample Library
              </Link>
            </React.Fragment>
          ) : isFetching ? (
            <div className={styles.activityIndicatorContainer}>
              <ActivityIndicator thickness={'0.2rem'} color={'mid'} />
            </div>
          ) : null}
        </div>
      </div>
      <HeaderContainer />
    </div>
  );
};

Upload.propTypes = {
  ...withAuthPropTypes,
};

export default Upload;
