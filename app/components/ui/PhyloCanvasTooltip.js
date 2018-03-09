/* @flow */

import * as React from 'react';
import styles from './PhyloCanvasTooltip.css';
import type { SampleType } from '../../types/SampleType';
import moment from 'moment';

type State = {
  visible: boolean,
  isMain: boolean,
  node: ?SampleType,
  x: number,
  y: number,
};

class PhyloCanvasTooltip extends React.Component<*, State> {
  constructor() {
    super();
    this.state = {
      visible: false,
      isMain: false,
      node: null,
      x: 0,
      y: 0,
    };
  }

  setVisible(visible: boolean, x: number = 100, y: number = 100) {
    this.setState({
      visible,
      x,
      y,
    });
  }

  setNode(node: SampleType, isMain: boolean = false) {
    this.setState({
      node,
      isMain,
    });
  }

  render() {
    const { visible, isMain, node, x, y } = this.state;
    if (!visible || !node) {
      return null;
    }
    return (
      <div className={styles.tooltip} style={{ left: x, top: y }}>
        <div className={styles.tooltipWrapper}>
          <div className={styles.tooltipContainer}>
            <div className={styles.marker}>
              <i
                className="fa fa-circle"
                style={{ color: isMain ? '#c30042' : '#0f82d0' }}
              />
            </div>
            <div className={styles.title}>Sample id</div>
            <div>{node.id}</div>
            <div className={styles.title}>Location</div>
            <div>{node.location.name}</div>
            <div className={styles.title}>Date</div>
            <div>{moment(node.collected).format('LLL')}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default PhyloCanvasTooltip;
