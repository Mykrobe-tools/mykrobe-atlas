/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import { Select } from 'makeandship-js-common/src/components/ui/form';

import { shortestTitleForChoiceWithKeyInChoices } from './util';

import styles from './ChoiceFilterNumericRange.scss';

import type { Choice } from './types';

type State = {
  min?: number,
  max?: number,
};

class ChoiceFilterNumericRange extends React.Component<*, State> {
  state = {};

  constructor(props: any) {
    super(props);
    this.state = this.minMaxFromProps(props);
  }

  minMaxFromProps = (props: any): State => {
    const { choices, choiceKey } = props;
    const choice: Choice = choices[choiceKey];
    const { max, min } = choice;
    return {
      min,
      max,
    };
  };

  componentDidUpdate = (prevProps: any) => {
    const minMax = this.minMaxFromProps(this.props);
    const prevMinMax = this.minMaxFromProps(prevProps);
    if (minMax.min !== prevMinMax.min || minMax.max !== prevMinMax.max) {
      this.setState(minMax);
    }
  };

  onMinChange = (min: number) => {
    const { choiceKey, onChange } = this.props;
    // allow user to select any min, make sure that the current max doesn't overlap
    const max = Math.max(min, this.state.max);
    this.setState({
      min,
      max,
    });
    onChange(choiceKey, {
      min,
      max,
    });
  };

  onMaxChange = (max: number) => {
    const { choiceKey, onChange } = this.props;
    this.setState({
      max,
    });
    onChange(choiceKey, {
      min: this.state.min,
      max,
    });
  };

  customInput = (value?: number) => (
    <div>
      <div className={styles.customInput}>
        <a href="#" onClick={e => e.preventDefault()}>
          {value} <i className={'fa fa-caret-down'} />
        </a>
      </div>
    </div>
  );

  render() {
    const { choices, choiceKey, placeholder } = this.props;
    const { max, min } = this.state;
    const choice: Choice = choices[choiceKey];
    const displayTitle = shortestTitleForChoiceWithKeyInChoices(
      choiceKey,
      choices
    );
    let minOptions = [];
    for (let i: number = choice.min; i <= choice.max; i++) {
      minOptions.push({
        value: i,
        label: `${i}`,
      });
    }
    let maxOptions = [];
    for (let i: number = min; i <= choice.max; i++) {
      maxOptions.push({
        value: i,
        label: `${i}`,
      });
    }
    return (
      <div className={styles.componentWrap}>
        {displayTitle}
        {' · '}
        <div className={styles.select}>
          <div className={styles.widthSizer}>{min}</div>

          <Select
            value={min}
            options={minOptions}
            onChange={this.onMinChange}
            autosize
            initiallyOpen={placeholder}
            searchable
            wideMenu
          />
        </div>
        {' – '}
        <div className={styles.select}>
          <div className={styles.widthSizer}>{max}</div>

          <Select
            value={max}
            options={maxOptions}
            onChange={this.onMaxChange}
            autosize
            searchable
            wideMenu
          />
        </div>
      </div>
    );
  }
}

ChoiceFilterNumericRange.propTypes = {
  choicesFilters: PropTypes.object.isRequired,
  choices: PropTypes.object.isRequired,
  choiceKey: PropTypes.string.isRequired,
  placeholder: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ChoiceFilterNumericRange;
