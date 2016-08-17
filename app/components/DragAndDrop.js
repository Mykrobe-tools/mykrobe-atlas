import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import styles from './DragAndDrop.css';
import fs from 'fs';

import Dropzone from 'react-dropzone';

import * as AnalyserActions from '../actions/AnalyserActions';

class DragAndDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: false,
      isAnalysing: false,
      isDone: false,
      progress: 0,
      isDragActive: false,
      json: false
    };
  }

  render() {
    const { isDragActive } = this.state;
    const {dispatch, analyser} = this.props;
    const disableClick = true;
    const multiple = false;

    const awaitingDragAndDrop = (
      <div>
        <div>
          Drag and drop {isDragActive ? 'dragging' : false}
        </div>
        <button type="button" onClick={this.onOpenClick.bind(this)}>
          Browse...
        </button>
      </div>
    );

    const analysing = (
      <div>
        Analysing... {analyser.progress}%
        <button type="button" onClick={this.onCancelClick.bind(this)}>
          Cancel
        </button>
      </div>
    );

    const done = (
      <div>
        <button type="button" onClick={this.onSaveClick.bind(this)}>
          Save...
        </button>
        <button type="button" onClick={this.onCancelClick.bind(this)}>
          Cancel
        </button>
        <pre>
          {analyser.json}
        </pre>
      </div>
    );

    const content = analyser.json ? done : analyser.analysing ? analysing : awaitingDragAndDrop;

    return (
      <Dropzone
        className={styles.container}
        ref={(ref) => { this._dropzone = ref; }}
        onDropAccepted={this.onDropAccepted.bind(this)}
        onDropRejected={this.onDropRejected.bind(this)}
        onDragLeave={this.onDragLeave.bind(this)}
        onDragEnter={this.onDragEnter.bind(this)}
        disableClick={disableClick}
        multiple={multiple}
        accept=".json,.bam,.gz,.fastq"
        >
        { content }
      </Dropzone>
    );
  }

  onDragLeave(e) {
    this.setState({
      isDragActive: false
    });
  }

  onDragEnter(e) {
    // e.preventDefault();
    // e.dataTransfer.dropEffect = 'copy';

    this.setState({
      isDragActive: true
    });
  }

  onDropAccepted(files) {
    this.setState({
      isDragActive: false
    });
    console.log('onDropAccepted', files);

    const {dispatch} = this.props;
    const filePath = files[0].path;
    dispatch(AnalyserActions.analyseFileWithPath(filePath));
  }

  onDropRejected(files) {
    this.setState({
      isDragActive: false
    });
    console.log('onDropRejected', files);
  }

  onCancelClick(e) {
    const {dispatch} = this.props;
    dispatch(AnalyserActions.analyseFileCancel());
  }

  onOpenClick(e) {
    this._dropzone.open();
    console.log('onOpenClick');
  }

  onSaveClick(e) {
    const {dialog} = require('electron').remote;
    dialog.showSaveDialog(null, {
      title: 'Save',
      defaultPath: 'mykrobe.json'
    },
      (filePath) => {
        console.log('filePath', filePath);
        // JSON.stringify(that.state.json, null, 4);
        if (filePath) {
          fs.writeFile(filePath, this.state.json, (err) => {
            if (err) {
              console.log(err);
            }
            else {
              console.log('JSON saved to ', filePath);
            }
          });
        }
      }
    );
    console.log('onSaveClick');
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

DragAndDrop.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(DragAndDrop);
