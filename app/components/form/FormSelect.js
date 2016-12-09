/* @flow */

import React, { Component } from 'react';

import FormLabel from './FormLabel';

import styles from './FormSelect.css';

class FormSelect extends Component {

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
        <select
          className={styles.input}
          name={this.props.name}
          value={this.props.selectedOption}
          onChange={this.props.onChange.bind(this)}>
          <option value="">{this.props.placeholder}</option>
          {this.props.options.map(opt => {
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
  title: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  options: React.PropTypes.array.isRequired,
  selectedOption: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired
};

export default FormSelect;
