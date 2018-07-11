/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styles from './Analysing.css';
import AnalysingProgressBar from './AnalysingProgressBar';
import * as UIHelpers from '../../helpers/UIHelpers'; // eslint-disable-line import/namespace

import withFileUpload from '../../hoc/withFileUpload';

import { uploadFileCancel } from '../../modules/upload';

class Analysing extends React.Component<*> {
  render() {
    const { isBusy, progress, isComputingChecksums } = this.props;
    if (IS_ELECTRON) {
      UIHelpers.setProgress(progress); // eslint-disable-line import/namespace
    }
    const description = isComputingChecksums
      ? 'Computing checksums'
      : 'Uploading';
    return (
      <div className={styles.container}>
        {isBusy && (
          <AnalysingProgressBar
            progress={progress}
            description={description}
            filename={'filename in here'}
            onCancel={this.onCancelClick}
          />
        )}
      </div>
    );
  }

  onCancelClick = () => {
    const { uploadFileCancel } = this.props;
    uploadFileCancel();
  };
}

Analysing.propTypes = {
  progress: PropTypes.number.isRequired,
  isBusy: PropTypes.bool.isRequired,
  checksumProgress: PropTypes.number.isRequired,
  uploadProgess: PropTypes.number.isRequired,
  isComputingChecksums: PropTypes.bool.isRequired,
  isUploading: PropTypes.bool.isRequired,
  uploadFileCancel: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ uploadFileCancel }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withFileUpload(Analysing));
