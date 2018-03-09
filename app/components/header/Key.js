/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './Key.css';
import { connect } from 'react-redux';
import type { SampleType } from '../../types/SampleType';

class Key extends React.Component<*> {
  getSampleWithId(nodeId: string): ?SampleType {
    const { analyser } = this.props;
    const { samples } = analyser.transformed;
    for (let sampleKey in samples) {
      const sample: SampleType = samples[sampleKey];
      if (sample.id === nodeId) {
        return sample;
      }
    }
  }

  getSampleIds(): Array<string> {
    const { analyser } = this.props;
    if (!analyser.transformed) return [];
    const { samples } = analyser.transformed;
    let nodeIds: Array<string> = [];
    for (let sampleKey: string in samples) {
      const sample: SampleType = samples[sampleKey];
      nodeIds.push(sample.id);
    }
    return nodeIds;
  }

  render() {
    const { single } = this.props;
    const sampleIds = this.getSampleIds();
    let title = '';
    // let action = null;
    if (!sampleIds.length) {
      return (
        <div className={styles.container}>
          <div className={styles.headerTitle}>Loading</div>
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
        title = (
          <div>
            <i className="fa fa-circle" style={{ color: '#f90' }} />{' '}
            {sample0.id} Your sample &middot;{' '}
            <i className="fa fa-circle" style={{ color: '#f90' }} />{' '}
            {sample1.id} Nearest previous sample
          </div>
        );
        // action = <div className={styles.resetButton} onClick={(e) => { this.onRemoveClicked(e) }}><i className="fa fa-times-circle" /> Reset</div>;
      }
    } else {
      title = (
        <div>
          <i className="fa fa-circle" style={{ color: '#f90' }} /> {sample0.id}{' '}
          Your sample
        </div>
      );
      // action = <div className={styles.compareButton} onClick={(e) => { this.onAddClicked(e) }}><i className="fa fa-plus-circle" /> Compare</div>;
    }
    return (
      <div className={styles.container}>
        <div className={styles.title}>{title}</div>
      </div>
    );
  }

  static defaultProps = {
    single: false,
  };
}

Key.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  experiments: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
  single: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    analyser: state.analyser,
    experiments: state.experiments,
    node: state.node,
  };
}

export default connect(mapStateToProps)(Key);
