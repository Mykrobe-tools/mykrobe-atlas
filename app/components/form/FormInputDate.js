/* @flow */

import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import FormLabel from './FormLabel';

import styles from './FormInputDate.css';

class FormInputDate extends Component {

  render() {
    const {name, onChange, title, value} = this.props;
    return (
      <div className={styles.wrap}>
        <div className={styles.label}>
          <FormLabel
            htmlFor={name}
            label={title} />
        </div>
        <DatePicker
          className={styles.input}
          name={name}
          selected={value && value.length > 0 ? moment(value) : moment()}
          onChange={(date) => onChange(date)}
        />
      </div>
    );
  }
}

FormInputDate.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string
};

export default FormInputDate;
