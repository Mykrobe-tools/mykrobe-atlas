/* @flow */

import React, { Component } from 'react';

import FormLabel from './FormLabel';

import styles from './FormInputCheckbox.css';

class FormInputCheckbox extends Component {

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
        <div className={styles.items}>
          {this.props.options.map(opt => {
            return (
              <div className={styles.item}>
                <FormLabel
                  key={opt.value}
                  label={opt.label}>
                  <input
                    className={styles.input}
                    name={this.props.name}
                    onChange={this.props.onChange.bind(this)}
                    value={opt.value}
                    checked={this.props.selectedOptions.indexOf(opt.value) > -1}
                    type="checkbox" />
                </FormLabel>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

FormInputCheckbox.propTypes = {
  title: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  options: React.PropTypes.array.isRequired,
  selectedOptions: React.PropTypes.array,
  onChange: React.PropTypes.func.isRequired
}

export default FormInputCheckbox;
