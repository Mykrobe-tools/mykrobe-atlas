/* @flow */

import fs from 'fs';

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import Dropzone from 'react-dropzone';
import { withRouter } from 'react-router-dom';

import * as UIHelpers from '../helpers/UIHelpers'; // eslint-disable-line import/namespace
import * as APIConstants from '../constants/APIConstants';

import {
  analyseFileNew,
  analyseFile,
  analyseFileSave,
} from '../modules/desktop';

import styles from './App.scss';

import NotificationsContainer from '../components/notifications/NotificationsContainer';
import NotificationsStyle from '../components/notifications/NotificationsStyle';

type State = {
  isDragActive: boolean,
};

class App extends React.Component<*, State> {
  state = {
    isDragActive: false,
  };

  constructor(props) {
    super(props);
    const { analyseFile, analyseFileNew, analyseFileSave, push } = props;
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

    ipcRenderer.on('menu-capture-page', () => {
      const filePath = UIHelpers.saveFileDialog('screenshot.png'); // eslint-disable-line import/namespace
      if (filePath) {
        this.onCapturePage(filePath);
      }
    });

    ipcRenderer.on('capture-page', (e, filePath) => {
      console.log('App capture-page');
      this.onCapturePage(filePath);
    });
  }

  onCapturePage = filePath => {
    const currentWindow = require('electron').remote.getCurrentWindow();
    if (filePath) {
      currentWindow.capturePage(image => {
        fs.writeFileSync(filePath, image.toPNG());
        console.log('Saved', filePath);
      });
    }
  };

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
    const { analyseFile } = this.props;
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
    const { children } = this.props;
    const { isDragActive } = this.state;

    return (
      <Dropzone
        className={isDragActive ? styles.containerDragActive : styles.container}
        onDropAccepted={this.onDropAccepted}
        onDropRejected={this.onDropRejected}
        onDragLeave={this.onDragLeave}
        onDragEnter={this.onDragEnter}
        disableClick
        multiple={false}
        accept={APIConstants.API_SAMPLE_EXTENSIONS_STRING_WITH_DOTS}
      >
        <div className={styles.contentContainer}>{children}</div>
        <div className={styles.notificationsContainerElectron}>
          <NotificationsContainer
            limit={5}
            order="desc"
            notificationsStyle={NotificationsStyle.SEPARATE}
            dismissed={false}
            hidden={false}
          />
        </div>
      </Dropzone>
    );
  }
}

function mapStateToProps() {
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
  children: PropTypes.node.isRequired,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
