import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Phylogeny.css';

import PhyloCanvasComponent from 'components/ui/PhyloCanvasComponent';

const TREE_DATA = require('static/api/tree.json');
const SAMPLE_DATA = require('static/api/10091-01.json');
const MAX_DISTANCE = 5;

class Phylogeny extends Component {

  constructor(props) {
    super(props);
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
  }

  render() {
    // const {analyser} = this.props;
    // const everything = JSON.stringify(analyser.transformed, null, 2);
    const {newick} = TREE_DATA;
    return (
      <div className={styles.container}>
        <div className={styles.title}>Phylogeny</div>
        <PhyloCanvasComponent ref={(ref) => { this._phyloCanvas = ref; }} treeType="circular" data={newick} />
        <div className={styles.controlsContainer}>
          <div className={styles.zoomControl} onClick={(e) => { e.preventDefault(); this.zoomSamples(); }}>
            <i className="fa fa-search"></i>
            <div className={styles.zoomControlText}>Fit samples</div>
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
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

Phylogeny.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(Phylogeny);
