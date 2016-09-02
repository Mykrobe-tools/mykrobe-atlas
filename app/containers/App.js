import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from 'components/header/Header';
import styles from './App.css';
import Dropzone from 'react-dropzone';
import * as AnalyserActions from 'actions/AnalyserActions';

class App extends Component {
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
    const {dispatch, analyser, children} = this.props;
    const disableClick = true;
    const multiple = false;

    /*
    Get application menu and disable save as...
    TODO: move this into its own component using redux state to change menu state
    */

    const remote = require('electron').remote;
    const menu = remote.Menu.getApplicationMenu();
    if ('darwin' === process.platform) {
      menu.items[1].submenu.items[4].enabled = false;
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
