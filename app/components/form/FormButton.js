/* @flow */

import React, { Component, PropTypes } from 'react';

import styles from './FormButton.css';

class FormButton extends Component {

  onClick(event: Event) {
    const {onClick} = this.props;
    if (onClick) {
      event.preventDefault();
      onClick(event);
    }
  }

  render() {
    const {label, type} = this.props;
    return (
      <div className={styles.wrap}>
        <button
          className={styles.input}
          onClick={(event) => this.onClick(event)}
          type={type}>
          {label}
        </button>
      </div>
    );
  }
}

FormButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['submit', 'button', 'reset']).isRequired
};

export default FormButton;
