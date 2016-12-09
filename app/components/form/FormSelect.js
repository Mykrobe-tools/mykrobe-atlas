/* @flow */

import React, { Component } from 'react';

import FormLabel from './FormLabel';

class FormSelect extends Component {

  constructor(props: Object) {
    super(props);
  }

  render() {
    return (
      <div>
        <FormLabel
          htmlFor={this.props.name}
          label={this.props.title} />
        <select
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
