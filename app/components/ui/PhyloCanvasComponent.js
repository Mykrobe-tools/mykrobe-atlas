import PhyloCanvas from 'phylocanvas';
import React, { Component, PropTypes } from 'react';
import styles from './PhyloCanvasComponent.css';
import * as Colors from 'constants/Colors';
import PhyloCanvasTooltip from './PhyloCanvasTooltip';

// Docs http://phylocanvas.org/docs/api/
// Source http://phylocanvas.org/docs/api/Tree.js.html

class PhyloCanvasComponent extends Component {
  constructor() {
    super();
    this._resize = (e) => this.resize(e);
    this._mouseMove = (e) => this.mouseMove(e);
  }

  componentDidMount() {
    this._tree = PhyloCanvas.createTree(this._phyloCanvasDiv);
    this._tree.setTreeType(this.props.treeType);
    this._tree.padding = 12;
    this._tree.showLabels = false;
    this._tree.branchColour=Colors.COLOR_GREY_MID;
    this._tree.hoverLabel = false;
    this._tree.on('loaded', (e) => {
      console.log('loaded');
    });
    this._tree.load(this.props.data);
    window.addEventListener('resize', this._resize);
    this._tree.canvas.canvas.addEventListener('mousemove', this._mouseMove);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
    this._tree.canvas.canvas.removeEventListener('mousemove', this._mouseMove);
    this._tree = null;
  }

  zoomIn() {
    this._tree.smoothZoom(1);
  }

  zoomOut() {
    this._tree.smoothZoom(-1);
  }

  zoomReset() {
    this._tree.fitInPanel(this._tree.leaves);
    this._tree.draw();
  }

  zoomToNodesWithIds(ids) {
    let candidateNodes = this._tree.findLeaves(ids.join('|'));
    if (!candidateNodes) {
      return false;
    }
    this._tree.fitInPanel(candidateNodes);
    this._tree.draw();
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
      colour: Colors.COLOR_TINT_SECONDARY,
      size: 1,
      leafStyle: {
        fillStyle: Colors.COLOR_TINT_SECONDARY
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
      this._tree.draw();
      // this._tree.fitInPanel(); // TODO - may want to check if we are zoomed before doing this?
    }, 0);
  }

  mouseMove(e) {
    const node = this._tree.getNodeAtMousePosition(e);
    if ( !node ) {
      this._phyloCanvasTooltip.setVisible(false);
      return;
    }
    this._phyloCanvasTooltip.setNode(node);
    this._phyloCanvasTooltip.setVisible(true, e.clientX, e.clientY);
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
            <i className="fa fa-plus"></i>
          </div>
          <div className={styles.zoomOutControl} onClick={(e) => { e.preventDefault(); this.zoomOut(); }}>
            <i className="fa fa-minus"></i>
          </div>
          <div className={styles.zoomResetControl} onClick={(e) => { e.preventDefault(); this.zoomReset(); }}>
            <i className="fa fa-compress"></i>
          </div>
        </div>
        <PhyloCanvasTooltip ref={(ref) => {this._phyloCanvasTooltip = ref;}} />
      </div>
    );
  }
}

PhyloCanvasComponent.propTypes = {
  data: PropTypes.string,
  treeType: PropTypes.string
};

export default PhyloCanvasComponent;
