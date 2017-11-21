/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import FormLabel from './FormLabel';

import styles from './FormSelect.css';

class FormSelect extends React.Component {
  render() {
    const { name, onChange, options, placeholder, value, title } = this.props;
    return (
      <div className={styles.wrap}>
        {title && (
          <div className={styles.label}>
            <FormLabel htmlFor={name} label={title} />
          </div>
        )}
        <div className={styles.inputWrap}>
          <select
            className={styles.input}
            name={name}
            value={value}
            onChange={event => onChange(event)}
          >
            <option value="">{placeholder}</option>
            {options.map(opt => {
              return (
                <option key={opt.value} value={opt.value}>
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
  title: PropTypes.string,
};

export default FormSelect;
