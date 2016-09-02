import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import styles from './DragAndDrop.css';
import fs from 'fs';
import { push } from 'react-router-redux';

import Dropzone from 'react-dropzone';

import * as AnalyserActions from 'actions/AnalyserActions';

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
    return (
      <div className={styles.container}>
        <div className={styles.promptContainer}>
          <div className={styles.promptIcon} />
          <div className={styles.promptTitle}>
            Drag file here to analyse
          </div>
          <button type="button" className={styles.button} onClick={this.onOpenClick.bind(this)}>
            Browse...
          </button>
          <button type="button" onClick={this.onOpenPredictor.bind(this)}>
            Skip to predictor
          </button>
        </div>
      </div>
    );
  }

  onOpenPredictor(e) {
    // debugger
    const {dispatch} = this.props;
    dispatch(push('/results'));
    dispatch(AnalyserActions.analyseFileSuccess(JSON.stringify({test: 'test'})));
  }

  onOpenClick(e) {
    console.log('onOpenClick');
    const {dialog} = require('electron').remote;
    const ipcRenderer = require('electron').ipcRenderer;
    const {dispatch} = this.props;
    dialog.showOpenDialog(ipcRenderer, {
      title: 'Open',
      multiSelections: false,
      filters: [
        {name: 'Images', extensions: ['json', 'bam', 'gz', 'fastq']},
      ]
    },
      (filePath) => {
        if (filePath) {
          dispatch(AnalyserActions.analyseFileWithPath(filePath));
        }
      }
    );
  }

  onSaveClick(e) {
    const {dialog} = require('electron').remote;
    const ipcRenderer = require('electron').ipcRenderer;
    dialog.showSaveDialog(ipcRenderer, {
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
