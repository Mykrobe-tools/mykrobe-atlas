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

import styles from './App.scss';

import NotificationsContainer from '../notifications/NotificationsContainer';
import NotificationsStyle from '../notifications/NotificationsStyle';
import AppDocumentTitle from '../ui/AppDocumentTitle';
import DragAndDrop from '../ui/dragAndDrop/DragAndDrop';

class App extends React.Component<*> {
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

  onCapturePage = async filePath => {
    const currentWindow = require('electron').remote.getCurrentWindow();
    if (filePath) {
      const image = await currentWindow.capturePage();
      fs.writeFileSync(filePath, image.toPNG());
      console.log('Saved', filePath);
    }
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
  analyseFileSave: PropTypes.func,
  analyseFileNew: PropTypes.func,
  analyseFile: PropTypes.func,
  push: PropTypes.func,
  children: PropTypes.node,
  fileNames: PropTypes.array,
};

export default withRouter(withRedux(App));
