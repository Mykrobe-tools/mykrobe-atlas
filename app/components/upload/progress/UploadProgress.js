/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './UploadProgress.scss';
import UploadProgressBar from './UploadProgressBar';
import withFileUpload from '../../../hoc/withFileUpload';
import { uploadFileCancel } from '../../../modules/upload';

class UploadProgress extends React.Component<*> {
  render() {
    const {
      isBusy,
      progress,
      isComputingChecksums,
      fileName,
      experimentId,
    } = this.props;
    const description = isComputingChecksums
      ? 'Computing checksums'
      : 'Uploading';
    return (
      <div className={styles.container}>
        {isBusy && (
          <UploadProgressBar
            progress={progress}
            description={description}
            filename={fileName}
            onCancel={this.onCancelClick}
            experimentId={experimentId}
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

UploadProgress.propTypes = {
  progress: PropTypes.number.isRequired,
  isBusy: PropTypes.bool.isRequired,
  checksumProgress: PropTypes.number.isRequired,
  uploadProgess: PropTypes.number.isRequired,
  isComputingChecksums: PropTypes.bool.isRequired,
  isUploading: PropTypes.bool.isRequired,
  uploadFileCancel: PropTypes.func.isRequired,
  fileName: PropTypes.string,
  experimentId: PropTypes.string,
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ uploadFileCancel }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withFileUpload(UploadProgress));
