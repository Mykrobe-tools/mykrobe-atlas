/* @flow */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import fs from 'fs';
import path from 'path';
import * as AnalyserActions from '../actions/AnalyserActions';
import * as UIHelpers from '../helpers/UIHelpers';
import { push } from 'react-router-redux';

import styles from './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    const ipcRenderer = require('electron').ipcRenderer;

    ipcRenderer.on('open-file', (e, filePath) => {
      console.log('App open-file');
      if (filePath) {
        const fileObject = {
          path: filePath,
          name: path.parse(filePath).base,
        };
        dispatch(AnalyserActions.analyseFile(fileObject));
      }
    });

    ipcRenderer.on('menu-file-new', () => {
      dispatch(push('/'));
    });

    ipcRenderer.on('menu-file-open', () => {
      const filePath = UIHelpers.openFileDialog();
      if (filePath) {
        const fileObject = {
          path: filePath,
          name: path.parse(filePath).base,
        };
        dispatch(AnalyserActions.analyseFile(fileObject));
      }
    });

    ipcRenderer.on('menu-file-save-as', () => {
      const filePath = UIHelpers.saveFileDialog('mykrobe.json');
      if (filePath) {
        const { analyser } = this.props;
        const json = JSON.stringify(analyser.json, null, 2);
        fs.writeFile(filePath, json, err => {
          if (err) {
            console.error(err);
          } else {
            console.log('JSON saved to ', filePath);
          }
        });
      }
    });
    console.log('onSaveClick');
  }

  render() {
    const { analyser, children } = this.props;

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
      <div className={styles.container}>
        <div className={styles.contentContainer}>{children}</div>
      </div>
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

export default connect(mapStateToProps)(App);
