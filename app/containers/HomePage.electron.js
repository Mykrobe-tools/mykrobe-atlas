/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Upload from '../components/upload/Upload';

import { analyseFileCancel, analyseFile } from '../modules/analyser';

import withAnalyser from '../hoc/withAnalyser';

class HomePage extends React.Component<*> {
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

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      analyseFile,
      analyseFileCancel,
    },
    dispatch
  );
}

HomePage.propTypes = {
  analyser: PropTypes.object.isRequired,
  analyseFile: PropTypes.func.isRequired,
  analyseFileCancel: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withAnalyser(HomePage)
);
