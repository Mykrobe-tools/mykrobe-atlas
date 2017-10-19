/* @flow */

import React, { Component, PropTypes } from 'react';

import styles from './About.css';
import Logo from '../logo/Logo';

import { launchWebsite } from '../../helpers/UIHelpers'; // eslint-disable-line import/named

const pkg = require('../../../electron/static/package.json');

class About extends Component {
  back = e => {
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
          <p>UI version {pkg.displayVersion}</p>
        </div>
      </div>
    );
  }
}

export default About;
