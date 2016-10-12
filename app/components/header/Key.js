import React, { Component, PropTypes } from 'react';
import styles from './Key.css';
import { connect } from 'react-redux';
import * as NodeActions from 'actions/NodeActions';

const DemoActions = IS_ELECTRON ? require('actions/DemoActionsElectron') : require('actions/DemoActions');

class Key extends Component {

  onAddClicked(e) {
    console.log('onAddClicked');
    const {dispatch} = this.props;
    dispatch(NodeActions.unsetNodeHighlightedAll());
    dispatch(DemoActions.loadTreeWithPath('zoom_tree.json'));
    dispatch(DemoActions.loadSamplesWithPath('zoom_tree_samples.json'));
  }

  onRemoveClicked(e) {
    console.log('onRemoveClicked');
    const {dispatch} = this.props;
    dispatch(NodeActions.unsetNodeHighlightedAll());
    dispatch(DemoActions.loadTreeWithPath('tree.json'));
    dispatch(DemoActions.loadSamplesWithPath('tree_samples.json'));
  }

  getSampleWithId(nodeId) {
    const {demo} = this.props;
    const {samples} = demo;
    for (let sampleKey in samples) {
      const sample = samples[sampleKey];
      if (sample.id === nodeId) {
        return sample;
      }
    }
  }

  getSampleIds() {
    const {demo} = this.props;
    const {samples} = demo;
    let nodeIds = [];
    for (let sampleKey in samples) {
      const sample = samples[sampleKey];
      nodeIds.push(sample.id);
    }
    return nodeIds;
  }

  render() {
    const sampleIds = this.getSampleIds();
    let title = '';
    let action = null;
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
    if (sampleIds.length > 1) { // fa-circle
      const sample1 = this.getSampleWithId(sampleIds[1]);
      title = <div><i className="fa fa-circle" style={{color: sample0.colorForTest}} /> {sample0.id} Your sample &middot; <i className="fa fa-circle" style={{color: sample1.colorForTest}} /> {sample1.id} Nearest previous sample</div>;
      action = <div className={styles.resetButton} onClick={(e) => { this.onRemoveClicked(e); }}><i className="fa fa-times-circle" /> Reset</div>;
    }
    else {
      title = <div><i className="fa fa-circle" style={{color: sample0.colorForTest}} /> {sample0.id} Your sample</div>;
      action = <div className={styles.compareButton} onClick={(e) => { this.onAddClicked(e); }}><i className="fa fa-plus-circle" /> Compare</div>;
    }
    return (
      <div className={styles.container}>
        <div className={styles.headerTitle}>
          {title}&nbsp;&middot;&nbsp;{action}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser,
    node: state.node,
    demo: state.demo
  };
}

Key.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
  demo: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(Key);
