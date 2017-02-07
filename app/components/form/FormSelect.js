/* @flow */

import React, { Component, PropTypes } from 'react';

import FormLabel from './FormLabel';

import styles from './FormSelect.css';

class FormSelect extends Component {

  render() {
    const {name, onChange, options, placeholder, value, title} = this.props;
    return (
      <div className={styles.wrap}>
        <div className={styles.label}>
          <FormLabel
            htmlFor={name}
            label={title} />
        </div>
        <div className={styles.inputWrap}>
          <select
            className={styles.input}
            name={name}
            value={value}
            onChange={(event) => onChange(event)}>
            <option value="">{placeholder}</option>
            {options.map(opt => {
              return (
                <option
                  key={opt.value}
                  value={opt.value}>
                  {opt.label}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    );
  }
}

FormSelect.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  title: PropTypes.string.isRequired
};

export default FormSelect;
