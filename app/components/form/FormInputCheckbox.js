/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import FormLabel from './FormLabel';

import styles from './FormInputCheckbox.scss';

class FormInputCheckbox extends React.Component<*> {
  render() {
    const { name, onChange, options, selectedOptions, title } = this.props;
    return (
      <div className={styles.wrap}>
        <div className={styles.label}>
          <FormLabel htmlFor={name} label={title} />
        </div>
        <div className={styles.items}>
          {options.map(opt => {
            return (
              <div key={opt.value} className={styles.item}>
                <FormLabel label={opt.label}>
                  <input
                    className={styles.input}
                    name={name}
                    onChange={event => onChange(event)}
                    value={opt.value}
                    checked={selectedOptions.indexOf(opt.value) > -1}
                    type="checkbox"
                  />
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
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  selectedOptions: PropTypes.array,
  title: PropTypes.string.isRequired,
};

export default FormInputCheckbox;
