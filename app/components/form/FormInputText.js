/* @flow */

import React, { Component } from 'react';

import FormLabel from './FormLabel';

import styles from './FormInputText.css';

class FormInputText extends Component {

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
        <input
          className={styles.input}
          id={this.props.name}
          name={this.props.name}
          type={this.props.type}
          value={this.props.value}
          placeholder={this.props.placeholder}
          onChange={this.props.onChange} />
      </div>
    );
  }
}

FormInputText.propTypes = {
  title: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  placeholder: React.PropTypes.string,
  type: React.PropTypes.oneOf(['text', 'number', 'email', 'tel', 'search', 'password']).isRequired,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  onChange: React.PropTypes.func.isRequired
}

export default FormInputText;
