/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './Upload.css';
import AnimatedBackground from '../animatedbackground/AnimatedBackground';
import Logo from '../logo/Logo';
import PopoverMenu from '../ui/PopoverMenu';

import {
  getIsAuthenticated,
  getAccessToken,
} from 'makeandship-js-common/src/modules/auth';

type State = {
  isDragActive: boolean,
};

class Upload extends React.Component<*, State> {
  _uploadButton: Element;
  _dropzone: Element;

  constructor(props: Object) {
    super(props);
    this.state = {
      isDragActive: false,
    };
  }

  setDropzoneRef = (ref: ?Element) => {
    if (!ref) {
      return;
    }
    this._dropzone = ref;
    this.bindUploader();
  };

  setUploadButtonRef = (ref: ?Element) => {
    if (!ref) {
      return;
    }
    this._uploadButton = ref;
    this.bindUploader();
  };

  bindUploader = () => {
    const { isAuthenticated, accessToken } = this.props;
    const { uploadFile } = this.props.service;
    if (isAuthenticated && this._dropzone && this._uploadButton) {
      uploadFile.bindUploader(this._dropzone, this._uploadButton);
      uploadFile.setAccessToken(accessToken);
    }
  };

  componentWillUnmount() {
    const { isAuthenticated } = this.props;
    const { uploadFile } = this.props.service;
    if (isAuthenticated) {
      uploadFile.unbindUploader(this._dropzone, this._uploadButton);
    }
  }

  componentDidUpdate = prevProps => {
    const { uploadFile } = this.props.service;
    if (
      this.props.accessToken &&
      this.props.accessToken !== prevProps.accessToken
    ) {
      // pass updated token into uploader (TODO: redux-saga)
      uploadFile.setAccessToken(this.props.accessToken);
    }
  };

  onDragOver() {
    this.setState({
      isDragActive: true,
    });
  }

  onDragLeave() {
    this.setState({
      isDragActive: false,
    });
  }

  popoverMenuLinks() {
    const {
      uploadBox,
      uploadDropbox,
      uploadGoogleDrive,
      uploadOneDrive,
    } = this.props.service;
    return [
      {
        text: 'Computer',
        onClick: (e: Event) => {
          e.preventDefault();
          if (this._uploadButton) {
            this._uploadButton.click();
          }
        },
      },
      {
        text: 'Dropbox',
        onClick: (e: Event) => {
          e.preventDefault();
          uploadDropbox.trigger();
        },
      },
      {
        text: 'Box',
        onClick: (e: Event) => {
          e.preventDefault();
          uploadBox.trigger();
        },
      },
      {
        text: 'Google Drive',
        onClick: (e: Event) => {
          e.preventDefault();
          uploadGoogleDrive.trigger();
        },
      },
      {
        text: 'OneDrive',
        onClick: (e: Event) => {
          e.preventDefault();
          uploadOneDrive.trigger();
        },
      },
    ];
  }

  render() {
    const { isDragActive } = this.state;
    const { isAuthenticated } = this.props;
    const popoverMenuLinks = this.popoverMenuLinks();
    return (
      <div
        className={
          isDragActive && isAuthenticated
            ? styles.containerDragActive
            : styles.container
        }
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        ref={this.setDropzoneRef}
        data-tid="component-upload"
      >
        <AnimatedBackground />
        <div className={styles.contentContainer}>
          <div className={styles.content}>
            <div className={styles.logoWrap}>
              <Logo width={192} />
            </div>
            <div className={styles.title}>
              Outbreak and resistance analysis in minutes
            </div>
            {isAuthenticated && (
              <div className={styles.buttonContainer}>
                <span
                  className={styles.buttonOffscreen}
                  ref={this.setUploadButtonRef}
                />
                <PopoverMenu
                  toggleText="Analyse Sample"
                  links={popoverMenuLinks}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: getIsAuthenticated(state),
    accessToken: getAccessToken(state),
  };
}

Upload.propTypes = {
  service: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  accessToken: PropTypes.string,
};

export default connect(mapStateToProps)(Upload);
