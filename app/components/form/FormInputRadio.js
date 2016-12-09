/* @flow */

import React, { Component } from 'react';

import FormLabel from './FormLabel';

class FormInputRadio extends Component {

  constructor(props: Object) {
    super(props);
  }

  render() {
    return (
      <div>
        <FormLabel
          htmlFor={this.props.name}
          label={this.props.title} />
        <div>
          {this.props.options.map(opt => {
            return (
              <FormLabel
                key={opt.value}
                label={opt.label}>
                <input
                  name={this.props.name}
                  onChange={this.props.onChange.bind(this)}
                  value={opt.value}
                  checked={this.props.selectedOption === opt.value}
                  type="radio" />
              </FormLabel>
            );
          })}
        </div>
      </div>
    );
  }
}

FormInputRadio.propTypes = {
  title: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  options: React.PropTypes.array.isRequired,
  selectedOption: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired
}

export default FormInputRadio;
