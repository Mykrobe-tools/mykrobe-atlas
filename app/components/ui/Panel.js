/* @flow */

import React, { PropTypes, Component } from 'react';
import styles from './Panel.css';

class Panel extends Component {
  render() {
    const { title, columns, children } = this.props;
    let style;
    if (columns) {
      style = { width: `${100 * columns / 8}%`, flex: 'initial' };
    }
    return (
      <div className={styles.panelContainer} style={style}>
        <div className={styles.panelContent}>
          {title && <div className={styles.panelTitle}>{title}</div>}
          <div className={styles.panelChildrenContainer}>{children}</div>
        </div>
      </div>
    );
  }
}

Panel.propTypes = {
  title: PropTypes.string,
  columns: PropTypes.number,
  children: PropTypes.node,
};

export default Panel;
