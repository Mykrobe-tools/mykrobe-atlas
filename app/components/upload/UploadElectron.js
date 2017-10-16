/* @flow */

import React, { Component, PropTypes } from 'react';
import path from 'path';

import styles from './Upload.css';
import AnimatedBackground from '../animatedbackground/AnimatedBackground';
import Logo from '../logo/Logo';
import * as UIHelpers from '../../helpers/UIHelpers';

class Upload extends Component {
  _dropzone: Element;
  state: {
    isDragActive: boolean,
  };

  constructor(props: Object) {
    super(props);
    this.state = {
      isDragActive: false,
    };
  }

  onOpenFile = () => {
    const { analyseFile } = this.props;
    const filePath = UIHelpers.openFileDialog();
    if (filePath) {
      const fileObject = {
        path: filePath,
        name: path.parse(filePath).base,
      };
      analyseFile(fileObject);
    }
  };

  onDragOver = () => {
    this.setState({
      isDragActive: true,
    });
  };

  onDragLeave = () => {
    this.setState({
      isDragActive: false,
    });
  };

  render() {
    const { isDragActive } = this.state;
    return (
      <div
        className={isDragActive ? styles.containerDragActive : styles.container}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
      >
        <AnimatedBackground />
        <div className={styles.contentContainer}>
          <div className={styles.content}>
            <div className={styles.logoWrap}>
              <div className={styles.logo}>
                <Logo />
              </div>
            </div>
            <div className={styles.title}>
              Outbreak and resistance analysis in minutes
            </div>
            <div className={styles.buttonContainer}>
              <button
                type="button"
                className={styles.button}
                onClick={this.onOpenFile}
              >
                Analyse Sample
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Upload.propTypes = {
  analyseFile: PropTypes.func.isRequired,
};

export default Upload;
