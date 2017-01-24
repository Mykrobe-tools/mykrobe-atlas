/* @flow */

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AnalyserActions from '../actions/AnalyserActions';
import Upload from '../components/upload/Upload';

const MykrobeService = IS_ELECTRON ? require('../api/MykrobeServiceElectron') : require('../api/MykrobeService');

// $FlowFixMe: Ignore missing require().default
const service = new MykrobeService();

class HomePage extends Component {
  render() {
    return (
      <Upload uploader={service.uploader} {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    analyseRemoteFile: AnalyserActions.analyseRemoteFile
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
