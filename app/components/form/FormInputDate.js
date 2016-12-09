/* @flow */

import React, { Component } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import FormLabel from './FormLabel';

import styles from './FormInputDate.css';

class FormInputDate extends Component {

  constructor(props: Object) {
    super(props);
  }

  render() {
    return (
      <div className={styles.wrap}>
        <div className={styles.label}>
          <FormLabel
            htmlFor={this.props.name}
            label={this.props.title} />
        </div>
        <DatePicker
          className={styles.input}
          name={this.props.name}
          selected={this.props.value.length > 0 ? moment(this.props.value) : moment()}
          onChange={(date) => this.props.onChange(date)}
        />
      </div>
    );
  }
}

FormInputDate.propTypes = {
  title: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  value: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired
}

export default FormInputDate;
