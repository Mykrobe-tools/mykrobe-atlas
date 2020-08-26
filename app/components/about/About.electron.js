/* @flow */

import * as React from 'react';

import styles from './About.module.scss';
import Logo from '../ui/logo/Logo';
import AppDocumentTitle from '../ui/AppDocumentTitle';

import { launchWebsite } from '../../helpers/UIHelpers'; // eslint-disable-line import/named

const {
  version,
  executableVersion,
} = require('../../../desktop/resources/package.json');

const About = (): React.Element<*> => {
  const onLaunchWebsite = (e) => {
    e.preventDefault();
    launchWebsite();
  };
  return (
    <div className={styles.container}>
      <AppDocumentTitle title={'About'} />
      <Logo />
      <div className={styles.content}>
        <p>
          Predictor version {executableVersion}
          <br></br>
          Desktop app version v{version}
        </p>
        <p>
          For research use only. Not for use in diagnostic procedures. For
          further information see{' '}
          <a href="#" onClick={onLaunchWebsite}>
            www.mykrobe.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default About;
