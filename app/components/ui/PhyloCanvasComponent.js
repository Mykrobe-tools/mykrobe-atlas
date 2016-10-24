import PhyloCanvas, {Tree} from 'phylocanvas';
import React, { Component, PropTypes } from 'react';
import styles from './PhyloCanvasComponent.css';
import * as Colors from 'constants/Colors';
import PhyloCanvasTooltip from './PhyloCanvasTooltip';

import {utils} from 'phylocanvas';
const {events, canvas} = utils;
const { fireEvent } = events;

// Docs http://phylocanvas.org/docs/api/
// Source http://phylocanvas.org/docs/api/Tree.js.html

// extend Tree to fire an event after draw

class DrawEventTree extends Tree {
  draw(forceRedraw) {
    super.draw(forceRedraw);
    fireEvent(this.containerElement, 'draw');
  }
}

class PhyloCanvasComponent extends Component {
  constructor() {
    super();
    this._resize = (e) => this.resize(e);
    this._mouseMove = (e) => this.mouseMove(e);
    this._currentNodeHover = null;
    this._highlightedNodes = [];
  }

  drawDeferred() {
    this._drawDeferredTimeout && clearTimeout(this._drawDeferredTimeout);
    this._drawDeferredTimeout = setTimeout(() => {
      this.draw();
    }, 0);
  }

  componentDidMount() {
    const {onLoad} = this.props;
    this._tree = new DrawEventTree(this._phyloCanvasDiv);
    this._tree.setTreeType(this.props.treeType);
    this._tree.padding = 12;
    this._tree.showLabels = false;
    this._tree.branchColour = Colors.COLOR_GREY_MID;
    this._tree.hoverLabel = false;
    this._tree.on('loaded', (e) => {
      console.log('loaded');
      if (onLoad) {
        onLoad();
      }
    });
    this._tree.on('draw', (e) => {
      this.afterDraw();
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
    this.draw();
  }

  zoomToNodesWithIds(ids) {
    if (!ids.length) {
      return false;
    }
    let candidateNodes = this._tree.findLeaves(ids.join('|'));
    if (!candidateNodes) {
      return false;
    }
    this._tree.fitInPanel(candidateNodes);
    this._tree.smoothZoom(-3);
    this.draw();
  }

  resetHighlightedNodes() {
    for (let nodeId in this._highlightedNodes) {
      const node = this.getNodeWithId(nodeId);
      node.setDisplay({
        leafStyle: {}
      });
    }
    this._highlightedNodes = [];
    this.drawDeferred();
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
    // rgba(1,1,1,0) prevents box outline in Safari
    node.setDisplay({
      leafStyle: {
        strokeStyle: 'rgba(1,1,1,0)',
        fillStyle: color
      },
    });
    this.bringNodeToFront(node);
    this._highlightedNodes[nodeId] = color;
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
      this.draw();
      // this._tree.fitInPanel(); // TODO - may want to check if we are zoomed before doing this?
    }, 0);
  }

  draw() {
    this._tree.draw();
  }

  afterDraw() {
    const context = this._tree.canvas;
    const radius = 4;
    for (let nodeId in this._highlightedNodes) {
      const color = this._highlightedNodes[nodeId];
      const position = this.getPositionOfNodeWithId(nodeId);
      context.fillStyle = color;
      context.beginPath();
      context.arc(position.x, position.y, radius, 0, 2 * Math.PI, false);
      context.fill();
    }
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
    const {displayTooltip, controlsInset} = this.props;
    const insetStyle = {margin: `${controlsInset}px`};
    return (
      <div className={styles.container}>
        <div id="phyloCanvasDiv" ref={(ref) => { this._phyloCanvasDiv = ref; }} className={styles.container} />
        <div className={styles.controlsContainer} style={insetStyle}>
          <div className={styles.zoomInControl} onClick={(e) => { e.preventDefault(); this.zoomIn(); }}>
            <i className="fa fa-plus" />
          </div>
          <div className={styles.zoomOutControl} onClick={(e) => { e.preventDefault(); this.zoomOut(); }}>
            <i className="fa fa-minus" />
          </div>
          <div className={styles.zoomResetControl} onClick={(e) => { e.preventDefault(); this.zoomReset(); }}>
            <i className="fa fa-compress" />
          </div>
        </div>
        {displayTooltip && <PhyloCanvasTooltip ref={(ref) => { this._phyloCanvasTooltip = ref; }} />}
      </div>
    );
  }
}

PhyloCanvasComponent.defaultProps = {
  controlsInset: 0
};

PhyloCanvasComponent.propTypes = {
  data: PropTypes.string,
  treeType: PropTypes.string,
  onNodeMouseOver: PropTypes.func,
  onNodeMouseOut: PropTypes.func,
  onLoad: PropTypes.func,
  displayTooltip: PropTypes.bool,
  controlsInset: PropTypes.number
};

export default PhyloCanvasComponent;
