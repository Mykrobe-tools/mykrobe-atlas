import PhyloCanvas from 'phylocanvas';
import React, { Component, PropTypes } from 'react';
import styles from './PhyloCanvasComponent.css';

class PhyloCanvasComponent extends Component {

  componentDidMount() {
    this._tree = PhyloCanvas.createTree(this._phyloCanvasDiv);
    this._tree.setTreeType(this.props.treeType);
    this._tree.load(this.props.data);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this._tree.load(this.props.data);
    }
    if (prevProps.treeType !== this.props.treeType) {
      this._tree.setTreeType(this.props.treeType);
    }
  }

  render() {
    return (
      <div id="phyloCanvasDiv" ref={(ref) => { this._phyloCanvasDiv = ref; }} className={styles.container} />
    );
  }
}

PhyloCanvasComponent.propTypes = {
  data: PropTypes.string,
  treeType: PropTypes.string
};

export default PhyloCanvasComponent;
