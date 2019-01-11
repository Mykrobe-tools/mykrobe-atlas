/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import is from 'is_js';

import { Select } from 'makeandship-js-common/src/components/ui/form';

import { shortestTitleForChoiceWithKeyInChoices } from './util';

import styles from './ChoiceFilterSelect.scss';

import type { Choice } from './types';

class ChoiceFilterSelect extends React.Component<*> {
  render() {
    const {
      choices,
      choicesFilters,
      choiceKey,
      placeholder,
      onChange,
    } = this.props;
    const choice: Choice = choices[choiceKey];
    const options =
      choice.choices &&
      choice.choices.map(value => {
        return {
          value: value.key,
          label: `${value.key} (${value.count})`,
        };
      });
    const displayTitle = shortestTitleForChoiceWithKeyInChoices(
      choiceKey,
      choices
    );
    const value = placeholder ? '' : choicesFilters[choiceKey];
    const displayValue = placeholder
      ? displayTitle
      : `${displayTitle} · ${choicesFilters[choiceKey]}`;
    const initiallyOpen = placeholder && !is.ie(); // initiallyOpen throws on IE
    return (
      <div className={styles.select}>
        <div className={styles.widthSizer}>{displayValue}</div>
        <Select
          name={choiceKey}
          value={value}
          valueComponent={({ value }) => {
            return (
              <div className="Select-value" title={value.label}>
                <span className="Select-value-label">{displayValue}</span>
              </div>
            );
          }}
          onChange={onChange}
          placeholder={displayTitle}
          options={options}
          clearable={false}
          initiallyOpen={initiallyOpen}
          searchable
          wideMenu
        />
      </div>
    );
  }
}

ChoiceFilterSelect.propTypes = {
  choicesFilters: PropTypes.object.isRequired,
  choices: PropTypes.object.isRequired,
  choiceKey: PropTypes.string.isRequired,
  placeholder: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ChoiceFilterSelect;
