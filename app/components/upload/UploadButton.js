/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonGroup,
} from 'reactstrap';

import {
  uploadFileAssignBrowse,
  uploadDropbox,
  uploadGoogleDrive,
  uploadBox,
  uploadOneDrive,
} from '../../modules/upload';

class UploadButton extends React.Component<*> {
  _uploadButton: Element;

  setUploadButtonRef = (ref: ?Element) => {
    if (!ref) {
      return;
    }
    this._uploadButton = ref;
    const { uploadFileAssignBrowse } = this.props;
    uploadFileAssignBrowse(this._uploadButton);
  };

  onComputerClick = e => {
    e && e.preventDefault();
    this._uploadButton && this._uploadButton.click();
  };

  onDropboxClick = e => {
    const { uploadDropbox } = this.props;
    e && e.preventDefault();
    uploadDropbox();
  };

  onGoogleDriveClick = e => {
    const { uploadGoogleDrive } = this.props;
    e && e.preventDefault();
    uploadGoogleDrive();
  };

  onBoxClick = e => {
    const { uploadBox } = this.props;
    e && e.preventDefault();
    uploadBox();
  };

  onOneDriveClick = e => {
    const { uploadOneDrive } = this.props;
    e && e.preventDefault();
    uploadOneDrive();
  };

  render() {
    const { size, right } = this.props;
    return (
      <UncontrolledDropdown>
        <span style={{ display: 'none' }} ref={this.setUploadButtonRef} />
        <DropdownToggle outline caret size={size}>
          Analyse Sample
        </DropdownToggle>
        <DropdownMenu right={right}>
          <DropdownItem onClick={this.onComputerClick}>Computer</DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={this.onDropboxClick}>Dropbox</DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={this.onBoxClick}>Box</DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={this.onGoogleDriveClick}>
            Google Drive
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={this.onOneDriveClick}>OneDrive</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }

  static defaultProps = {
    size: 'sm',
    right: false,
  };
}

UploadButton.propTypes = {
  uploadFileAssignBrowse: PropTypes.func.isRequired,
  uploadDropbox: PropTypes.func.isRequired,
  uploadGoogleDrive: PropTypes.func.isRequired,
  uploadBox: PropTypes.func.isRequired,
  uploadOneDrive: PropTypes.func.isRequired,
  size: PropTypes.string.isRequired,
  right: PropTypes.bool.isRequired,
};

const withRedux = connect(
  null,
  {
    uploadFileAssignBrowse,
    uploadDropbox,
    uploadGoogleDrive,
    uploadBox,
    uploadOneDrive,
  }
);

export default withRedux(UploadButton);
