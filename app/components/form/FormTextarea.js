/* @flow */

import React, { Component } from 'react';

import FormLabel from './FormLabel';

import styles from './FormTextarea.css';

class FormTextarea extends Component {

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
        <textarea
          className={styles.input}
          id={this.props.name}
          name={this.props.name}
          rows={this.props.rows}
          style={this.props.resize ? null : {resize: 'none'}}
          value={this.props.value}
          placeholder={this.props.placeholder}
          onChange={this.props.onChange} />
      </div>
    );
  }
}

FormTextarea.propTypes = {
  title: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  rows: React.PropTypes.string.isRequired,
  resize: React.PropTypes.string,
  value: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired
}

export default FormTextarea;
