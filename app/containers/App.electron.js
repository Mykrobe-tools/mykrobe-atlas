/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as AnalyserActions from '../actions/AnalyserActions';
import * as UIHelpers from '../helpers/UIHelpers'; // eslint-disable-line import/namespace
import { push } from 'react-router-redux';
import Dropzone from 'react-dropzone';
import { withRouter } from 'react-router-dom';

import styles from './App.css';

class App extends React.Component {
  state: {
    isDragActive: boolean,
  };

  state = {
    isDragActive: false,
  };

  constructor(props) {
    super(props);
    const { dispatch } = props;
    const ipcRenderer = require('electron').ipcRenderer;

    ipcRenderer.on('open-file', (e, filePath) => {
      console.log('App open-file');
      if (filePath) {
        dispatch(AnalyserActions.analyseFile(filePath));
      }
    });

    ipcRenderer.on('menu-file-new', () => {
      const { dispatch } = props;
      dispatch(AnalyserActions.analyseFileNew());
    });

    ipcRenderer.on('menu-about', () => {
      const { dispatch } = props;
      dispatch(push('/about'));
    });

    ipcRenderer.on('menu-file-open', () => {
      const filePath = UIHelpers.openFileDialog(); // eslint-disable-line import/namespace
      if (filePath) {
        dispatch(AnalyserActions.analyseFile(filePath));
      }
    });

    ipcRenderer.on('menu-file-save-as', () => {
      dispatch(AnalyserActions.analyseFileSave());
    });
  }

  onDragEnter = e => {
    const dt = e.dataTransfer;
    if (
      !(
        dt.types &&
        (dt.types.indexOf
          ? dt.types.indexOf('Files') !== -1
          : dt.types.contains('Files'))
      )
    ) {
      this.setState({ isDragActive: false });
    } else {
      this.setState({
        isDragActive: true,
      });
    }
  };

  onDragLeave = () => {
    this.setState({
      isDragActive: false,
    });
  };

  onDropAccepted = files => {
    const { dispatch } = this.props;
    console.log('onDropAccepted', files);
    this.setState({
      isDragActive: false,
    });
    if (!files.length) {
      return;
    }
    const filePath = files[0];
    dispatch(AnalyserActions.analyseFile(filePath));
  };

  onDropRejected = files => {
    console.log('onDropRejected', files);
    this.setState({
      isDragActive: false,
    });
  };

  render() {
    const { analyser, children } = this.props;
    const { isDragActive } = this.state;

    /*
    Get application menu and disable save as...
    TODO: move this into its own component using redux state to change menu state
    */

    // $FlowFixMe: Ignore Electron require
    const remote = require('electron').remote;
    const menu = remote.Menu.getApplicationMenu();
    if (process.platform === 'darwin') {
      const canSave = analyser.json !== false;
      menu.items[1].submenu.items[4].enabled = canSave;
    }

    return (
      <Dropzone
        className={isDragActive ? styles.containerDragActive : styles.container}
        onDropAccepted={this.onDropAccepted}
        onDropRejected={this.onDropRejected}
        onDragLeave={this.onDragLeave}
        onDragEnter={this.onDragEnter}
        disableClick
        multiple={false}
        accept=".json,.bam,.gz,.fastq"
      >
        <div className={styles.contentContainer}>{children}</div>
      </Dropzone>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser,
  };
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
};

export default withRouter(connect(mapStateToProps)(App));
