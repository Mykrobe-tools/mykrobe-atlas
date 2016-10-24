/* @flow */

import React, { Component } from 'react';
import styles from './PhyloCanvasTooltip.css';
import type { Sample } from 'types/Sample';

class PhyloCanvasTooltip extends Component {
  state: {
    visible: boolean,
    node: ?Sample,
    x: number,
    y: number
  }

  constructor() {
    super();
    this.state = {
      visible: false,
      node: null,
      x: 0,
      y: 0
    };
  }

  setVisible(visible: boolean, x: number = 100, y: number = 100) {
    this.setState({
      visible,
      x,
      y
    });
  }

  setNode(node: Sample) {
    this.setState({
      node
    });
  }

  render() {
    const {visible, node, x, y} = this.state;
    if (!visible || !node) {
      return null;
    }
    return (
      <div className={styles.tooltip} style={{left: x, top: y}}>
        <div className={styles.tooltipWrapper}>
          <div className={styles.tooltipContainer}>
            <div className={styles.marker}><i className="fa fa-circle" style={{color: node.colorForTest}} /></div>
            <div className={styles.title}>Sample id</div>
            <div>{node.id}</div>
            <div className={styles.title}>Location</div>
            <div>{node.locationName}</div>
            <div className={styles.title}>Date</div>
            <div>{node.date}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default PhyloCanvasTooltip;
