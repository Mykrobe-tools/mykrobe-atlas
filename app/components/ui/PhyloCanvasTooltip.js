import React, { Component, PropTypes } from 'react';
import styles from './PhyloCanvasTooltip.css';

class PhyloCanvasTooltip extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      node: {
        id: -1,
        date: 'Not defined',
        locationName: 'Not defined'
      },
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
        <div className={styles.tooltipWrapper}>
          <div className={styles.tooltipContainer}>
            <div className={styles.title}>Sample id</div>
            <div>{node.id}</div>
            <div className={styles.title}>Location</div>
            <div>{node.locationName}</div>
            <div className={styles.title}>Date</div>
            <div>{node.date}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default PhyloCanvasTooltip;
