/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import type { AuthType } from '../../types/AuthTypes';

import styles from './Upload.css';
import AnimatedBackground from '../animatedbackground/AnimatedBackground';
import Logo from '../logo/Logo';
import PopoverMenu from '../ui/PopoverMenu';

class Upload extends React.Component {
  _uploadButton: HTMLAnchorElement;
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

  componentDidMount() {
    const auth: AuthType = this.props.auth;
    const { isAuthenticated } = auth;
    const { uploadFile } = this.props.service;
    if (isAuthenticated) {
      uploadFile.bindUploader(this._dropzone, this._uploadButton);
    }
  }

  componentWillUnmount() {
    const auth: AuthType = this.props.auth;
    const { isAuthenticated } = auth;
    const { uploadFile } = this.props.service;
    if (isAuthenticated) {
      uploadFile.unbindUploader(this._dropzone, this._uploadButton);
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
    const auth: AuthType = this.props.auth;
    const { isAuthenticated } = auth;
    return (
      <div
        className={
          isDragActive && isAuthenticated
            ? styles.containerDragActive
            : styles.container
        }
        onDragOver={e => {
          this.onDragOver(e);
        }}
        onDragLeave={e => {
          this.onDragLeave(e);
        }}
        ref={ref => {
          this._dropzone = ref;
        }}
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
                <button
                  type="button"
                  className={styles.buttonOffscreen}
                  ref={ref => {
                    this._uploadButton = ref;
                  }}
                />
                <PopoverMenu
                  toggleText="Analyse Sample"
                  links={this.popoverMenuLinks()}
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
    auth: state.auth,
  };
}

Upload.propTypes = {
  service: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Upload);
