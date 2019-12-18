/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import styles from './MenuButton.scss';

class MenuButton extends React.Component<*> {
  onMenuToggleClick = (e: Event) => {
    const { toggleMenu } = this.props;
    e.preventDefault();
    toggleMenu();
  };

  render() {
    const { displayMenu } = this.props;
    return (
      <div className={styles.container}>
        <a
          href="#"
          className={styles.menuToggle}
          onClick={this.onMenuToggleClick}
        >
          <span
            className={displayMenu ? styles.menuIconClose : styles.menuIconOpen}
          />
        </a>
      </div>
    );
  }
}

MenuButton.propTypes = {
  displayMenu: PropTypes.bool,
  toggleMenu: PropTypes.func,
};

export default MenuButton;
