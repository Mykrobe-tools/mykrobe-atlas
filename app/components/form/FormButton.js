/* @flow */

import React, { Component } from 'react';

import styles from './FormButton.css';

class FormButton extends Component {

  constructor(props: Object) {
    super(props);
  }

  onClick(event: Event) {
    if (this.props.onClick) {
      this.props.onClick(event);
    }
  }

  render() {
    return (
      <div className={styles.wrap}>
        <button
          className={styles.input}
          onClick={this.onClick.bind(this)}
          type={this.props.type}>
          {this.props.label}
        </button>
      </div>
    );
  }
}

FormButton.propTypes = {
  label: React.PropTypes.string.isRequired,
  type: React.PropTypes.oneOf(['submit', 'button', 'reset']).isRequired,
  onClick: React.PropTypes.func
}

export default FormButton;
