/* @flow */

import React, { Component, PropTypes } from 'react';

import FormLabel from './FormLabel';

import styles from './FormSelect.css';

class FormSelect extends Component {

  constructor(props: Object) {
    super(props);
  }

  render() {
    const {name, onChange, options, placeholder, selectedOption, title} = this.props;
    return (
      <div className={styles.wrap}>
        <div className={styles.label}>
          <FormLabel
            htmlFor={name}
            label={title} />
        </div>
        <select
          className={styles.input}
          name={name}
          value={selectedOption}
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
    );
  }
}

FormSelect.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  selectedOption: PropTypes.string,
  title: PropTypes.string.isRequired
};

export default FormSelect;
