/* @flow */

import React, { Component, PropTypes } from 'react';

import FormLabel from './FormLabel';

import styles from './FormInputRadio.css';

class FormInputRadio extends Component {

  render() {
    const {name, onChange, options, selectedOption, title} = this.props;
    return (
      <div className={styles.wrap}>
        <div className={styles.label}>
          <FormLabel
            htmlFor={name}
            label={title} />
        </div>
        <div className={styles.items}>
          {options.map(opt => {
            return (
              <div key={opt.value} className={styles.item}>
                <FormLabel label={opt.label}>
                  <input
                    className={styles.input}
                    name={name}
                    onChange={(event) => onChange(event)}
                    value={opt.value}
                    checked={selectedOption === opt.value}
                    type="radio" />
                </FormLabel>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

FormInputRadio.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  selectedOption: PropTypes.string,
  title: PropTypes.string.isRequired
};

export default FormInputRadio;
