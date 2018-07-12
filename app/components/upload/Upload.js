/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './Upload.css';
import AnimatedBackground from '../animatedbackground/AnimatedBackground';
import Logo from '../logo/Logo';
import PopoverMenu from '../ui/PopoverMenu';

import { getIsAuthenticated } from 'makeandship-js-common/src/modules/auth';

import {
  uploadFileAssignDrop,
  uploadFileAssignBrowse,
  uploadFileUnassignDrop,
  uploadDropbox,
  uploadGoogleDrive,
  uploadBox,
  uploadOneDrive,
} from '../../modules/upload';

type State = {
  isDragActive: boolean,
};

class Upload extends React.Component<*, State> {
  _uploadButton: Element;
  _dropzone: Element;

  state = {
    isDragActive: false,
  };

  setDropzoneRef = (ref: ?Element) => {
    if (!ref) {
      return;
    }
    this._dropzone = ref;
    const { uploadFileAssignDrop } = this.props;
    uploadFileAssignDrop(this._dropzone);
  };

  setUploadButtonRef = (ref: ?Element) => {
    if (!ref) {
      return;
    }
    this._uploadButton = ref;
    const { uploadFileAssignBrowse } = this.props;
    uploadFileAssignBrowse(this._uploadButton);
  };

  componentWillUnmount() {
    const { uploadFileUnassignDrop } = this.props;
    if (this._dropzone) {
      uploadFileUnassignDrop(this._dropzone);
    }
  }

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
      uploadDropbox,
      uploadGoogleDrive,
      uploadBox,
      uploadOneDrive,
    } = this.props;
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
          uploadDropbox();
        },
      },
      {
        text: 'Box',
        onClick: (e: Event) => {
          e.preventDefault();
          uploadBox();
        },
      },
      {
        text: 'Google Drive',
        onClick: (e: Event) => {
          e.preventDefault();
          uploadGoogleDrive();
        },
      },
      {
        text: 'OneDrive',
        onClick: (e: Event) => {
          e.preventDefault();
          uploadOneDrive();
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

Upload.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  uploadFileAssignDrop: PropTypes.func.isRequired,
  uploadFileAssignBrowse: PropTypes.func.isRequired,
  uploadFileUnassignDrop: PropTypes.func.isRequired,
  uploadDropbox: PropTypes.func.isRequired,
  uploadGoogleDrive: PropTypes.func.isRequired,
  uploadBox: PropTypes.func.isRequired,
  uploadOneDrive: PropTypes.func.isRequired,
};

const withRedux = connect(
  state => ({
    isAuthenticated: getIsAuthenticated(state),
  }),
  {
    uploadFileAssignDrop,
    uploadFileAssignBrowse,
    uploadFileUnassignDrop,
    uploadDropbox,
    uploadGoogleDrive,
    uploadBox,
    uploadOneDrive,
  }
);

export default withRedux(Upload);
