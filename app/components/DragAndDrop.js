import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './DragAndDrop.css';
import { push } from 'react-router-redux';
import * as UIHelpers from 'helpers/UIHelpers';
import * as AnalyserActions from 'actions/AnalyserActions';

class DragAndDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: false,
      isAnalysing: false,
      isDone: false,
      progress: 0,
      isDragActive: false,
      json: false
    };
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.promptContainer}>
          <div className={styles.promptIcon} />
          <div className={styles.promptTitle}>
            Drag file here to analyse
          </div>
          <button type="button" className={styles.button} onClick={this.onOpenClick.bind(this)}>
            Browse...
          </button>
          <button type="button" onClick={this.onOpenPredictor.bind(this)}>
            Skip to predictor
          </button>
        </div>
      </div>
    );
  }

  onOpenPredictor(e) {
    // debugger
    const {dispatch} = this.props;
    dispatch(push('/results'));
    dispatch(AnalyserActions.analyseFileSuccess(JSON.stringify({test: 'test'})));
  }

  onOpenClick(e) {
    console.log('onOpenClick');
    const {dispatch} = this.props;
    const filePath = UIHelpers.openFileDialog();
    if (filePath) {
      dispatch(AnalyserActions.analyseFileWithPath(filePath));
    }
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

DragAndDrop.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(DragAndDrop);
