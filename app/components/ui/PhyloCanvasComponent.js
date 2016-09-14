import PhyloCanvas from 'phylocanvas';
import React, { Component, PropTypes } from 'react';
import styles from './PhyloCanvasComponent.css';

// http://phylocanvas.org/docs/api/

class PhyloCanvasComponent extends Component {

  componentDidMount() {
    this._tree = PhyloCanvas.createTree(this._phyloCanvasDiv);
    this._tree.setTreeType(this.props.treeType);
    this._tree.on('loaded', (e) => {
      console.log('loaded');
    });
    this._tree.load(this.props.data);
    window.addEventListener('resize', (e) => { this.resize(); });
  }

  zoomIn() {
    this._tree.smoothZoom(1);
  }

  zoomOut() {
    this._tree.smoothZoom(-1);
  }

  highlightNodesWithIds(ids) {
    ids.forEach((id, index) => {
      this.highlightNodeWithId(id);
    });
    return this;
  }

  highlightNodeWithId(id) {
    let candidateNodes = this._tree.findLeaves(id);
    if (!candidateNodes) {
      return false;
    }
    let node = candidateNodes[0];
    node.setDisplay({
      colour: 'blue',
      shape: 'star',
      radius: 100000,
      leafStyle: {
        lineWidth: 20,
        strokeStyle: '#ff0000',
        fillStyle: 'lightblue',
      },
    });
    return node;
  }

  resize() {
    console.log('resize');
    // set size to zero so the parent container can flex to natural size
    this._tree.setSize(0, 0);
    // allow re-render using setTimeout
    setTimeout(() => {
      console.log('redraw');
      this._tree.resizeToContainer();
      this._tree.fitInPanel(); // TODO - may want to check if we are zoomed before doing this?
    }, 0);
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
      <div className={styles.container}>
        <div id="phyloCanvasDiv" ref={(ref) => { this._phyloCanvasDiv = ref; }} className={styles.container} />
        <div className={styles.controlsContainer}>
          <div className={styles.zoomInControl} onClick={(e) => { e.preventDefault(); this.zoomIn(); }}>
            Zoom in
          </div>
          <div className={styles.zoomOutControl} onClick={(e) => { e.preventDefault(); this.zoomOut(); }}>
            Zoom out
          </div>
        </div>
      </div>
    );
  }
}

PhyloCanvasComponent.propTypes = {
  data: PropTypes.string,
  treeType: PropTypes.string
};

export default PhyloCanvasComponent;
