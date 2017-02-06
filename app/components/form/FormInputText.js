/* @flow */

import React, { Component, PropTypes } from 'react';

import FormLabel from './FormLabel';

import styles from './FormInputText.css';

class FormInputText extends Component {

  render() {
    const {name, onChange, placeholder, title, type, value} = this.props;
    const initialValue = value || ''; /* don't pass undefined value https://github.com/facebook/react/issues/6222  */
    return (
      <div className={styles.wrap}>
        <div className={styles.label}>
          <FormLabel
            htmlFor={name}
            label={title} />
        </div>
        <input
          className={styles.input}
          id={name}
          name={name}
          type={type}
          value={initialValue}
          placeholder={placeholder}
          onChange={(event) => onChange(event)} />
      </div>
    );
  }
}

FormInputText.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'number', 'email', 'tel', 'search', 'password']).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};

export default FormInputText;
