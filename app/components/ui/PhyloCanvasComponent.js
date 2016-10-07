import PhyloCanvas from 'phylocanvas';
import React, { Component, PropTypes } from 'react';
import styles from './PhyloCanvasComponent.css';
import * as Colors from 'constants/Colors';
import PhyloCanvasTooltip from './PhyloCanvasTooltip';

import {utils} from 'phylocanvas';
const {canvas} = utils;

// Docs http://phylocanvas.org/docs/api/
// Source http://phylocanvas.org/docs/api/Tree.js.html

class PhyloCanvasComponent extends Component {
  constructor() {
    super();
    this._resize = (e) => this.resize(e);
    this._mouseMove = (e) => this.mouseMove(e);
    this._currentNodeHover = null;
  }

  drawDeferred() {
    this._drawDeferredTimeout && clearTimeout(this._drawDeferredTimeout);
    this._drawDeferredTimeout = setTimeout(() => {
      this._tree.draw();
    }, 0);
  }

  componentDidMount() {
    this._tree = PhyloCanvas.createTree(this._phyloCanvasDiv);
    this._tree.setTreeType(this.props.treeType);
    this._tree.padding = 12;
    this._tree.showLabels = false;
    this._tree.branchColour = Colors.COLOR_GREY_MID;
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

  highlightNodesWithIds(ids, color = Colors.COLOR_TINT_SECONDARY) {
    ids.forEach((id, index) => {
      this.highlightNodeWithId(id, color);
    });
    return this;
  }

  getNodeWithId(nodeId) {
    const candidateNodes = this._tree.findLeaves(nodeId);
    if (!candidateNodes || !candidateNodes.length) {
      return null;
    }
    const node = candidateNodes[0];
    return node;
  }

  highlightNodeWithId(nodeId, color = Colors.COLOR_TINT_SECONDARY) {
    const node = this.getNodeWithId(nodeId);
    if (!node) {
      return;
    }
    node.setDisplay({
      leafStyle: {
        fillStyle: color
      },
    });
    this.bringNodeToFront(node);
    this.drawDeferred();
    return node;
  }

  bringNodeToFront(node) {
    if (node.parent) {
      const index = node.parent.children.indexOf(node);
      const maxIndex = node.parent.children.length - 1;
      if (maxIndex !== index) {
        // remove from current position
        node.parent.children.splice(index, 1);
        // insert at end
        node.parent.children.push(node);
      }
      this.bringNodeToFront(node.parent);
    }
  }

  getPositionOfNodeWithId(nodeId) {
    const node = this.getNodeWithId(nodeId);
    if (!node) {
      return null;
    }
    // nodes are drawn such that they do not overlap with the line
    // so we need to adjust to accomodate the additional radius to the centre of the node
    const theta = node.radius;
    const centerX = node.leaf ? (theta * Math.cos(node.angle)) + node.centerx : node.centerx;
    const centerY = node.leaf ? (theta * Math.sin(node.angle)) + node.centery : node.centery;
    const translatedPoint = canvas.undoPointTranslation({x: centerX, y: centerY}, this._tree);
    return translatedPoint;
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
    const {displayTooltip} = this.props;
    const {onNodeMouseOver, onNodeMouseOut} = this.props;
    const node = this._tree.getNodeAtMousePosition(e);
    if (!node) {
      // not hovering
      if (this._currentNodeHover) {
        // was hovering
        if (onNodeMouseOut) {
          onNodeMouseOut(this._currentNodeHover);
        }
      }
      if (displayTooltip) {
        this._phyloCanvasTooltip.setVisible(false);
      }
      this._currentNodeHover = null;
      return;
    }
    if (this._currentNodeHover && node !== this._currentNodeHover) {
      // hovered over a new node from another node
      if (onNodeMouseOut) {
        onNodeMouseOut(this._currentNodeHover);
      }
      if (onNodeMouseOver) {
        onNodeMouseOver(node);
      }
    }
    if (!this._currentNodeHover) {
      // new hover
      if (onNodeMouseOver) {
        onNodeMouseOver(node);
      }
    }
    this._currentNodeHover = node;
    if (displayTooltip) {
      this._phyloCanvasTooltip.setNode(node);
      this._phyloCanvasTooltip.setVisible(true, e.clientX, e.clientY);
    }
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
    const {displayTooltip} = this.props;
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
        {displayTooltip && <PhyloCanvasTooltip ref={(ref) => { this._phyloCanvasTooltip = ref; }} />}
      </div>
    );
  }
}

PhyloCanvasComponent.propTypes = {
  data: PropTypes.string,
  treeType: PropTypes.string,
  onNodeMouseOver: PropTypes.func,
  onNodeMouseOut: PropTypes.func,
  displayTooltip: PropTypes.bool
};

export default PhyloCanvasComponent;
