import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Resumablejs from 'resumablejs';
import SparkMD5 from 'spark-md5';
import styles from './Upload.css';
import { BASE_URL } from '../../constants/APIConstants';
import * as NotificationActions from '../../actions/NotificationActions';
import * as AnalyserActions from '../../actions/AnalyserActions';
import * as NotificationCategories from '../../constants/NotificationCategories';
import AnimatedBackground from '../animatedbackground/AnimatedBackground';
import CircularProgress from './CircularProgress';
import UploadBtnDropbox from './UploadBtnDropbox';
import UploadBtnGoogleDrive from './UploadBtnGoogleDrive';
import UploadBtnBox from './UploadBtnBox';
import UploadBtnOneDrive from './UploadBtnOneDrive';

const acceptedExtensions = ['json', 'bam', 'gz', 'fastq', 'jpg'];

class Upload extends Component {
  _uploadButton: Element;
  _dropzone: Element;
  resumable: Object;

  componentWillMount() {
    this.resumable = new Resumablejs({
      target: `${BASE_URL}/api/upload`,
      maxFiles: 1,
      minFileSize: 0,
      fileType: acceptedExtensions,
      query: (resumableFile, resumableObj) => {
        return {
          'checksum': resumableFile.hashes[resumableObj.offset]
        };
      },
      maxFilesErrorCallback: () => {
        this.onUploadError('Please upload one file at a time');
      },
      fileTypeErrorCallback: (file, errorCount) => {
        this.onUploadError('This filetype is unsupported');
      }
    });
    this.resumable.on('fileError', (file, message) => {
      this.onUploadError(`There was an error with the upload: ${message}`);
    });
    this.resumable.on('fileAdded', (file) => {
      this.computeHashes(file);
    });
    this.resumable.on('fileProgress', (file) => {
      this.forceUpdate();
    });
    this.resumable.on('fileSuccess', (file) => {
      this.onLocalFileSelected(file);
    });
  }

  // Calculate md5 checksums
  // Via: https://github.com/23/resumable.js/issues/135#issuecomment-31123690
  computeHashes(resumableFile, offset, fileReader) {

    // TODO: update UI while generating hashes
    // ...

    const round = resumableFile.resumableObj.getOpt('forceChunkSize') ? Math.ceil : Math.floor;
    const chunkSize = resumableFile.getOpt('chunkSize');
    const numChunks = Math.max(round(resumableFile.file.size / chunkSize), 1);
    const forceChunkSize = resumableFile.getOpt('forceChunkSize');
    const func = (resumableFile.file.slice ? 'slice' : (resumableFile.file.mozSlice ? 'mozSlice' : (resumableFile.file.webkitSlice ? 'webkitSlice' : 'slice')));
    let startByte;
    let endByte;
    let bytes;

    resumableFile.hashes = resumableFile.hashes || [];
    fileReader = fileReader || new FileReader();
    offset = offset || 0;

    startByte = offset * chunkSize;
    endByte = Math.min(resumableFile.file.size, (offset + 1) * chunkSize);

    if (resumableFile.file.size - endByte < chunkSize && !forceChunkSize) {
      endByte = resumableFile.file.size;
    }
    bytes = resumableFile.file[func](startByte, endByte);

    fileReader.onloadend = (e) => {
      var spark = SparkMD5.ArrayBuffer.hash(e.target.result);
      resumableFile.hashes.push(spark);
      if (numChunks > offset + 1) {
        this.computeHashes(resumableFile, offset + 1, fileReader);
      }
      else {
        this.resumable.upload();
      }
    };
    fileReader.readAsArrayBuffer(bytes);
  }

  bindUploader() {
    if (this._dropzone && this._uploadButton) {
      this.resumable.assignDrop(this._dropzone);
      this.resumable.assignBrowse(this._uploadButton);
    }
  }

  componentDidMount() {
    this.bindUploader();
  }

  componentDidUpdate() {
    this.bindUploader();
  }

