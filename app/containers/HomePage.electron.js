/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AnalyserActions from '../actions/AnalyserActions';
import Upload from '../components/upload/Upload';

class HomePage extends React.Component {
  render() {
    const { analyseFile, analyseFileCancel, analyser } = this.props;
    return (
      <Upload
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
