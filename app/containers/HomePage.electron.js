/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Upload from '../components/upload/Upload';

import {
  analyseFileCancel,
  analyseFile,
  getIsAnalysing,
  getProgress,
} from '../modules/desktop';

class HomePage extends React.Component<*> {
  render() {
    const {
      analyseFile,
      analyseFileCancel,
      isAnalysing,
      progress,
    } = this.props;
    return (
      <Upload
        analyseFile={analyseFile}
        analyseFileCancel={analyseFileCancel}
        isAnalysing={isAnalysing}
        progress={progress}
      />
    );
  }
}

HomePage.propTypes = {
  analyseFile: PropTypes.func.isRequired,
  analyseFileCancel: PropTypes.func.isRequired,
  isAnalysing: PropTypes.bool,
  progress: PropTypes.number,
};

const withRedux = connect(
  state => ({
    isAnalysing: getIsAnalysing(state),
    progress: getProgress(state),
  }),
  {
    analyseFile,
    analyseFileCancel,
  }
);

export default withRedux(HomePage);
