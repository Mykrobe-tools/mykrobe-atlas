/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './PopoverMenu.css';

class PopoverMenu extends React.Component {
  timeout = Number;
  state = {
    isActive: Boolean,
  };

  constructor(props: Object) {
    super(props);
    this.state = {
      isActive: false,
    };
  }

  showPopover(e: Event) {
    e.preventDefault();
    this.setState({
      isActive: true,
    });
  }

  hidePopover(e: Event) {
    e.preventDefault();
    this.setState({
      isActive: false,
    });
  }

  render() {
    const { links, toggleText } = this.props;
    const { isActive } = this.state;
    let menuContent = links.map((link, id) => (
      <li key={id} className={styles.popoverItem}>
        <a
          href="#"
          className={styles.popoverLink}
          onFocus={e => this.showPopover(e)}
          onClick={e => link.onClick(e)}
        >
          {link.text}
        </a>
      </li>
    ));
    return (
      <div className={styles.container} onBlur={e => this.hidePopover(e)}>
        <a
          href="#"
          className={styles.toggle}
          onClick={e => this.showPopover(e)}
        >
          {toggleText}
          <span className={styles.toggleArrow}>
            <i className="fa fa-caret-down" />
          </span>
        </a>
        <div
          className={isActive ? styles.popoverAbove : styles.popoverAboveHidden}
        >
          <ul className={styles.popoverList}>{menuContent}</ul>
        </div>
      </div>
    );
  }
}

PopoverMenu.propTypes = {
  toggleText: PropTypes.string.isRequired,
  links: PropTypes.array.isRequired,
};

export default PopoverMenu;
