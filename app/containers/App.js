/* @flow */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './App.css';
import Dropzone from 'react-dropzone';
import * as AnalyserActions from 'actions/AnalyserActions';
import Header from 'components/header/Header';

class App extends Component {
  state: {
    isDragActive: boolean
  };
  _dropzone: Dropzone;

  constructor(props) {
    super(props);
    this.state = {
      isDragActive: false
    };
  }

  onDragLeave(e) {
    this.setState({
      isDragActive: false
    });
  }

  onDragEnter(e: SyntheticDragEvent) {
    if (e.dataTransfer.items) {
      if (!e.dataTransfer.items.length) {
        return;
      }
    }
    else {
      if (!e.dataTransfer.files.length) {
        return;
      }
    }
    this.setState({
      isDragActive: true
    });
  }

  onDropAccepted(files) {
    console.log('onDropAccepted', files);
    this.setState({
      isDragActive: false
    });
    if (!files.length) {
      return;
    }
    const {dispatch} = this.props;
    const file = files[0];
    dispatch(AnalyserActions.analyseFile(file));
  }

  onDropRejected(files) {
    console.log('onDropRejected', files);
    this.setState({
      isDragActive: false
    });
  }

  render() {
    const {isDragActive} = this.state;
    const {children} = this.props;
    const disableClick = true;
    const multiple = false;

    return (
      <div className={styles.container}>
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
          <div className={styles.headerContainer}>
            <Header />
          </div>
          <div className={styles.contentContainer}>
            {children}
          </div>
        </Dropzone>
        <div className={isDragActive ? styles.dragIndicatorContainerDragActive : styles.dragIndicatorContainer} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired
};

export default connect(mapStateToProps)(App);
