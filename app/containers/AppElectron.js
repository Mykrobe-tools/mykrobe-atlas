/* @flow */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import fs from 'fs';
import * as AnalyserActions from '../actions/AnalyserActions';
import * as UIHelpers from '../helpers/UIHelpers';
import * as FileHelpers from '../helpers/FileHelpers';
import { push } from 'react-router-redux';
import App from './App';

class AppElectron extends Component {
  constructor(props) {
    super(props);
    const {dispatch} = props;
    const ipcRenderer = require('electron').ipcRenderer;

    ipcRenderer.on('open-file', (e, filePath) => {
      console.log('App open-file');
      if (filePath) {
        FileHelpers.getFileObject(filePath).then((fileObject) => {
          dispatch(AnalyserActions.analyseFile(fileObject));
        })
        .catch((error) => {
          console.error(error);
        });
      }
    });

    ipcRenderer.on('menu-file-new', (e) => {
      dispatch(push('/'));
    });

    ipcRenderer.on('menu-file-open', (e) => {
      const filePath = UIHelpers.openFileDialog();
      if (filePath) {
        FileHelpers.getFileObject(filePath).then((fileObject) => {
          dispatch(AnalyserActions.analyseFile(fileObject));
        })
        .catch((error) => {
          console.error(error);
        });
      }
    });

    ipcRenderer.on('menu-file-save-as', (e) => {
      const filePath = UIHelpers.saveFileDialog('mykrobe.json');
      if (filePath) {
        const {analyser} = this.props;
        const json = JSON.stringify(analyser.json, null, 2);
        fs.writeFile(filePath, json, (err) => {
          if (err) {
            console.error(err);
          }
          else {
            console.log('JSON saved to ', filePath);
          }
        });
      }
    });
    console.log('onSaveClick');
  }

  render() {
    const {analyser, children} = this.props;

    /*
    Get application menu and disable save as...
    TODO: move this into its own component using redux state to change menu state
    */

    // $FlowFixMe: Ignore Electron require
    const remote = require('electron').remote;
    const menu = remote.Menu.getApplicationMenu();
    if ('darwin' === process.platform) {
      const canSave = (false !== analyser.json);
      menu.items[1].submenu.items[4].enabled = canSave;
    }

    return (
      <App children={children} />
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

AppElectron.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired
};

export default connect(mapStateToProps)(AppElectron);
