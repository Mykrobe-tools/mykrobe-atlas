/* @flow */

import * as React from 'react';

import styles from './About.module.scss';
import Logo from '../ui/logo/Logo';

import { launchWebsite } from '../../helpers/UIHelpers'; // eslint-disable-line import/named

const {
  version,
  executableVersion,
} = require('../../../desktop/static/package.json');

class About extends React.Component<*> {
  back = (e: any) => {
    e.preventDefault();
    window.history.go(-1);
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Logo />
          </div>
          <div className={styles.actions}>
            <a onClick={this.back} className={styles.close}>
              <i className="fa fa-times-circle" />
            </a>
          </div>
        </div>
        <div className={styles.content}>
          <p>
            For research use only. Not for use in diagnostic procedures. For
            further information see{' '}
            <a onClick={launchWebsite}>www.mykrobe.com</a>
          </p>
          <p>
            Predictor version {executableVersion} &middot; Desktop app version v
            {version}
          </p>
        </div>
      </div>
    );
  }
}

export default About;
