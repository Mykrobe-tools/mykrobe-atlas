/* @flow */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AnalyserActions from '../actions/AnalyserActions';
import Upload from '../components/upload/Upload';
import UploadService from '../services/upload/UploadService';

class HomePage extends Component {
  service: UploadService;

  constructor() {
    super();
    this.service = new UploadService();
  }

  componentDidMount() {
    const { analyseRemoteFile } = this.props;
    this.service.uploadDropbox.on('fileSelected', analyseRemoteFile);
    this.service.uploadBox.on('fileSelected', analyseRemoteFile);
    this.service.uploadGoogleDrive.on('fileSelected', analyseRemoteFile);
    this.service.uploadOneDrive.on('fileSelected', analyseRemoteFile);
  }

  componentWillUnmount() {
    this.service.uploadDropbox.removeAllListeners('fileSelected');
    this.service.uploadBox.removeAllListeners('fileSelected');
    this.service.uploadGoogleDrive.removeAllListeners('fileSelected');
    this.service.uploadOneDrive.removeAllListeners('fileSelected');
  }

  render() {
    return <Upload service={this.service} {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      analyseRemoteFile: AnalyserActions.analyseRemoteFile,
    },
    dispatch
  );
}

HomePage.propTypes = {
  analyseRemoteFile: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
