/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './Empty.scss';

class Empty extends React.Component<*> {
  render() {
    const { title, subtitle, children, icon } = this.props;
    return (
      <div className={styles.container} data-tid={'component-empty'}>
        <div className={styles.iconContainer}>
          <i className={`fa fa-${icon}`} />
        </div>
        <div className={styles.textContainer}>
          <div className={styles.title}>{title}</div>
          <div className={styles.subtitle}>{subtitle}</div>
        </div>
        {children}
      </div>
    );
  }

  static defaultProps = {
    title: 'No items',
    subtitle: 'This is empty',
    icon: 'flask',
  };
}

Empty.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  icon: PropTypes.string,
};

export default Empty;
