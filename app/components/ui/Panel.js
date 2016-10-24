/* @flow */

import React, { PropTypes, Component } from 'react';
import styles from './Panel.css';

class Panel extends Component {
  render() {
    const {title, columns, children} = this.props;
    return (
      <div className={styles.panelContainer} style={{width: `${100 * columns / 8}%`}}>
        <div className={styles.panelContent}>
          {title && (
            <div className={styles.panelTitle}>
              {title}
            </div>
          )}
          <div className={styles.panelChildrenContainer}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  static defaultProps = {
    columns: 4
  };
}

Panel.propTypes = {
  title: PropTypes.string,
  columns: PropTypes.number,
  children: PropTypes.node
};

export default Panel;
