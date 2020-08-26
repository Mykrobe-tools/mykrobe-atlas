/* @flow */

import fs from 'fs';

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withRouter } from 'react-router-dom';

import * as UIHelpers from '../../helpers/UIHelpers'; // eslint-disable-line import/namespace

import {
  analyseFileNew,
  analyseFile,
  analyseFileSave,
  getFileNames,
} from '../../modules/desktop';

import styles from './App.module.scss';

import NotificationsContainer from '../notifications/NotificationsContainer';
import NotificationsStyle from '../notifications/NotificationsStyle';
import AppDocumentTitle from '../ui/AppDocumentTitle';
import DragAndDrop from '../ui/dragAndDrop/DragAndDrop';

class App extends React.Component<*> {
  _aboutWindow;

  constructor(props) {
    super(props);
    const { analyseFile, analyseFileNew, analyseFileSave, push } = props;
    const ipcRenderer = require('electron').ipcRenderer;
    const remote = require('electron').remote;

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
      if (this._aboutWindow) {
        this._aboutWindow.show();
      } else {
        const currentWindow = remote.getCurrentWindow();
        console.log(this._aboutWindow);
        console.log(currentWindow.getURL());
        console.log('window.location', window.location);
        const url = `${window.location.href}about`;
        console.log(url);
        this._aboutWindow = new remote.BrowserWindow({
          width: 400,
          height: 320,
          resizable: false,
          frame: true,
          webPreferences: {
            nodeIntegration: true,
          },
        });
        // http://localhost:3000/#/
        this._aboutWindow.loadURL(url);
        this._aboutWindow.on('close', () => {
          delete this._aboutWindow;
        });
      }
    });

    ipcRenderer.on('close', () => {
      if (this._aboutWindow) {
        this._aboutWindow.close();
      }
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

    ipcRenderer.on('menu-capture-page', async () => {
      const filePath = UIHelpers.saveFileDialog('screenshot.png', [
        { name: 'PNG', extensions: ['png'] },
      ]); // eslint-disable-line import/namespace
      if (filePath) {
        await this.onCapturePage(filePath);
      }
    });

    ipcRenderer.on('capture-page', async (e, filePath) => {
      await this.onCapturePage(filePath);
    });
  }

  onCapturePage = async (filePath) => {
    if (!filePath) {
      return;
    }
    const currentWindow = require('electron').remote.getCurrentWindow();
    currentWindow.focus();
    const imageBuffer = await currentWindow.capturePage();
    fs.writeFileSync(filePath, imageBuffer.toPNG());
    console.log('Saved', filePath);
  };

  render() {
    const { children, analyseFile } = this.props;
    return (
      <DragAndDrop onDrop={analyseFile}>
        <AppDocumentTitle />
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
      </DragAndDrop>
    );
  }
}

const withRedux = connect(
  (state) => ({
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
  analyseFileSave: PropTypes.func,
  analyseFileNew: PropTypes.func,
  analyseFile: PropTypes.func,
  push: PropTypes.func,
  children: PropTypes.node,
  fileNames: PropTypes.array,
};

export default withRouter(withRedux(App));
