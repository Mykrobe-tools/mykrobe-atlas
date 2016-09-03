import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from 'components/header/Header';
import styles from './App.css';
import fs from 'fs';
import Dropzone from 'react-dropzone';
import * as AnalyserActions from 'actions/AnalyserActions';
import * as UIHelpers from 'helpers/UIHelpers';
import { push } from 'react-router-redux';

class App extends Component {
  constructor(props) {
    super(props);
    const {dispatch} = props;
    const ipcRenderer = require('electron').ipcRenderer;
    this.state = {
      isDragActive: false
    };

    ipcRenderer.on('open-file', (e, filePath) => {
      console.log('App open-file');
      if (filePath) {
        dispatch(AnalyserActions.analyseFileWithPath(filePath));
      }
    });

    ipcRenderer.on('menu-file-new', (e) => {
      dispatch(push('/'));
    });

    ipcRenderer.on('menu-file-open', (e) => {
      const filePath = UIHelpers.openFileDialog();
      if (filePath) {
        dispatch(AnalyserActions.analyseFileWithPath(filePath));
      }
    });

    ipcRenderer.on('menu-file-save-as', (e) => {
      const filePath = UIHelpers.saveFileDialog('mykrobe.json');
      if (filePath) {
        const {analyser} = this.props;
        fs.writeFile(filePath, analyser.json, (err) => {
          if (err) {
            console.log(err);
          }
          else {
            console.log('JSON saved to ', filePath);
          }
        });
      }
    });
    console.log('onSaveClick');
  }

  onDragLeave(e) {
    this.setState({
      isDragActive: false
    });
  }

  onDragEnter(e) {
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

  render() {
    const { isDragActive } = this.state;
    const {analyser, children} = this.props;
    const disableClick = true;
    const multiple = false;

    /*
    Get application menu and disable save as...
    TODO: move this into its own component using redux state to change menu state
    */

    const remote = require('electron').remote;
    const menu = remote.Menu.getApplicationMenu();
    if ('darwin' === process.platform) {
      const canSave = (false !== analyser.json);
      menu.items[1].submenu.items[4].enabled = canSave;
    }

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
          <Header />
          {children}
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
