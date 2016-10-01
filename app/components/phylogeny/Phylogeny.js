import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Phylogeny.css';
import * as NodeActions from 'actions/NodeActions';

import PhyloCanvasComponent from 'components/ui/PhyloCanvasComponent';
import PhyloCanvasTooltip from 'components/ui/PhyloCanvasTooltip';

const treeTypes = ['radial', 'rectangular', 'circular', 'diagonal', 'hierarchy'];

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

    // radial, rectangular, circular, diagonal and hierarchy
    this.state = {
      treeType: 'radial'
    }
  }

  nodeIsInSamplesToHighlight(node) {
    const index = this.getSampleIds().indexOf(node.id);
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
    if ( this.props.demo.samples !== nextProps.demo.samples ) {
      setTimeout(() => {
        this.updateHighlightedSamples(nextProps.demo.samples);
      },0);
    }
    if ( node.highlighted.length ) {
      console.log('node.highlighted', node.highlighted);
      const nodeId = node.highlighted[0];
      const screenPosition = this._phyloCanvas.getPositionOfNodeWithId(nodeId);
      if ( screenPosition ) {
        const boundingClientRect = this._container.getBoundingClientRect();
        this._phyloCanvasTooltip.setNode(this.getSampleWithId(nodeId));
        this._phyloCanvasTooltip.setVisible(true, boundingClientRect.left + screenPosition.x, boundingClientRect.top + screenPosition.y);
      }
    }
    else {
      this._phyloCanvasTooltip.setVisible(false);
    }
  }

  render() {
    const {node, demo} = this.props;
    const {treeType} = this.state;
    const {newick} = demo.tree;
    return (
      <div className={styles.container}>
        <div className={styles.contentContainer} ref={(ref) => { this._container = ref; }}>
          <PhyloCanvasComponent
            ref={(ref) => { this._phyloCanvas = ref; }}
            treeType={treeType}
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
          <div className={styles.demoTreeTypeContainer}>
            {treeTypes.map((thisTreeType, index) =>
              <div className={thisTreeType===treeType ? styles.demoTreeTypeSelected : styles.demoTreeType} key={index} onClick={(e) => {
                this.setState({treeType: thisTreeType});
                setTimeout(() => {
                  this.updateHighlightedSamples(demo.samples);
                },0);
              }}>{thisTreeType}</div>
            )}
          </div>
          <PhyloCanvasTooltip ref={(ref) => {this._phyloCanvasTooltip = ref;}} />
        </div>
      </div>
    );
  }

  getSampleWithId(nodeId) {
    const {demo} = this.props;
    const {samples} = demo;
    for (let sampleKey in samples) {
      const sample = samples[sampleKey];
      if ( sample.id === nodeId ) {
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

  zoomSamples() {
    this._phyloCanvas.zoomToNodesWithIds(this.getSampleIds());
  }

  componentDidMount() {
    const {demo} = this.props;
    const {samples} = demo;
    this.updateHighlightedSamples(samples);
  }

  updateHighlightedSamples(samples) {
    for (let sampleKey in samples) {
      const sample = samples[sampleKey];
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
