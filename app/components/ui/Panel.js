import React, { Component } from 'react';
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
}

Panel.defaultProps = {
  columns: 4
};

export default Panel;
