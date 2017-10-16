/* @flow */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AnalyserActions from '../actions/AnalyserActions';
import UploadElectron from '../components/upload/UploadElectron';

class HomePage extends Component {
  render() {
    const { analyseFile } = this.props;
    return <UploadElectron analyseFile={analyseFile} />;
  }
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      analyseFile: AnalyserActions.analyseFile,
    },
    dispatch
  );
}

HomePage.propTypes = {
  analyseFile: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
