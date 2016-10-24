/* @flow */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './AnalysingProgressBar.css';

class AnalysingProgressBar extends Component {
  render() {
    const {analyser} = this.props;
    const progressBarContainerStyle = {
      width: `${analyser.progress}%`
    };
    var text = `Analysing ${analyser.progress}%`;
    if (0 === analyser.progress) {
      text = 'Constructing genome';
    }
    else if (100 === analyser.progress) {
      text = 'Check species and scan for resistance';
    }
    return (
      <div className={styles.container}>
        <div className={styles.progressBarContainer} style={progressBarContainerStyle}>
          <div className={analyser.progress > 20 ? styles.progressBarLabelInside : styles.progressBarLabelOutside}>
            {text}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

AnalysingProgressBar.propTypes = {
  analyser: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(AnalysingProgressBar);
