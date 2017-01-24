/* @flow */

import React, { Component, PropTypes } from 'react';
import styles from './Key.css';
import { connect } from 'react-redux';
import type { Sample } from '../../types/Sample';

class Key extends Component {

  getSampleWithId(nodeId: string): ?Sample {
    const {analyser} = this.props;
    const {samples} = analyser.transformed;
    for (let sampleKey in samples) {
      const sample: Sample = samples[sampleKey];
      if (sample._id === nodeId) {
        return sample;
      }
    }
  }

  getSampleIds(): Array<string> {
    const {analyser} = this.props;
    if (!analyser.transformed) return [];
    const {samples} = analyser.transformed;
    let nodeIds: Array<string> = [];
    for (let sampleKey: string in samples) {
      const sample: Sample = samples[sampleKey];
      nodeIds.push(sample._id);
    }
    return nodeIds;
  }

  render() {
    const {single} = this.props;
    const sampleIds = this.getSampleIds();
    let title = '';
    // let action = null;
    if (!sampleIds.length) {
      return (
        <div className={styles.container}>
          <div className={styles.headerTitle}>
            Loading
          </div>
        </div>
      );
    }
    const sample0 = this.getSampleWithId(sampleIds[0]);
    if (!sample0) {
      return null;
    }
    if (!single && sampleIds.length > 1) {
      const sample1 = this.getSampleWithId(sampleIds[1]);
      if (sample1) {
        title = <div><i className="fa fa-circle" style={{color: '#f90'}} /> {sample0._id} Your sample &middot; <i className="fa fa-circle" style={{color: '#f90'}} /> {sample1._id} Nearest previous sample</div>;
        // action = <div className={styles.resetButton} onClick={(e) => { this.onRemoveClicked(e) }}><i className="fa fa-times-circle" /> Reset</div>;
      }
    }
    else {
      title = <div><i className="fa fa-circle" style={{color: '#f90'}} /> {sample0._id} Your sample</div>;
      // action = <div className={styles.compareButton} onClick={(e) => { this.onAddClicked(e) }}><i className="fa fa-plus-circle" /> Compare</div>;
    }
    return (
      <div className={styles.container}>
        <div className={styles.title}>
          {title}
        </div>
      </div>
    );
  }

  static defaultProps = {
    single: false
  }
}

Key.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  experiments: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
  single: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    analyser: state.analyser,
    experiments: state.experiments,
    node: state.node
  };
}

export default connect(mapStateToProps)(Key);
