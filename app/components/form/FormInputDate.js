/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import FormLabel from './FormLabel';

import styles from './FormInputDate.css';

class FormInputDate extends React.Component {
  render() {
    const { name, onChange, title, value } = this.props;
    return (
      <div className={styles.wrap}>
        <div className={styles.label}>
          <FormLabel htmlFor={name} label={title} />
        </div>
        <DatePicker
          className={styles.input}
          name={name}
          selected={value && value.length > 0 ? moment(value) : moment()}
          onChange={date => onChange(date)}
        />
      </div>
    );
  }
}

FormInputDate.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default FormInputDate;
