/* @flow */

import React, { Component, PropTypes } from 'react';
import styles from './Upload.css';
import AnimatedBackground from '../animatedbackground/AnimatedBackground';
import Logo from '../logo/Logo';
import UploadBtnDropbox from './UploadBtnDropbox';
import UploadBtnGoogleDrive from './UploadBtnGoogleDrive';
import UploadBtnBox from './UploadBtnBox';
import UploadBtnOneDrive from './UploadBtnOneDrive';

class Upload extends Component {
  _uploadButton: Element;
  _dropzone: Element;
  state: {
    isDragActive: boolean
  };

  constructor(props: Object) {
    super(props);
    this.state = {
      isDragActive: false
    };
  }

  componentDidMount() {
    const {uploader} = this.props;
    uploader.bindUploader(this._dropzone, this._uploadButton);
  }

  componentWillUnmount() {
    const {uploader} = this.props;
    uploader.unbindUploader(this._dropzone, this._uploadButton);
  }

  onDragOver() {
    this.setState({
      isDragActive: true
    });
  }

  onDragLeave() {
    this.setState({
      isDragActive: false
    });
  }

  render() {
    const {isDragActive} = this.state;
    const {uploader, analyseRemoteFile} = this.props;
    return (
      <div
        className={isDragActive ? styles.containerDragActive : styles.container}
        onDragOver={(e) => {
          this.onDragOver(e);
        }}
        onDragLeave={(e) => {
          this.onDragLeave(e);
        }}
        ref={(ref) => {
          this._dropzone = ref;
        }}>
        <AnimatedBackground />
        <div className={styles.contentContainer}>
          <div className={styles.content}>
            <div className={styles.logo}>
              <Logo />
            </div>
            <div className={styles.title}>
              Outbreak and resistance analysis in minutes
            </div>
            <div className={styles.buttonContainer}>
              {uploader.isSupported() &&
                <button
                  type="button"
                  className={styles.button}
                  ref={(ref) => {
                    this._uploadButton = ref;
                  }}>
                  Computer
                </button>
              }
              <UploadBtnDropbox
                acceptedExtensions={uploader.getAcceptedExtensions()}
                onFileSelect={(file) => analyseRemoteFile(file)} />
              <UploadBtnBox
                onFileSelect={(file) => analyseRemoteFile(file)} />
              <UploadBtnGoogleDrive
                onFileSelect={(file) => analyseRemoteFile(file)} />
              <UploadBtnOneDrive
                onFileSelect={(file) => analyseRemoteFile(file)} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Upload.propTypes = {
  uploader: PropTypes.object.isRequired,
  analyseRemoteFile: PropTypes.func.isRequired
};

export default Upload;
