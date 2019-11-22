/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Upload from '../components/upload/Upload';
import AppDocumentTitle from '../components/ui/AppDocumentTitle';

import withExperiment, { withExperimentPropTypes } from '../hoc/withExperiment';

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
      experimentIsolateId,
    } = this.props;
    const documentTitle = isAnalysing ? (
      <AppDocumentTitle title={[experimentIsolateId, 'Analysing']} />
    ) : null;
    return (
      <React.Fragment>
        {documentTitle}
        <Upload
          analyseFile={analyseFile}
          analyseFileCancel={analyseFileCancel}
          isAnalysing={isAnalysing}
          progress={progress}
        />
      </React.Fragment>
    );
  }
}

HomePage.propTypes = {
  ...withExperimentPropTypes,
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

export default withRedux(withExperiment(HomePage));
