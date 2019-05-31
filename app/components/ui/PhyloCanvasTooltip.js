/* @flow */

import * as React from 'react';
import styles from './PhyloCanvasTooltip.scss';
import type { SampleType } from '../../types/SampleType';
import moment from 'moment';
import _get from 'lodash.get';

import * as Colors from '../../constants/Colors';

type State = {
  visible: boolean,
  isMain: boolean,
  node: ?SampleType,
  x: number,
  y: number,
};

class PhyloCanvasTooltip extends React.Component<*, State> {
  static defaultProps = {
    visible: false,
    isMain: false,
    node: null,
    x: 0,
    y: 0,
  };

  constructor(props: any) {
    super(props);
    this.state = {
      ...this.props,
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
    const isolateId = _get(node, 'metadata.sample.isolateId') || '–';
    const countryIsolate = _get(node, 'metadata.sample.countryIsolate') || '–';
    const cityIsolate = _get(node, 'metadata.sample.cityIsolate') || '–';
    const collected = _get(node, 'collected');
    const date = collected ? moment(collected).format('LLL') : '–';
    return (
      <div className={styles.tooltip} style={{ left: x, top: y }}>
        <div className={styles.tooltipWrapper}>
          <div className={styles.tooltipContainer}>
            <div className={styles.marker}>
              <i
                className="fa fa-circle"
                style={{
                  color: isMain
                    ? Colors.COLOR_HIGHLIGHT_EXPERIMENT_FIRST
                    : Colors.COLOR_HIGHLIGHT_EXPERIMENT,
                }}
              />
            </div>
            <div className={styles.title}>Isolate Id</div>
            <div>{isolateId}</div>
            <div className={styles.title}>Location</div>
            <div>
              {cityIsolate} · {countryIsolate}
            </div>
            <div className={styles.title}>Date</div>
            <div>{date}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default PhyloCanvasTooltip;
