import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Phylogeny.css';
import * as NodeActions from 'actions/NodeActions';

import PhyloCanvasComponent from 'components/ui/PhyloCanvasComponent';

const TREE_DATA = require('static/api/tree.json');
const SAMPLE_DATA = require('static/api/10091-01.json');
const MAX_DISTANCE = 5;
const TEST_DEMO_DATA = require('static/api/test_demo_data.json');

class Phylogeny extends Component {

  constructor(props) {
    super(props);

    /*
    let samplesToHighlight = [];
    for (let sampleKey in SAMPLE_DATA) {
      const sample = SAMPLE_DATA[sampleKey];
      const neighbours = sample.neighbours;
      for (let neighbourKey in neighbours) {
        const neighbour = neighbours[neighbourKey];
        const distance = parseInt(neighbour.distance);
        if (distance <= MAX_DISTANCE) {
          const samples = neighbour.samples;
          samplesToHighlight = samplesToHighlight.concat(samples);
        }
      }
    }
    this._samplesToHighlight = samplesToHighlight;
    */

    let samplesToHighlight = [];
    for (let sampleKey in TEST_DEMO_DATA) {
      const sample = TEST_DEMO_DATA[sampleKey];
      samplesToHighlight.push(sample.id);
    }
    this._samplesToHighlight = samplesToHighlight;
  }

  nodeIsInSamplesToHighlight(node) {
    const index = this._samplesToHighlight.indexOf(node.id);
    return -1 !== index;
  }

  onNodeMouseOver(node) {
    console.log('onNodeMouseOver', node);
    const {dispatch} = this.props;
    if ( this.nodeIsInSamplesToHighlight(node)) {
      dispatch(NodeActions.setNodeHighlighted(node.id, true));
    }
  }

  onNodeMouseOut(node) {
    console.log('onNodeMouseOut', node);
    const {dispatch} = this.props;
    if ( this.nodeIsInSamplesToHighlight(node)) {
      dispatch(NodeActions.setNodeHighlighted(node.id, false));
    }
  }

  render() {
    const {node} = this.props;
    const {newick} = TREE_DATA;
    return (
      <div className={styles.container}>
        <div className={styles.contentContainer}>
          <PhyloCanvasComponent
            ref={(ref) => { this._phyloCanvas = ref; }}
            treeType="radial"
            data={newick}
            onNodeMouseOver={(node) => {this.onNodeMouseOver(node)}}
            onNodeMouseOut={(node) => {this.onNodeMouseOut(node)}}
          />
          <div className={styles.controlsContainer}>
            <div className={styles.zoomControl} onClick={(e) => { e.preventDefault(); this.zoomSamples(); }}>
              <i className="fa fa-search"></i>
              <div className={styles.zoomControlText}>Fit samples</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  zoomSamples() {
    this._phyloCanvas.zoomToNodesWithIds(this._samplesToHighlight);
  }

  componentDidMount() {
    console.log('this._phyloCanvas', this._phyloCanvas);
    console.log('this._phyloCanvas._tree', this._phyloCanvas._tree);
    this._phyloCanvas.highlightNodesWithIds(this._samplesToHighlight);
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch(NodeActions.unsetNodeHighlightedAll());
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser,
    node: state.node
  };
}

Phylogeny.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(Phylogeny);
