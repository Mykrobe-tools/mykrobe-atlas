/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import styles from './FormButton.scss';

class FormButton extends React.Component<*> {
  onClick(event: Event) {
    const { onClick } = this.props;
    if (onClick) {
      event.preventDefault();
      onClick(event);
    }
  }

  render() {
    const { label, type } = this.props;
    return (
      <div className={styles.wrap}>
        <button
          className={styles.input}
          onClick={event => this.onClick(event)}
          type={type}
        >
          {label}
        </button>
      </div>
    );
  }
}

FormButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['submit', 'button', 'reset']).isRequired,
};

export default FormButton;
