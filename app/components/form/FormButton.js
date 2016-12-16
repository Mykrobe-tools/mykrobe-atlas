/* @flow */

import React, { Component, PropTypes } from 'react';

import styles from './FormButton.css';

class FormButton extends Component {

  constructor(props: Object) {
    super(props);
  }

  render() {
    const {label, type, onClick} = this.props;
    return (
      <div className={styles.wrap}>
        <button
          className={styles.input}
          onClick={(event) => onClick(event)}
          type={type}>
          {label}
        </button>
      </div>
    );
  }
}

FormButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['submit', 'button', 'reset']).isRequired
}

export default FormButton;
