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
  state: {
    isDragActive: Boolean,
    isProcessing: Boolean,
    isPaused: Boolean,
    checksumProgress: Number,
    uploadProgress: Number
  };

  constructor(props: Object) {
    super(props);
    this.state = {
      isDragActive: false,
      isProcessing: false,
      isPaused: false,
      checksumProgress: 0,
      uploadProgress: 0
    };
  }

  componentWillMount() {
    this.initUploader();
  }

  componentDidMount() {
    this.bindUploader();
  }

  componentDidUpdate() {
    this.bindUploader();
  }

  bindUploader() {
    // only bind the uploader to dom elements if not currently uploading
    // (upload links will only be rendered if not uploading)
    if (this._dropzone && this._uploadButton) {
      this.resumable.assignDrop(this._dropzone);
      this.resumable.assignBrowse(this._uploadButton);
    }
  }

  resetState() {
    this.setState({
      isDragActive: false,
      isProcessing: false,
      isPaused: false,
      checksumProgress: 0,
      uploadProgress: 0
    });
  }

  // called when a file has been selected from third-party storage
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

  // called when a file has been successfully uploaded locally
  onLocalFileSelected(file) {
    const {showNotification} = this.props;
    console.log('onLocalFileSelected', file);
    showNotification({
      category: NotificationCategories.SUCCESS,
      content: `File Upload Complete: ${file.file.name}`,
      autoHide: true
    });
    this.setState({uploadProgress: 100});
    const {analyseFile} = this.props;
    analyseFile(file.file);
  }

  onCancelClick(e) {
    const {showNotification} = this.props;
    console.log('onCancelClick');
    this.resumable.cancel();
    this.resetState();
    showNotification({
      category: NotificationCategories.MESSAGE,
      content: 'The upload was cancelled',
      autoHide: true
    });
  }

  onPauseClick(e) {
    console.log('onPauseClick');
    this.resumable.pause();
    this.setState({
      isPaused: true
    });
  }

  onResumeClick(e) {
    console.log('onResumeClick');
    this.resumable.upload();
    this.setState({
      isPaused: false
    });
  }

  onFileAdded(file: File) {
    this.setState({
      isProcessing: true,
      isDragActive: false
    });
    this.computeChecksums(file);
  }

  onUploadProgress() {
    const uploadProgress = Math.floor(this.resumable.progress() * 100);
    this.setState({uploadProgress});
  }

  onUploadError(error: String) {
    const {showNotification} = this.props;
    showNotification({
      category: NotificationCategories.ERROR,
      content: error
    });
  }

  onDragOver() {
    this.setState({
      isDragActive: true
    });
  }

  onDragLeave() {
    this.setState({
      isDragActive: false
    });
  }

  initUploader() {
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
      this.onFileAdded(file);
    });
    this.resumable.on('fileProgress', (file) => {
      this.onUploadProgress();
    });
    this.resumable.on('fileSuccess', (file) => {
      this.onLocalFileSelected(file);
    });
  }

  startUpload() {
    this.resumable.upload();
  }

  // Calculate md5 checksums for each chunk
  // Adapted from: https://github.com/23/resumable.js/issues/135#issuecomment-31123690
  computeChecksums(resumableFile, offset, fileReader) {
    const {isProcessing} = this.state;
    if (!isProcessing) return;

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

    const checksumProgress = Math.ceil((offset / numChunks) * 100);
    this.setState({checksumProgress});

    fileReader.onloadend = (e) => {
      var spark = SparkMD5.ArrayBuffer.hash(e.target.result);
      resumableFile.hashes.push(spark);
      if (numChunks > offset + 1) {
        this.computeChecksums(resumableFile, offset + 1, fileReader);
      }
      else {
        this.setState({checksumProgress: 100});
        this.startUpload();
      }
    };
    fileReader.readAsArrayBuffer(bytes);
  }

  render() {
    let content;
    const {isDragActive, isProcessing, isPaused, uploadProgress, checksumProgress} = this.state;
    if (isProcessing) {
      this._uploadButton = null;
      this._dropzone = null;
      content = (
        <div className={styles.promptContainer}>
          <div className={styles.progressTitle}>
            {checksumProgress < 100 ? checksumProgress : uploadProgress}%
          </div>
          <p className={styles.progressStatus}>
            {checksumProgress < 100 ? 'Processing' : 'Uploading'}
          </p>
          <CircularProgress lightPercentage={checksumProgress} darkPercentage={uploadProgress} />
          <div className={styles.dots}>
            <div className={styles.dotOne} />
            <div className={styles.dotTwo} />
            <div className={styles.dotThree} />
          </div>
          <div className={styles.buttonContainer}>
            {!isPaused &&
              <button type="button"
                className={styles.button}
                onClick={event => this.onPauseClick(event)}
                disabled={checksumProgress < 100}>
                Pause
              </button>
            }
            {isPaused &&
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
        className={isDragActive ? styles.containerDragActive : styles.container}
        onDragOver={(e) => {
          this.onDragOver(e);
        }}
        onDragLeave={(e) => {
          this.onDragLeave(e);
        }}
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