  onRemoteFileSelected(file) {
    const {showNotification} = this.props;
    console.log('onRemoteFileSelected', file);
    showNotification({
      category: NotificationCategories.SUCCESS,
      content: `File Selected: ${file.name}`,
      autoHide: true
    });
    // const {analyseFile} = this.props;
    // analyseFile(file);
  }

  onLocalFileSelected(file) {
    const {showNotification} = this.props;
    console.log('onLocalFileSelected', file);
    showNotification({
      category: NotificationCategories.SUCCESS,
      content: `File Upload Complete: ${file.file.name}`,
      autoHide: true
    });
    // const {analyseFile} = this.props;
    // analyseFile(file.file);
  }

  onCancelClick(e) {
    const {showNotification} = this.props;
    console.log('onCancelClick');
    this.resumable.cancel();
    showNotification({
      category: NotificationCategories.MESSAGE,
      content: 'The upload was cancelled',
      autoHide: true
    });
  }

  onPauseClick(e) {
    console.log('onPauseClick');
    this.resumable.pause();
  }

  onResumeClick(e) {
    console.log('onResumeClick');
    this.resumable.upload();
  }

  onUploadError(error: String) {
    const {showNotification} = this.props;
    showNotification({
      category: NotificationCategories.ERROR,
      content: error
    });
  }

  render() {
    let content;
    const progress = Math.floor(this.resumable.progress() * 100);
    const isUploading = this.resumable.isUploading();
    if (isUploading || (progress !== 0 && progress !== 100)) {
      this._uploadButton = null;
      this._dropzone = null;
      content = (
        <div className={styles.promptContainer}>
          <div className={styles.progressTitle}>
            {progress}%
          </div>
          <CircularProgress percentage={progress} />
          <div className={styles.dots}>
            <div className={styles.dotOne} />
            <div className={styles.dotTwo} />
            <div className={styles.dotThree} />
          </div>
          <div className={styles.buttonContainer}>
            {isUploading &&
              <button type="button" className={styles.button} onClick={event => this.onPauseClick(event)}>
                Pause
              </button>
            }
            {!isUploading &&
              <button type="button" className={styles.button} onClick={event => this.onResumeClick(event)}>
                Resume
              </button>
            }
            <button type="button" className={styles.button} onClick={event => this.onCancelClick(event)}>
              Cancel
            </button>
          </div>
        </div>
      );
    }
    else {
      content = (
        <div className={styles.promptContainer}>
          <div className={styles.promptIcon} />
          <div className={styles.buttonTitle}>
            {this.resumable.support && <span>Drag a file here to analyse it,<br /> or </span>}
            upload a file from:
          </div>
          <div className={styles.buttonContainer}>
            {this.resumable.support &&
              <button
                type="button"
                className={styles.button}
                ref={(ref) => {
                  this._uploadButton = ref;
                }}>
                Computer
              </button>
            }
            <UploadBtnDropbox
              acceptedExtensions={acceptedExtensions}
              onFileSelect={(file) => this.onRemoteFileSelected(file)} />
            <UploadBtnBox
              onFileSelect={(file) => this.onRemoteFileSelected(file)} />
            <UploadBtnGoogleDrive
              onFileSelect={(file) => this.onRemoteFileSelected(file)} />
            <UploadBtnOneDrive
              onFileSelect={(file) => this.onRemoteFileSelected(file)} />
          </div>
        </div>
      );
    }
    return (
      <div
        className={styles.container}
        ref={(ref) => {
          this._dropzone = ref;
        }}>
        <AnimatedBackground />
        <div className={styles.contentContainer}>
          {content}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    analyseFile: AnalyserActions.analyseFile,
    analyseFileCancel: AnalyserActions.analyseFileCancel,
    showNotification: NotificationActions.showNotification
  }, dispatch);
}

Upload.propTypes = {
  analyseFile: PropTypes.func.isRequired,
  analyseFileCancel: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Upload);
