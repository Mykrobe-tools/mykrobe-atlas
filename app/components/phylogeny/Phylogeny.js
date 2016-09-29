import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Phylogeny.css';
import * as NodeActions from 'actions/NodeActions';

import PhyloCanvasComponent from 'components/ui/PhyloCanvasComponent';
import PhyloCanvasTooltip from 'components/ui/PhyloCanvasTooltip';

const TREE_DATA = require('static/api/zoom_tree.json');
const TEST_DEMO_DATA = require('static/api/test_demo_data.json');

// const SAMPLE_DATA = require('static/api/10091-01.json');
// const MAX_DISTANCE = 5;

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

    this._samples = {};
    let samplesToHighlight = [];
    for (let sampleKey in TEST_DEMO_DATA) {
      const sample = TEST_DEMO_DATA[sampleKey];
      samplesToHighlight.push(sample.id);
      this._samples[sample.id] = sample;
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

  componentWillReceiveProps(nextProps) {
    const {node} = nextProps;
    if ( node.highlighted.length ) {
      console.log('node.highlighted', node.highlighted);
      const nodeId = node.highlighted[0];
      const screenPosition = this._phyloCanvas.getPositionOfNodeWithId(nodeId);
      if ( screenPosition ) {
        const boundingClientRect = this._container.getBoundingClientRect();
        this._phyloCanvasTooltip.setNode(this._samples[nodeId]);
        this._phyloCanvasTooltip.setVisible(true, boundingClientRect.left + screenPosition.x, boundingClientRect.top + screenPosition.y);
      }
    }
    else {
      this._phyloCanvasTooltip.setVisible(false);
    }
  }

  render() {
    const {node, demo} = this.props;
    const {newick} = demo.tree;
    return (
      <div className={styles.container}>
        <div className={styles.contentContainer} ref={(ref) => { this._container = ref; }}>
          <PhyloCanvasComponent
            ref={(ref) => { this._phyloCanvas = ref; }}
            treeType="radial"
            data={newick}
            displayTooltip={false}
            onNodeMouseOver={(node) => {this.onNodeMouseOver(node)}}
            onNodeMouseOut={(node) => {this.onNodeMouseOut(node)}}
          />
          <div className={styles.controlsContainer}>
            <div className={styles.zoomControl} onClick={(e) => { e.preventDefault(); this.zoomSamples(); }}>
              <i className="fa fa-search"></i>
              <div className={styles.zoomControlText}>Fit samples</div>
            </div>
          </div>
          <PhyloCanvasTooltip ref={(ref) => {this._phyloCanvasTooltip = ref;}} />
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
    // this._samplesToHighlight.forEach((sample, index) => {
    //   this._phyloCanvas.highlightNodesWithIds(this._samplesToHighlight);
    // });
    for (let sampleKey in TEST_DEMO_DATA) {
      const sample = TEST_DEMO_DATA[sampleKey];
      this._phyloCanvas.highlightNodeWithId(sample.id, sample.colorForTest);
    }
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch(NodeActions.unsetNodeHighlightedAll());
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser,
    node: state.node,
    demo: state.demo
  };
}

Phylogeny.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
  demo:  PropTypes.object.isRequired
};

export default connect(mapStateToProps)(Phylogeny);
