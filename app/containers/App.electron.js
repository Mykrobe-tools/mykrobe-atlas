/* @flow */

import fs from 'fs';

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Dropzone from 'react-dropzone';
import { withRouter } from 'react-router-dom';
import DocumentTitle from 'react-document-title';

import * as UIHelpers from '../helpers/UIHelpers'; // eslint-disable-line import/namespace
import * as APIConstants from '../constants/APIConstants';

import {
  analyseFileNew,
  analyseFile,
  analyseFileSave,
  getFileNames,
} from '../modules/desktop';

import styles from './App.scss';

import NotificationsContainer from '../components/notifications/NotificationsContainer';
import NotificationsStyle from '../components/notifications/NotificationsStyle';

type State = {
  isDragActive: boolean,
};

const defaultTitle = require('../../package.json').productName;

class App extends React.Component<*, State> {
  state = {
    isDragActive: false,
  };

  constructor(props) {
    super(props);
    const { analyseFile, analyseFileNew, analyseFileSave, push } = props;
    const ipcRenderer = require('electron').ipcRenderer;

    ipcRenderer.on('open-file', (e, filePaths) => {
      console.log('App open-file');
      if (filePaths) {
        analyseFile(filePaths);
      }
    });

    ipcRenderer.on('menu-file-new', () => {
      analyseFileNew();
    });

    ipcRenderer.on('menu-about', () => {
      push('/about');
    });

    ipcRenderer.on('menu-file-open', () => {
      const filePaths = UIHelpers.openFileDialog(); // eslint-disable-line import/namespace
      if (filePaths) {
        analyseFile(filePaths);
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
    const { analyseFile } = this.props;
    console.log('onDropAccepted', files);
    this.setState({
      isDragActive: false,
    });
    if (!files.length) {
      return;
    }
    analyseFile(files);
  };

  onDropRejected = files => {
    console.log('onDropRejected', files);
    this.setState({
      isDragActive: false,
    });
  };

  render() {
    const { children, fileNames } = this.props;
    const { isDragActive } = this.state;
    const title =
      fileNames && fileNames.length
        ? `${fileNames.join(', ')} – ${defaultTitle}`
        : defaultTitle;
    return (
      <Dropzone
        className={styles.container}
        onDropAccepted={this.onDropAccepted}
        onDropRejected={this.onDropRejected}
        onDragLeave={this.onDragLeave}
        onDragEnter={this.onDragEnter}
        disableClick
        multiple
        accept={APIConstants.API_SAMPLE_EXTENSIONS_STRING_WITH_DOTS}
      >
        <DocumentTitle title={title} />
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
        {isDragActive && <div className={styles.dragIndicator} />}
      </Dropzone>
    );
  }
}

const withRedux = connect(
  state => ({
    fileNames: getFileNames(state),
  }),
  {
    analyseFileSave,
    analyseFileNew,
    analyseFile,
    push,
  }
);

App.propTypes = {
  analyseFileSave: PropTypes.func.isRequired,
  analyseFileNew: PropTypes.func.isRequired,
  analyseFile: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  fileNames: PropTypes.array,
};

export default withRouter(withRedux(App));
