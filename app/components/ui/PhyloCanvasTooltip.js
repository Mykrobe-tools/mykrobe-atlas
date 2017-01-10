/* @flow */

import React, { Component } from 'react';
import styles from './PhyloCanvasTooltip.css';
import type { Sample } from '../../types/Sample';
import moment from 'moment';

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
            <div className={styles.marker}><i className="fa fa-circle" style={{color: '#f90'}} /></div>
            <div className={styles.title}>Sample id</div>
            <div>{node._id}</div>
            <div className={styles.title}>Location</div>
            <div>{node.location.name}</div>
            <div className={styles.title}>Date</div>
            <div>{moment(node.collected_at).format('LLL')}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default PhyloCanvasTooltip;
