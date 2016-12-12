/* @flow */

import React, { Component, PropTypes } from 'react';

import FormLabel from './FormLabel';

import styles from './FormInputText.css';

class FormInputText extends Component {

  constructor(props: Object) {
    super(props);
  }

  render() {
    const {name, onChange, placeholder, title, type, value} = this.props;
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
          value={value}
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
    PropTypes.number,
  ])
}

export default FormInputText;
