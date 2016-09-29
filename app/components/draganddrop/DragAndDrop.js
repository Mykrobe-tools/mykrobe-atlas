import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './DragAndDrop.css';
import * as UIHelpers from 'helpers/UIHelpers';
import * as AnalyserActions from 'actions/AnalyserActions';
import AnimatedBackground from './AnimatedBackground';
import CircularProgress from './CircularProgress';

class DragAndDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {analyser} = this.props;
    let content;
    if ( analyser.analysing ) {
      content = (
        <div className={styles.promptContainer}>
          <CircularProgress percentage={analyser.progress} />
          <div className={styles.promptTitle}>
            {analyser.progress}%
          </div>
          <button type="button" className={styles.button} onClick={this.onCancelClick.bind(this)}>
            Cancel
          </button>
        </div>
      );
    }
    else {
      content = (
        <div className={styles.promptContainer}>
          <div className={styles.promptIcon} />
          <div className={styles.promptTitle}>
            Drag file here to analyse
          </div>
          <button type="button" className={styles.button} onClick={this.onOpenClick.bind(this)}>
            Browse...
          </button>
        </div>
      );
    }
    return (
      <div className={styles.container}>
        <AnimatedBackground />
        {content}
      </div>
    );
  }

  onOpenClick(e) {
    console.log('onOpenClick');
    const {dispatch} = this.props;
    const filePath = UIHelpers.openFileDialog();
    if (filePath) {
      dispatch(AnalyserActions.analyseFileWithPath(filePath));
    }
  }

  onCancelClick(e) {
    console.log('onCancelClick');
    const {dispatch} = this.props;
    dispatch(AnalyserActions.analyseFileCancel());
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
