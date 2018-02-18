/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import Dropzone from 'react-dropzone';
import { withRouter } from 'react-router-dom';

import * as UIHelpers from '../helpers/UIHelpers'; // eslint-disable-line import/namespace

import {
  analyseFileNew,
  analyseFile,
  analyseFileSave,
} from '../modules/analyser';

import withAnalyser from '../hoc/withAnalyser';

import styles from './App.css';

import NotificationsContainer from '../components/notifications/NotificationsContainer';

class App extends React.Component {
  state: {
    isDragActive: boolean,
  };

  state = {
    isDragActive: false,
  };

  constructor(props) {
    super(props);
    const { analyseFile, analyseFileNew } = props;
    const ipcRenderer = require('electron').ipcRenderer;

    ipcRenderer.on('open-file', (e, filePath) => {
      console.log('App open-file');
      if (filePath) {
        analyseFile(filePath);
      }
    });

    ipcRenderer.on('menu-file-new', () => {
      analyseFileNew();
    });

    ipcRenderer.on('menu-about', () => {
      push('/about');
    });

    ipcRenderer.on('menu-file-open', () => {
      const filePath = UIHelpers.openFileDialog(); // eslint-disable-line import/namespace
      if (filePath) {
        analyseFile(filePath);
      }
    });

    ipcRenderer.on('menu-file-save-as', () => {
      analyseFileSave();
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
    console.log('onDropAccepted', files);
    this.setState({
      isDragActive: false,
    });
    if (!files.length) {
      return;
    }
    const filePath = files[0];
    analyseFile(filePath);
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
        <div className={styles.notificationsContainer}>
          <NotificationsContainer />
        </div>
      </Dropzone>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      analyseFileSave,
      analyseFileNew,
      analyseFile,
      push,
    },
    dispatch
  );
}

App.propTypes = {
  analyseFileSave: PropTypes.func.isRequired,
  analyseFileNew: PropTypes.func.isRequired,
  analyseFile: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withAnalyser(App))
);
