/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './Panel.css';

class Panel extends React.Component {
  render() {
    const { title, columns, children } = this.props;
    let style;
    if (columns) {
      style = { flexBasis: `${100 * columns / 8}%`, flexGrow: 0 };
    }
    const tidTitle = title.replace(/\s/g, '-').toLowerCase();
    const tid = `panel-${tidTitle}`;
    return (
      <div className={styles.panelContainer} style={style} data-tid={tid}>
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
