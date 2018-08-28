/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { DatePicker } from 'makeandship-js-common/src/components/ui/form';

import { shortestTitleForChoiceWithKeyInChoices } from './util';

import styles from './ChoiceFilterDateRange.scss';

import type { Choice } from './types';

type State = {
  min?: string,
  max?: string,
};

class ChoiceFilterDateRange extends React.Component<*, State> {
  state = {};

  constructor(props: any) {
    super(props);
    this.state = this.minMaxFromProps(props);
  }

  minMaxFromProps = (props: any): State => {
    const { choices, choicesFilters, choiceKey } = props;
    const choice: Choice = choices[choiceKey];
    const choiceFilter: Choice = choicesFilters[choiceKey];
    // defaults from choice data
    let { max, min } = choice;
    // override if they are set in the filters
    if (choiceFilter) {
      if (choiceFilter.min) {
        min = choiceFilter.min;
      }
      if (choiceFilter.max) {
        max = choiceFilter.max;
      }
    }
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

  onMinChange = (min: string) => {
    const { choiceKey, onChange } = this.props;
    // allow user to select any start date, make sure that the current max doesn't overlap
    const max = moment.max(moment(min), moment(this.state.max)).format();
    this.setState({
      min,
      max,
    });
    onChange(choiceKey, {
      min,
      max,
    });
  };

  onMaxChange = (max: string) => {
    const { choiceKey, onChange } = this.props;
    this.setState({
      max,
    });
    onChange(choiceKey, {
      min: this.state.min,
      max,
    });
  };

  customInput = (value?: string) => (
    <div>
      <div className={styles.customInput}>
        <a href="#" onClick={e => e.preventDefault()}>
          {moment(value).format(DatePicker.defaultProps.dateFormat)}{' '}
          <i className={'fa fa-caret-down'} />
        </a>
      </div>
    </div>
  );

  render() {
    const { choices, choiceKey } = this.props;
    const { max, min } = this.state;
    const choice: Choice = choices[choiceKey];
    const displayTitle = shortestTitleForChoiceWithKeyInChoices(
      choiceKey,
      choices
    );
    return (
      <div className={styles.componentWrap}>
        {displayTitle}
        {' · '}
        <DatePicker
          customInput={this.customInput(min)}
          value={min}
          selectsStart
          startDate={moment(min)}
          endDate={moment(max)}
          minDate={moment(choice.min)}
          maxDate={moment(choice.max)}
          onChange={this.onMinChange}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
        {' – '}
        <DatePicker
          customInput={this.customInput(max)}
          value={max}
          selectsEnd
          startDate={moment(min)}
          endDate={moment(max)}
          minDate={moment(min)}
          maxDate={moment(choice.max)}
          onChange={this.onMaxChange}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
      </div>
    );
  }
}

ChoiceFilterDateRange.propTypes = {
  choicesFilters: PropTypes.object.isRequired,
  choices: PropTypes.object.isRequired,
  choiceKey: PropTypes.string.isRequired,
  placeholder: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ChoiceFilterDateRange;
