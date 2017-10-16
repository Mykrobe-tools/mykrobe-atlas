/* @flow */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AnalyserActions from '../actions/AnalyserActions';
import UploadElectron from '../components/upload/UploadElectron';

class HomePage extends Component {
  render() {
    const { analyseFile, analyseFileCancel, analyser } = this.props;
    return (
      <UploadElectron
        analyseFile={analyseFile}
        analyseFileCancel={analyseFileCancel}
        analyser={analyser}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      analyseFile: AnalyserActions.analyseFile,
      analyseFileCancel: AnalyserActions.analyseFileCancel,
    },
    dispatch
  );
}

HomePage.propTypes = {
  analyser: PropTypes.object.isRequired,
  analyseFile: PropTypes.func.isRequired,
  analyseFileCancel: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
