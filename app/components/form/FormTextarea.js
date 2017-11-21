/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import FormLabel from './FormLabel';

import styles from './FormTextarea.css';

class FormTextarea extends React.Component {
  render() {
    const {
      name,
      onChange,
      placeholder,
      resize,
      rows,
      title,
      value,
    } = this.props;
    return (
      <div className={styles.wrap}>
        <div className={styles.label}>
          <FormLabel htmlFor={name} label={title} />
        </div>
        <textarea
          className={styles.input}
          id={name}
          name={name}
          rows={rows}
          style={resize ? null : { resize: 'none' }}
          value={value}
          placeholder={placeholder}
          onChange={event => onChange(event)}
        />
      </div>
    );
  }
}

FormTextarea.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  resize: PropTypes.string,
  rows: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default FormTextarea;
