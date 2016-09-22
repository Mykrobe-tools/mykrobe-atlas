import React, { Component, PropTypes } from 'react';
import styles from './PhyloCanvasTooltip.css';

class PhyloCanvasTooltip extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      node: null,
      x: 0,
      y: 0
    };
  }

  setVisible(visible, x=100, y=100) {
    this.setState({
      visible,
      x,
      y
    })
  }

  setNode(node) {
    this.setState({
      node
    })
  }

  render() {
    const {visible, node, x, y} = this.state;
    if ( !visible ) {
      return null;
    }
    return (
      <div className={styles.tooltip} style={{left:x, top:y}}>
        TOOLTIP {node.id}
      </div>
    )
  }
}

export default PhyloCanvasTooltip;
